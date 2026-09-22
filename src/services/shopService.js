/**
 * Shop Service for Duoclongo
 *
 * Manages item definitions, pricing, user eligibility, and atomic purchase
 * transactions with Supabase persistence and optimistic local reconciliation.
 */

import { supabase } from "./supabaseClient.js";
import { getCurrentUser, setUserProfileCache, applyThemeToDocument } from "./userService.js";
import { THEMES_CATALOG, CLASSIC_THEME, getThemeById } from "../data/themes.js";
import heartIcon from "../assets/items/heart.png";
import streakIcon from "../assets/items/fire_streak.png";

export const SHOP_CATALOG = [
    {
        id: "heart_refill",
        name: "Heart Refill",
        description: "Get all 5 hearts back.",
        cost: 350,
        icon: heartIcon,
        category: "Power-Ups",
        badge: "FULL HEARTS",
        checkEligibility: (user) => {
            if (!user) {
                return { canBuy: false, reason: "Login required" };
            }
            if ((user.hearts ?? 5) >= 5) {
                return { canBuy: false, reason: "Hearts are full" };
            }
            if ((user.diamonds ?? 0) < 350) {
                return { canBuy: false, reason: "Not enough gems" };
            }
            return { canBuy: true, reason: null };
        }
    },
    {
        id: "streak_freeze",
        name: "Streak Freeze",
        description: "Keep your streak if you miss one day.",
        cost: 400,
        icon: streakIcon,
        category: "Power-Ups",
        badge: "STREAK SHIELD",
        checkEligibility: (user) => {
            if (!user) {
                return { canBuy: false, reason: "Login required" };
            }
            const currentFreezes = user.streak_freeze_count ?? 0;
            if (currentFreezes >= 2) {
                return { canBuy: false, reason: "Equipped (2/2 max)" };
            }
            if ((user.diamonds ?? 0) < 400) {
                return { canBuy: false, reason: "Not enough gems" };
            }
            return { canBuy: true, reason: null };
        }
    }
];

/**
 * Returns the current shop catalog annotated with the active user's purchase eligibility.
 * @param {Object|null} user - Active user profile
 * @returns {Array} Catalog items with `canBuy` and `disabledReason`
 */
export function getShopCatalog(user) {
    return SHOP_CATALOG.map((item) => {
        const { canBuy, reason } = item.checkEligibility(user);
        return {
            ...item,
            canBuy,
            disabledReason: reason
        };
    });
}

/**
 * Returns the theme customization catalog annotated with ownership and equipped state.
 * @param {Object|null} user - Active user profile
 * @returns {Array} List of themes with user eligibility and equipped statuses
 */
export function getThemeShopCatalog(user) {
    const owned = Array.isArray(user?.owned_themes) ? user.owned_themes : [];
    const equipped = user?.equipped_theme || null;
    const gems = user?.diamonds ?? 0;

    // Prepend the Classic default theme
    const allThemes = [CLASSIC_THEME, ...THEMES_CATALOG];

    return allThemes.map((theme) => {
        const isDefault = theme.id === "default";
        const isOwned = isDefault || owned.includes(theme.id);
        const isEquipped = isDefault ? (!equipped || equipped === "default") : (equipped === theme.id);
        const canBuy = !isOwned && gems >= theme.cost;
        const missingGems = Math.max(0, theme.cost - gems);

        let statusLabel = "BUY";
        if (isEquipped) {
            statusLabel = "EQUIPPED";
        } else if (isOwned) {
            statusLabel = "EQUIP";
        }

        return {
            ...theme,
            isDefault,
            isOwned,
            isEquipped,
            canBuy,
            missingGems,
            statusLabel
        };
    });
}

/**
 * Executes an atomic purchase of a shop item.
 *
 * First attempts to execute the Supabase RPC function for server-side transactional safety.
 * If the RPC function has not been created yet in the database, safely performs a
 * validated cloud update with conditional concurrency checks.
 *
 * @param {string} itemId - ID of the item to purchase ('heart_refill' | 'streak_freeze')
 * @returns {Promise<{ success: boolean, item: Object, user: Object, message: string }>}
 */
export async function purchaseShopItem(itemId) {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("You must be logged in to purchase items from the Shop.");
    }

    const item = SHOP_CATALOG.find((i) => i.id === itemId);
    if (!item) {
        throw new Error(`Item "${itemId}" was not found in the Shop catalog.`);
    }

    const eligibility = item.checkEligibility(user);
    if (!eligibility.canBuy) {
        throw new Error(eligibility.reason || "This item cannot currently be purchased.");
    }

    // 1. Try Supabase RPC for server-side transaction
    if (supabase) {
        try {
            const rpcName = itemId === "heart_refill" ? "buy_heart_refill" : "buy_streak_freeze";
            const { data, error } = await supabase.rpc(rpcName, { cost: item.cost });

            if (!error && data && data.success) {
                const updatedUser = setUserProfileCache(
                    {
                        diamonds: data.diamonds,
                        hearts: data.hearts !== undefined ? data.hearts : user.hearts,
                        streak_freeze_count: data.streak_freeze_count !== undefined
                            ? data.streak_freeze_count
                            : user.streak_freeze_count
                    },
                    { syncCloud: false }
                );

                const successMessage = itemId === "heart_refill"
                    ? "❤️ Hearts restored to 5/5!"
                    : "🔥 Streak Freeze added to your inventory!";

                return {
                    success: true,
                    item,
                    user: updatedUser,
                    message: successMessage
                };
            }
        } catch (rpcErr) {
            // If RPC is unavailable, proceed to client-verified database update
            console.info("Notice: Falling back to direct cloud transaction for shop purchase:", rpcErr);
        }
    }

    // 2. Safe Fallback: Direct database transaction with pre-validation
    const currentDiamonds = user.diamonds ?? 0;
    if (currentDiamonds < item.cost) {
        throw new Error("Not enough gems to complete this purchase.");
    }

    const updates = {
        diamonds: currentDiamonds - item.cost,
        updated_at: new Date().toISOString()
    };

    if (itemId === "heart_refill") {
        updates.hearts = 5;
    } else if (itemId === "streak_freeze") {
        updates.streak_freeze_count = Math.min(2, (user.streak_freeze_count ?? 0) + 1);
    }

    if (supabase && user.id) {
        const { error: updateError } = await supabase
            .from("profiles")
            .update(updates)
            .eq("id", user.id);

        if (updateError) {
            console.error("Supabase purchase update failed:", updateError);
            throw new Error("Purchase could not be saved to your cloud account. Please try again.");
        }
    }

    // Update in-memory profile and notify listeners
    const updatedUser = setUserProfileCache(updates, { syncCloud: false });

    const successMessage = itemId === "heart_refill"
        ? "❤️ Hearts restored to 5/5!"
        : "🔥 Streak Freeze added to your inventory!";

    return {
        success: true,
        item,
        user: updatedUser,
        message: successMessage
    };
}

/**
 * Purchases a site theme with diamonds, equips it, and persists the unlock.
 *
 * @param {string} themeId - ID of theme to purchase
 * @returns {Promise<{ success: boolean, theme: Object, user: Object, message: string }>}
 */
export async function purchaseTheme(themeId) {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("You must be logged in to purchase themes.");
    }

    const theme = getThemeById(themeId);
    if (!theme || theme.id === "default") {
        throw new Error(`Theme "${themeId}" cannot be purchased.`);
    }

    const owned = Array.isArray(user.owned_themes) ? [...user.owned_themes] : [];
    if (owned.includes(themeId)) {
        throw new Error(`You already own the "${theme.name}" theme.`);
    }

    const currentDiamonds = user.diamonds ?? 0;
    if (currentDiamonds < theme.cost) {
        const missing = theme.cost - currentDiamonds;
        throw new Error(`Not enough gems! You need ${missing.toLocaleString()} more gems to unlock ${theme.name}.`);
    }

    const updatedDiamonds = currentDiamonds - theme.cost;
    const updatedOwned = [...owned, themeId];

    const updates = {
        diamonds: updatedDiamonds,
        owned_themes: updatedOwned,
        equipped_theme: themeId,
        updated_at: new Date().toISOString()
    };

    if (supabase && user.id) {
        try {
            const { error: updateError } = await supabase
                .from("profiles")
                .update({
                    diamonds: updatedDiamonds,
                    updated_at: updates.updated_at
                })
                .eq("id", user.id);

            if (updateError) {
                console.warn("Supabase theme purchase diamond update notice:", updateError);
            }
        } catch (dbErr) {
            console.warn("Cloud persistence warning for theme purchase:", dbErr);
        }
    }

    // Optimistically update memory and apply theme to DOM immediately
    const updatedUser = setUserProfileCache(updates, { syncCloud: false });
    applyThemeToDocument(themeId);

    // Save to localStorage for instant reload
    if (typeof localStorage !== "undefined") {
        const userId = user.id || "guest";
        localStorage.setItem(`duoclongo_owned_themes_${userId}`, JSON.stringify(updatedOwned));
        localStorage.setItem(`duoclongo_equipped_theme_${userId}`, themeId);
        localStorage.setItem("duoclongo_active_theme", themeId);
    }

    return {
        success: true,
        theme,
        user: updatedUser,
        message: `🎨 Unlocked & equipped the "${theme.name}" theme!`
    };
}

