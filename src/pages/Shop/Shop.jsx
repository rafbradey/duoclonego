import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
    ShoppingBag,
    CheckCircle,
    AlertCircle,
    X,
    BookOpen,
    Loader2,
    Sparkles,
    ArrowRight,
    Palette,
    Eye,
    Check
} from "lucide-react";
import { getCurrentUser, equipTheme } from "../../services/userService.js";
import { getShopCatalog, purchaseShopItem, getThemeShopCatalog, purchaseTheme } from "../../services/shopService.js";
import diamondIcon from "../../assets/items/diamond.png";
import heartIcon from "../../assets/items/heart.png";
import "./Shop.css";

function Shop() {
    const [user, setUser] = useState(null);
    const [purchasingId, setPurchasingId] = useState(null);
    const [actionThemeId, setActionThemeId] = useState(null);
    const [themeRarityFilter, setThemeRarityFilter] = useState("all");
    const [toast, setToast] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function loadUser() {
            try {
                const currentUser = await getCurrentUser();
                if (isMounted) {
                    setUser(currentUser);
                }
            } catch (err) {
                console.error("Failed to load user for Shop:", err);
            }
        }

        loadUser();

        const handleUserUpdate = (e) => {
            if (e.detail?.user) {
                setUser(e.detail.user);
            }
        };

        window.addEventListener("duoclongo:user-updated", handleUserUpdate);

        return () => {
            isMounted = false;
            window.removeEventListener("duoclongo:user-updated", handleUserUpdate);
        };
    }, []);

    const handlePurchaseItem = async (item) => {
        if (purchasingId || actionThemeId) return;

        setPurchasingId(item.id);
        setToast(null);

        try {
            const result = await purchaseShopItem(item.id);
            setToast({
                type: "success",
                message: result.message
            });
        } catch (err) {
            setToast({
                type: "error",
                message: err.message || "Failed to complete purchase. Please try again."
            });
        } finally {
            setPurchasingId(null);
        }
    };

    const handleEquipTheme = async (themeId) => {
        if (actionThemeId || purchasingId) return;

        setActionThemeId(themeId);
        setToast(null);

        try {
            await equipTheme(themeId);
            const themeName = themeId === "default"
                ? "Classic Duoclongo"
                : (themesCatalog.find((t) => t.id === themeId)?.name || "Theme");

            setToast({
                type: "success",
                message: themeId === "default"
                    ? "🎨 Reset to Classic Duoclongo theme."
                    : `🎨 Equipped "${themeName}" theme!`
            });
        } catch (err) {
            setToast({
                type: "error",
                message: err.message || "Failed to equip theme."
            });
        } finally {
            setActionThemeId(null);
        }
    };

    const handlePurchaseTheme = async (theme) => {
        if (actionThemeId || purchasingId) return;

        setActionThemeId(theme.id);
        setToast(null);

        try {
            const result = await purchaseTheme(theme.id);
            setToast({
                type: "success",
                message: result.message
            });
        } catch (err) {
            setToast({
                type: "error",
                message: err.message || "Failed to complete theme purchase."
            });
        } finally {
            setActionThemeId(null);
        }
    };

    const catalog = getShopCatalog(user);
    const themesCatalog = getThemeShopCatalog(user);
    const gemBalance = user?.diamonds ?? 0;

    const filteredThemes = themeRarityFilter === "all"
        ? themesCatalog
        : themesCatalog.filter(
            (t) => t.rarity.id === themeRarityFilter || (t.id === "default" && themeRarityFilter === "common")
        );

    const rarityFilters = [
        { id: "all", label: "All Themes", count: themesCatalog.length },
        { id: "common", label: "Common", count: themesCatalog.filter((t) => t.rarity.id === "common" || t.id === "default").length },
        { id: "rare", label: "Rare", count: themesCatalog.filter((t) => t.rarity.id === "rare").length },
        { id: "epic", label: "Epic", count: themesCatalog.filter((t) => t.rarity.id === "epic").length },
        { id: "legendary", label: "Legendary", count: themesCatalog.filter((t) => t.rarity.id === "legendary").length }
    ];

    return (
        <div className="shop-container">
            {/* Header with Title and Gem Balance */}
            <header className="shop-header-row">
                <div className="shop-header-text">
                    <div className="subpage-title-badge">
                        <ShoppingBag size={24} className="subpage-badge-icon" />
                        <h1 className="heading-lg">Item Shop</h1>
                    </div>
                    <p className="body-text-muted">
                        Spend your earned gems on learning boosts, heart refills, and collectible site themes.
                    </p>
                </div>

                <div className="shop-balances-group">
                    <div className="shop-balance-badge shop-hearts-badge" title="Your Remaining Hearts">
                        <img src={heartIcon} alt="Hearts" className="shop-balance-icon" />
                        <div className="shop-balance-info">
                            <span className="shop-balance-num shop-hearts-num">{user?.hearts ?? 5} / 5</span>
                            <span className="shop-balance-label">Hearts Left</span>
                        </div>
                    </div>

                    <div className="shop-balance-badge" title="Your Current Gem Balance">
                        <img src={diamondIcon} alt="Gems" className="shop-balance-icon" />
                        <div className="shop-balance-info">
                            <span className="shop-balance-num">{gemBalance.toLocaleString()}</span>
                            <span className="shop-balance-label">Gems Available</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Purchase Feedback Toast */}
            {toast && (
                <div className={`shop-toast ${toast.type === "success" ? "shop-toast-success" : "shop-toast-error"}`} role="status">
                    {toast.type === "success" ? (
                        <CheckCircle size={20} className="shop-toast-icon" />
                    ) : (
                        <AlertCircle size={20} className="shop-toast-icon" />
                    )}
                    <span>{toast.message}</span>
                    <button
                        type="button"
                        className="shop-toast-close"
                        onClick={() => setToast(null)}
                        aria-label="Dismiss message"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* SECTION 1: Power-Ups & Boosts */}
            <section className="shop-section">
                <h2 className="shop-section-title">Power-Ups & Boosts</h2>

                <div className="shop-items-list">
                    {catalog.map((item) => {
                        const isPurchasingThis = purchasingId === item.id;
                        const isBusy = purchasingId !== null || actionThemeId !== null;

                        let metaText = "";
                        if (item.id === "heart_refill") {
                            metaText = `Current: ${user?.hearts ?? 5} / 5 hearts`;
                        } else if (item.id === "streak_freeze") {
                            metaText = `Equipped: ${user?.streak_freeze_count ?? 0} / 2 max`;
                        }

                        let buttonContent;
                        if (isPurchasingThis) {
                            buttonContent = (
                                <>
                                    <Loader2 size={16} className="spin-icon" />
                                    <span>BUYING...</span>
                                </>
                            );
                        } else if (!item.canBuy) {
                            if (item.disabledReason === "Hearts are full") {
                                buttonContent = <span>FULL</span>;
                            } else if (item.disabledReason?.includes("Equipped")) {
                                buttonContent = <span>EQUIPPED</span>;
                            } else {
                                buttonContent = (
                                    <span className="shop-gem-cost">
                                        <img src={diamondIcon} alt="" className="shop-gem-cost-icon" />
                                        <span>{item.cost}</span>
                                    </span>
                                );
                            }
                        } else {
                            buttonContent = (
                                <>
                                    <span>BUY</span>
                                    <span className="shop-gem-cost">
                                        <img src={diamondIcon} alt="" className="shop-gem-cost-icon" />
                                        <span>{item.cost}</span>
                                    </span>
                                </>
                            );
                        }

                        return (
                            <div key={item.id} className="shop-item-card">
                                <div className="shop-item-card-left">
                                    <div className="shop-item-icon-wrapper">
                                        <img src={item.icon} alt={item.name} className="shop-item-icon" />
                                    </div>

                                    <div className="shop-item-details">
                                        <div className="shop-item-header">
                                            <h3 className="shop-item-title">{item.name}</h3>
                                            {item.badge && <span className="shop-item-badge">{item.badge}</span>}
                                        </div>

                                        <p className="shop-item-desc">{item.description}</p>
                                        {metaText && <span className="shop-item-meta">{metaText}</span>}
                                    </div>
                                </div>

                                <div className="shop-item-action">
                                    <button
                                        type="button"
                                        className={`duo-button ${item.canBuy ? "duo-button-primary" : "shop-buy-btn-disabled"} shop-buy-btn`}
                                        disabled={!item.canBuy || isBusy}
                                        onClick={() => handlePurchaseItem(item)}
                                        title={item.disabledReason || `Purchase ${item.name} for ${item.cost} gems`}
                                    >
                                        {buttonContent}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* SECTION 2: Customizations → Site Themes */}
            <section className="shop-section shop-themes-section">
                <div className="shop-section-header-row">
                    <div className="shop-section-header-left">
                        <div className="shop-section-title-wrap">
                            <Palette size={22} className="shop-section-icon" />
                            <h2 className="shop-section-title">Customizations • Site Themes</h2>
                        </div>
                        <p className="body-text-muted">
                            Personalize your entire Duoclongo interface with custom color schemes and ambient atmospheres.
                        </p>
                    </div>

                    <Link to="/theme-preview" className="shop-themes-lab-link" title="Open Theme Preview Lab">
                        <Sparkles size={15} />
                        <span>Theme Test Lab</span>
                        <ArrowRight size={14} />
                    </Link>
                </div>

                {/* Filter pills */}
                <div className="shop-theme-filters">
                    {rarityFilters.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            className={`shop-theme-filter-pill ${themeRarityFilter === tab.id ? "active" : ""}`}
                            onClick={() => setThemeRarityFilter(tab.id)}
                        >
                            <span>{tab.label}</span>
                            <span className="shop-theme-filter-count">{tab.count}</span>
                        </button>
                    ))}
                </div>

                {/* Themes Grid */}
                <div className="shop-themes-grid">
                    {filteredThemes.map((theme) => {
                        const isActingThis = actionThemeId === theme.id;
                        const isBusy = actionThemeId !== null || purchasingId !== null;

                        return (
                            <div
                                key={theme.id}
                                className={`shop-theme-card ${theme.isEquipped ? "theme-card-active" : ""}`}
                            >
                                <div className="theme-card-header">
                                    <div className="theme-card-title-group">
                                        <h3 className="theme-card-name">{theme.name}</h3>
                                        <span className="theme-card-tagline">{theme.tagline}</span>
                                    </div>
                                    <div className="theme-card-badges">
                                        <span className={`theme-card-rarity ${theme.rarity.badgeClass}`}>
                                            {theme.rarity.label}
                                        </span>
                                        {theme.isEquipped && (
                                            <span className="theme-card-equipped-badge">
                                                <Check size={12} />
                                                <span>EQUIPPED</span>
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Palette preview chips */}
                                <div className="theme-card-swatches" title="Theme Color Palette Preview">
                                    <span
                                        className="theme-swatch-chip"
                                        style={{ backgroundColor: theme.previewColors.bgPage }}
                                        title="Page Background"
                                    />
                                    <span
                                        className="theme-swatch-chip"
                                        style={{ backgroundColor: theme.previewColors.bgSurface }}
                                        title="Surface Background"
                                    />
                                    <span
                                        className="theme-swatch-chip"
                                        style={{ backgroundColor: theme.previewColors.primary }}
                                        title="Primary Color"
                                    />
                                    <span
                                        className="theme-swatch-chip"
                                        style={{ backgroundColor: theme.previewColors.secondary }}
                                        title="Secondary / Accent"
                                    />
                                    <span
                                        className="theme-swatch-chip"
                                        style={{ backgroundColor: theme.previewColors.text }}
                                        title="Text Color"
                                    />
                                    <span className="theme-swatches-label">Palette Preview</span>
                                </div>

                                <p className="theme-card-desc">{theme.description}</p>

                                <div className="theme-card-footer">
                                    <div className="theme-card-cost-wrap">
                                        {theme.isDefault ? (
                                            <span className="theme-cost-free">Default</span>
                                        ) : theme.isOwned ? (
                                            <span className="theme-cost-owned">Owned</span>
                                        ) : (
                                            <div className="shop-gem-cost theme-gem-cost">
                                                <img src={diamondIcon} alt="Gems" className="shop-gem-cost-icon" />
                                                <span>{theme.cost.toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="theme-card-actions">
                                        <Link
                                            to={`/theme-preview?theme=${theme.id}`}
                                            className="shop-theme-preview-btn"
                                            title={`Preview ${theme.name} in Test Lab`}
                                        >
                                            <Eye size={14} />
                                            <span>Preview</span>
                                        </Link>

                                        {theme.isEquipped ? (
                                            !theme.isDefault ? (
                                                <button
                                                    type="button"
                                                    className="duo-button shop-theme-unequip-btn"
                                                    disabled={isBusy}
                                                    onClick={() => handleEquipTheme("default")}
                                                    title="Revert to Classic Duoclongo"
                                                >
                                                    {isActingThis ? <Loader2 size={14} className="spin-icon" /> : "UNEQUIP"}
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="duo-button shop-theme-equipped-btn"
                                                    disabled
                                                >
                                                    <Check size={14} />
                                                    <span>ACTIVE</span>
                                                </button>
                                            )
                                        ) : theme.isOwned ? (
                                            <button
                                                type="button"
                                                className="duo-button duo-button-secondary shop-theme-equip-btn"
                                                disabled={isBusy}
                                                onClick={() => handleEquipTheme(theme.id)}
                                                title={`Equip ${theme.name}`}
                                            >
                                                {isActingThis ? <Loader2 size={14} className="spin-icon" /> : "EQUIP"}
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                className={`duo-button ${theme.canBuy ? "duo-button-primary" : "shop-buy-btn-disabled"} shop-theme-buy-btn`}
                                                disabled={!theme.canBuy || isBusy}
                                                onClick={() => handlePurchaseTheme(theme)}
                                                title={!theme.canBuy ? `Need ${theme.missingGems.toLocaleString()} more gems` : `Purchase ${theme.name} for ${theme.cost} gems`}
                                            >
                                                {isActingThis ? (
                                                    <>
                                                        <Loader2 size={14} className="spin-icon" />
                                                        <span>BUYING...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>BUY</span>
                                                        <span className="shop-gem-cost">
                                                            <img src={diamondIcon} alt="" className="shop-gem-cost-icon" />
                                                            <span>{theme.cost}</span>
                                                        </span>
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Educational Economy Reinforcement Banner */}
            <aside className="shop-earn-card">
                <div className="shop-earn-text">
                    <h3>Need More Gems?</h3>
                    <p>
                        Earn gems by completing lessons (+15), conquering Unit Mastery (+25), and practicing your LASA recognition (+5).
                    </p>
                </div>
                <Link to="/learn" className="duo-button duo-button-primary shop-earn-cta">
                    <BookOpen size={18} />
                    <span>START LEARNING</span>
                </Link>
            </aside>
        </div>
    );
}

export default Shop;