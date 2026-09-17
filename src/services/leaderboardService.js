/**
 * Leaderboard Service for Duoclongo
 *
 * Manages weekly cohort leagues, tier boundaries, competitive ranking,
 * Supabase profile integration, and realistic clinical cohort balancing.
 */

import { supabase } from "./supabaseClient.js";

export const LEAGUE_TIERS = [
    {
        id: "bronze",
        name: "Bronze League",
        minXp: 0,
        badgeColor: "#cd7f32",
        bgColor: "rgba(205, 127, 50, 0.15)",
        borderColor: "#cd7f32",
        promoRank: 7,
        demoRank: 0,
        description: "Top 7 advance to Silver League"
    },
    {
        id: "silver",
        name: "Silver League",
        minXp: 100,
        badgeColor: "#c0c0c0",
        bgColor: "rgba(192, 192, 192, 0.15)",
        borderColor: "#a0a0a0",
        promoRank: 7,
        demoRank: 3,
        description: "Top 7 advance to Gold League"
    },
    {
        id: "gold",
        name: "Gold League",
        minXp: 250,
        badgeColor: "#ffc800",
        bgColor: "rgba(255, 200, 0, 0.15)",
        borderColor: "#e5b300",
        promoRank: 7,
        demoRank: 4,
        description: "Top 7 advance to Sapphire League"
    },
    {
        id: "sapphire",
        name: "Sapphire League",
        minXp: 500,
        badgeColor: "#1cb0f6",
        bgColor: "rgba(28, 176, 246, 0.15)",
        borderColor: "#1899d6",
        promoRank: 7,
        demoRank: 4,
        description: "Top 7 advance to Ruby League"
    },
    {
        id: "ruby",
        name: "Ruby League",
        minXp: 1000,
        badgeColor: "#ff4b4b",
        bgColor: "rgba(255, 75, 75, 0.15)",
        borderColor: "#ea2b2b",
        promoRank: 5,
        demoRank: 5,
        description: "Top 5 advance to Diamond League"
    },
    {
        id: "diamond",
        name: "Diamond League",
        minXp: 2000,
        badgeColor: "#2ce38d",
        bgColor: "rgba(44, 227, 141, 0.15)",
        borderColor: "#1cb06f",
        promoRank: 3,
        demoRank: 5,
        description: "Champion tier — Top 3 earn Diamond Laurels"
    }
];

// Curated realistic pharmacology students and clinical peers to guarantee a competitive cohort
const CLINICAL_COHORT_TEMPLATES = [
    { username: "PharmD_Maya", display_name: "Maya Lin, PharmD", avatar: "female_avatar_1", baseScoreRatio: 1.25 },
    { username: "Rx_Jordan", display_name: "Jordan Hayes (P3)", avatar: "male_avatar_1", baseScoreRatio: 1.15 },
    { username: "ClinicalKev", display_name: "Kevin Vance, RPh", avatar: "male_avatar_2", baseScoreRatio: 1.05 },
    { username: "Tox_Elena", display_name: "Elena Rostova", avatar: "female_avatar_2", baseScoreRatio: 0.95 },
    { username: "NeuroPharm_Lee", display_name: "David Lee (PharmD)", avatar: "male_avatar_3", baseScoreRatio: 0.88 },
    { username: "Dr_Sarah_MD", display_name: "Dr. Sarah Miller", avatar: "female_avatar_3", baseScoreRatio: 0.82 },
    { username: "PharmTech_Sam", display_name: "Samira K.", avatar: "female_avatar_1", baseScoreRatio: 0.74 },
    { username: "ICU_Marcus", display_name: "Marcus Ward, RN", avatar: "male_avatar_2", baseScoreRatio: 0.68 },
    { username: "Onco_Priya", display_name: "Priya Patel", avatar: "female_avatar_2", baseScoreRatio: 0.61 },
    { username: "Cardio_Alex", display_name: "Alex Thorne", avatar: "male_avatar_1", baseScoreRatio: 0.52 },
    { username: "MedStudent_Ben", display_name: "Ben Cooper (MS2)", avatar: "male_avatar_3", baseScoreRatio: 0.45 },
    { username: "Peds_Zoe", display_name: "Zoe Alverez, CPhT", avatar: "female_avatar_3", baseScoreRatio: 0.38 },
    { username: "GeriPharm_Tom", display_name: "Tom Bradley", avatar: "male_avatar_1", baseScoreRatio: 0.30 },
    { username: "ER_Jessica", display_name: "Jessica Wu, MD", avatar: "female_avatar_1", baseScoreRatio: 0.22 }
];

/**
 * Returns the current league tier object based on cumulative XP.
 * @param {number} xp
 * @returns {Object} Tier object from LEAGUE_TIERS
 */
export function getLeagueByXp(xp = 0) {
    let active = LEAGUE_TIERS[0];
    for (const tier of LEAGUE_TIERS) {
        if (xp >= tier.minXp) {
            active = tier;
        }
    }
    return active;
}

/**
 * Calculates remaining time until the weekly Sunday 23:59:59 UTC reset.
 * @returns {{ days: number, hours: number, minutes: number, formatted: string }}
 */
export function getTimeUntilWeeklyReset() {
    const now = new Date();
    // Sunday is day 0 in JavaScript
    const currentDay = now.getUTCDay();
    const daysUntilSunday = (7 - currentDay) % 7;

    const nextSunday = new Date(now);
    nextSunday.setUTCDate(now.getUTCDate() + daysUntilSunday);
    nextSunday.setUTCHours(23, 59, 59, 999);

    let diffMs = nextSunday.getTime() - now.getTime();
    if (diffMs <= 0) {
        diffMs += 7 * 24 * 60 * 60 * 1000;
    }

    const totalMinutes = Math.floor(diffMs / (60 * 1000));
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;

    let formatted;
    if (days > 0) {
        formatted = `${days}d ${hours}h left`;
    } else if (hours > 0) {
        formatted = `${hours}h ${minutes}m left`;
    } else {
        formatted = `${minutes}m left`;
    }

    return { days, hours, minutes, formatted };
}

/**
 * Fetches or constructs the current weekly cohort leaderboard standings.
 * Combines real profiles from Supabase with realistic clinical classmates.
 *
 * @param {Object} currentUser - Active user profile
 * @returns {Promise<{
 *   league: Object,
 *   standings: Array,
 *   userRank: number,
 *   userZone: string,
 *   timeRemaining: string
 * }>}
 */
export async function getWeeklyCohortStandings(currentUser) {
    const userXp = currentUser?.xp || 0;
    const league = getLeagueByXp(userXp);
    const timeRemaining = getTimeUntilWeeklyReset().formatted;

    let cloudProfiles = [];

    // Attempt to query Supabase for real profiles
    if (supabase) {
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("id, username, display_name, avatar, xp")
                .order("xp", { ascending: false })
                .limit(25);

            if (data && !error && data.length > 0) {
                cloudProfiles = data.map((p) => ({
                    id: String(p.id),
                    username: p.username || "Learner",
                    displayName: p.display_name || p.username || "Learner",
                    avatar: p.avatar || "default_male",
                    xp: Number(p.xp) || 0,
                    isCurrentUser: Boolean(currentUser && String(p.id) === String(currentUser.id))
                }));
            }
        } catch (err) {
            console.warn("Could not query profiles for leaderboard:", err);
        }
    }

    // Ensure the current user is present
    const currentUserIdStr = currentUser ? String(currentUser.id) : "guest";
    const existingIndex = cloudProfiles.findIndex((p) => p.id === currentUserIdStr);

    const userEntry = {
        id: currentUserIdStr,
        username: currentUser?.username || "You",
        displayName: currentUser?.display_name || currentUser?.username || "You",
        avatar: currentUser?.avatar || "default_male",
        xp: userXp,
        isCurrentUser: true
    };

    if (existingIndex >= 0) {
        cloudProfiles[existingIndex] = userEntry;
    } else {
        cloudProfiles.push(userEntry);
    }

    // If cohort size is less than 15, augment with realistic clinical peers
    const needed = Math.max(0, 15 - cloudProfiles.length);
    if (needed > 0) {
        // Base anchor XP for the simulated peer cohort centered near user's XP and league tier
        const anchorXp = Math.max(userXp, league.minXp + 45);

        CLINICAL_COHORT_TEMPLATES.slice(0, needed).forEach((bot, index) => {
            // Pseudo-deterministic variance based on index
            const variation = (index % 2 === 0 ? 1 : -1) * (index * 8);
            const botXp = Math.max(5, Math.round(anchorXp * bot.baseScoreRatio + variation));

            cloudProfiles.push({
                id: `cohort_peer_${bot.username}`,
                username: bot.username,
                displayName: bot.display_name,
                avatar: bot.avatar,
                xp: botXp,
                isCurrentUser: false
            });
        });
    }

    // Sort descending by XP
    cloudProfiles.sort((a, b) => b.xp - a.xp);

    // Annotate ranks and zones (promotion, demotion, neutral)
    const totalCount = cloudProfiles.length;
    let userRank = 1;
    let userZone = "neutral";

    const standings = cloudProfiles.map((learner, idx) => {
        const rank = idx + 1;
        let zone = "neutral";

        if (league.promoRank > 0 && rank <= league.promoRank) {
            zone = "promotion";
        } else if (league.demoRank > 0 && rank > totalCount - league.demoRank) {
            zone = "demotion";
        }

        if (learner.isCurrentUser) {
            userRank = rank;
            userZone = zone;
        }

        return {
            ...learner,
            rank,
            zone
        };
    });

    return {
        league,
        standings,
        userRank,
        userZone,
        timeRemaining
    };
}
