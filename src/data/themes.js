/**
 * Central Theme Catalog for Duoclongo
 *
 * Defines all collectible site themes across Common, Rare, Epic, and Legendary tiers.
 * Centralized pricing, descriptions, color swatches, and theme tokens.
 */

export const THEME_RARITIES = {
    COMMON: {
        id: "common",
        label: "Common",
        badgeClass: "rarity-common",
        color: "#58cc02",
        priceRange: "100–250 💎"
    },
    RARE: {
        id: "rare",
        label: "Rare",
        badgeClass: "rarity-rare",
        color: "#2b9bed",
        priceRange: "300–500 💎"
    },
    EPIC: {
        id: "epic",
        label: "Epic",
        badgeClass: "rarity-epic",
        color: "#a855f7",
        priceRange: "600–900 💎"
    },
    LEGENDARY: {
        id: "legendary",
        label: "Legendary",
        badgeClass: "rarity-legendary",
        color: "#ffc700",
        priceRange: "1,000–1,500 💎"
    }
};

export const THEMES_CATALOG = [
    // =========================================================================
    // COMMON (100–250 Diamonds)
    // =========================================================================
    {
        id: "forest_explorer",
        name: "Forest Explorer",
        rarity: THEME_RARITIES.COMMON,
        cost: 200,
        category: "Site Themes",
        tagline: "Venture deep into the serene clinical wilderness.",
        description: "Deep forest green backgrounds, organic moss accents, warm earthy text, and subtle nature aesthetics.",
        previewColors: {
            bgPage: "#0e1a14",
            bgSurface: "#15281e",
            primary: "#4ade80",
            secondary: "#86efac",
            border: "#234232",
            text: "#f0fdf4"
        },
        atmosphere: "Lush botanical ambient gradients with natural foliage tones."
    },
    {
        id: "ocean_current",
        name: "Ocean Current",
        rarity: THEME_RARITIES.COMMON,
        cost: 250,
        category: "Site Themes",
        tagline: "Glide smoothly through calming deep-sea waters.",
        description: "Deep oceanic blue canvas, luminous aqua and teal accents, and subtle fluid water wave decorations.",
        previewColors: {
            bgPage: "#0a192f",
            bgSurface: "#112240",
            primary: "#06b6d4",
            secondary: "#38bdf8",
            border: "#1e3a5f",
            text: "#f0f9ff"
        },
        atmosphere: "Subtle abyssal blue backdrop with refreshing turquoise wave glows."
    },
    {
        id: "cloud_nine",
        name: "Cloud Nine",
        rarity: THEME_RARITIES.COMMON,
        cost: 250,
        category: "Site Themes",
        tagline: "Light, airy, and crystal-clear clinical focus.",
        description: "Clean bright sky appearance with soft cloud-white surfaces, gentle blue accents, and high-contrast dark text.",
        isLight: true,
        previewColors: {
            bgPage: "#f0f6fc",
            bgSurface: "#ffffff",
            primary: "#0284c7",
            secondary: "#38bdf8",
            border: "#cbd5e1",
            text: "#0f172a"
        },
        atmosphere: "Bright daylight aesthetics with sky-blue accents and pristine card contrast."
    },

    // =========================================================================
    // RARE (300–500 Diamonds)
    // =========================================================================
    {
        id: "midnight_galaxy",
        name: "Midnight Galaxy",
        rarity: THEME_RARITIES.RARE,
        cost: 450,
        category: "Site Themes",
        tagline: "Chart your clinical course through the cosmos.",
        description: "Deep space navy canvas with celestial purple and indigo accents, accented by subtle twinkling constellations.",
        previewColors: {
            bgPage: "#090d1a",
            bgSurface: "#12182c",
            primary: "#818cf8",
            secondary: "#c084fc",
            border: "#252f52",
            text: "#f8fafc"
        },
        atmosphere: "Deep indigo stellar canvas with soft starfield ambient highlights."
    },
    {
        id: "neon_lab",
        name: "Neon Lab",
        rarity: THEME_RARITIES.RARE,
        cost: 480,
        category: "Site Themes",
        tagline: "High-tech chemistry analysis at cyberpunk velocity.",
        description: "Dark carbon charcoal, electric cyan grid lines, and glowing neon radioactive green highlights.",
        previewColors: {
            bgPage: "#0c1014",
            bgSurface: "#141c22",
            primary: "#00ff9d",
            secondary: "#00f0ff",
            border: "#1e303c",
            text: "#e6fffa"
        },
        atmosphere: "Cybernetic laboratory grid with pulsing fluorescent energy accents."
    },
    {
        id: "sakura",
        name: "Sakura",
        rarity: THEME_RARITIES.RARE,
        cost: 420,
        category: "Site Themes",
        tagline: "Graceful cherry blossom petals in the evening breeze.",
        description: "Dark plum and midnight navy canvas illuminated by delicate blossom pinks and warm pastel rose tones.",
        previewColors: {
            bgPage: "#180f1d",
            bgSurface: "#24162a",
            primary: "#f472b6",
            secondary: "#fb7185",
            border: "#3d2345",
            text: "#fdf2f8"
        },
        atmosphere: "Gentle floral petal gradient washes with warm rose highlights."
    },
    {
        id: "arctic",
        name: "Arctic",
        rarity: THEME_RARITIES.RARE,
        cost: 380,
        category: "Site Themes",
        tagline: "Crisp glacial clarity and sub-zero precision.",
        description: "Chilled blue-gray palette with crystalline ice-blue accents and subtle frost glimmer accents.",
        previewColors: {
            bgPage: "#0d1821",
            bgSurface: "#152432",
            primary: "#38bdf8",
            secondary: "#7dd3fc",
            border: "#22394e",
            text: "#f0f9ff"
        },
        atmosphere: "Subtle sub-zero frost sheen with diamond-like glacial highlights."
    },
    {
        id: "sunset",
        name: "Sunset",
        rarity: THEME_RARITIES.RARE,
        cost: 400,
        category: "Site Themes",
        tagline: "Golden hour hues over twilight skies.",
        description: "Deep violet dusk canvas warming into brilliant amber, tangerine, and coral pink sunset accents.",
        previewColors: {
            bgPage: "#180d1e",
            bgSurface: "#261530",
            primary: "#f97316",
            secondary: "#fb923c",
            border: "#3e214d",
            text: "#fff7ed"
        },
        atmosphere: "Warm radiant twilight horizon gradient with rich coral glow."
    },

    // =========================================================================
    // EPIC (600–900 Diamonds)
    // =========================================================================
    {
        id: "ember",
        name: "Ember",
        rarity: THEME_RARITIES.EPIC,
        cost: 750,
        category: "Site Themes",
        tagline: "Smoldering volcanic intensity that fuels your study drive.",
        description: "Dark obsidian charcoal, fiery red-orange molten borders, and glowing golden cinder highlights.",
        previewColors: {
            bgPage: "#140a08",
            bgSurface: "#20120d",
            primary: "#ff5722",
            secondary: "#ff9800",
            border: "#3d1f16",
            text: "#fff5f2"
        },
        atmosphere: "Volcanic cinder glow with subtle hot ember particles in the background."
    },
    {
        id: "mystic_forest",
        name: "Mystic Forest",
        rarity: THEME_RARITIES.EPIC,
        cost: 800,
        category: "Site Themes",
        tagline: "An enchanted twilight woods where fireflies illuminate medicines.",
        description: "Deep enchanted emerald and midnight amethyst, with glowing fae firefly highlights and mystical borders.",
        previewColors: {
            bgPage: "#0a1311",
            bgSurface: "#12201d",
            primary: "#10b981",
            secondary: "#a855f7",
            border: "#203a34",
            text: "#ecfdf5"
        },
        atmosphere: "Bioluminescent emerald and purple mist with soft firefly sparkles."
    },
    {
        id: "retro_terminal",
        name: "Retro Terminal",
        rarity: THEME_RARITIES.EPIC,
        cost: 700,
        category: "Site Themes",
        tagline: "Boot up 1984 pharmacy mainframe diagnostics.",
        description: "Near-black CRT console background, monochrome phosphor green typography, and subtle scanline borders.",
        previewColors: {
            bgPage: "#0a0f0a",
            bgSurface: "#101810",
            primary: "#22c55e",
            secondary: "#4ade80",
            border: "#1b2e1b",
            text: "#bbf7d0"
        },
        atmosphere: "Vintage monochrome CRT screen glow with subtle scanlines and monospace code flavor."
    },
    {
        id: "biohazard_lab",
        name: "Biohazard Lab",
        rarity: THEME_RARITIES.EPIC,
        cost: 850,
        category: "Site Themes",
        tagline: "High-alert decontamination protocols engaged.",
        description: "Dark hazardous black-green, vivid acid warning yellow, industrial caution stripes, and molecular geometry.",
        previewColors: {
            bgPage: "#0d120a",
            bgSurface: "#171e12",
            primary: "#eab308",
            secondary: "#84cc16",
            border: "#2b381e",
            text: "#fefce8"
        },
        atmosphere: "Industrial biosafety hazard markings with electric amber radiation warning trims."
    },
    {
        id: "candy_pop",
        name: "Candy Pop",
        rarity: THEME_RARITIES.EPIC,
        cost: 750,
        category: "Site Themes",
        tagline: "Sugar-coated learning with playful sweet vibes.",
        description: "Deep berry navy canvas bursting with bubblegum pink, cyan frosting, and lemon sherbet yellow accents.",
        previewColors: {
            bgPage: "#120e1f",
            bgSurface: "#1c162e",
            primary: "#ec4899",
            secondary: "#06b6d4",
            border: "#332650",
            text: "#fdf4ff"
        },
        atmosphere: "Playful candy confection gradients with vibrant lollipop highlights."
    },

    // =========================================================================
    // LEGENDARY (1,000–1,500 Diamonds)
    // =========================================================================
    {
        id: "cosmic_nebula",
        name: "Cosmic Nebula",
        rarity: THEME_RARITIES.LEGENDARY,
        cost: 1200,
        category: "Site Themes",
        tagline: "A breathtaking interstellar expanse of vibrant stellar dust.",
        description: "Deep obsidian void, swirling iridescent violet, magenta, and cyan nebula clouds with shimmering stellar accents.",
        previewColors: {
            bgPage: "#080614",
            bgSurface: "#120f26",
            primary: "#c084fc",
            secondary: "#f472b6",
            border: "#29214d",
            text: "#faf5ff"
        },
        atmosphere: "Multi-layered galactic nebula clouds with prismatic starlight sheen."
    },
    {
        id: "golden_scholar",
        name: "Golden Scholar",
        rarity: THEME_RARITIES.LEGENDARY,
        cost: 1500,
        category: "Site Themes",
        tagline: "The pinnacle of academic pharmacy mastery.",
        description: "Prestigious imperial navy-black canvas with regal 24-karat gilded gold borders, warm laurel accents, and elite scholastic prestige.",
        previewColors: {
            bgPage: "#0b0f16",
            bgSurface: "#141a24",
            primary: "#f59e0b",
            secondary: "#ffd700",
            border: "#382f1b",
            text: "#fffbeb"
        },
        atmosphere: "Opulent gilded filigree glow, polished gold leaf trim, and stately academic prestige."
    }
];

export const DEFAULT_THEME_ID = "default";

export const CLASSIC_THEME = {
    id: DEFAULT_THEME_ID,
    name: "Classic Duoclongo",
    rarity: {
        id: "classic",
        label: "Default",
        badgeClass: "rarity-common",
        color: "#58cc02"
    },
    cost: 0,
    category: "Site Themes",
    tagline: "The original iconic Duoclongo dark mode.",
    description: "Classic high-contrast dark palette with energetic green accents, clean card outlines, and optimal clinical readability.",
    previewColors: {
        bgPage: "#131f24",
        bgSurface: "#1a2c33",
        primary: "#58cc02",
        secondary: "#2b9bed",
        border: "#2a3c42",
        text: "#ffffff"
    },
    atmosphere: "Original clinical high-contrast dark theme."
};

/**
 * Retrieves the complete theme catalog including purchasable themes.
 */
export function getThemesCatalog() {
    return THEMES_CATALOG;
}

/**
 * Finds a theme by its unique identifier.
 */
export function getThemeById(themeId) {
    if (!themeId || themeId === DEFAULT_THEME_ID) return CLASSIC_THEME;
    return THEMES_CATALOG.find((t) => t.id === themeId) || null;
}

