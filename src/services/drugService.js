import lasaData from "../data/lasaData.json" with { type: "json" };

/**
 * Retrieves all LASA entries in the database.
 * @returns {Promise<Array>} Array of LASA relationship entries
 */
export async function getAllLasaEntries() {
    return lasaData.entries;
}

/**
 * Retrieves a single LASA entry by its stable ID.
 * @param {string} id - Stable identifier (e.g., 'lasa-001')
 * @returns {Promise<Object|null>} The LASA entry or null if not found
 */
export async function getLasaById(id) {
    if (!id) return null;
    const normalizedId = String(id).replace("-", "_");
    const entry = lasaData.entries.find((e) => e.id === id || e.id === normalizedId || e.id === String(id).replace("_", "-"));
    return entry || null;
}

/**
 * Retrieves the list of defined learning progression levels.
 * @returns {Promise<Array>} Array of level definitions
 */
export async function getLevels() {
    return lasaData.levels;
}

/**
 * Retrieves a level by its numeric ID, populating its associated LASA entries.
 * @param {number|string} levelId - Level ID (e.g., 1)
 * @returns {Promise<Object|null>} Level with populated entries array, or null
 */
export async function getLevelById(levelId) {
    const numericId = Number(levelId);
    const level = lasaData.levels.find((l) => l.id === numericId);
    if (!level) return null;

    const entries = lasaData.entries.filter((e) => e.level === numericId);
    return {
        ...level,
        entries
    };
}

/**
 * Retrieves all LASA entries belonging to a given learning level.
 * @param {number|string} levelId - Level ID (e.g., 1)
 * @returns {Promise<Array>} Entries belonging to the level
 */
export async function getLasaEntriesByLevel(levelId) {
    const numericId = Number(levelId);
    return lasaData.entries.filter((e) => e.level === numericId);
}

/**
 * Searches LASA entries by drug name or confused drug name.
 * @param {string} query - Search term
 * @returns {Promise<Array>} Matching LASA entries
 */
export async function searchLasaEntries(query) {
    if (!query || typeof query !== "string") return [];
    const cleanQuery = query.toLowerCase().trim();
    return lasaData.entries.filter(
        (e) =>
            e.drugName.toLowerCase().includes(cleanQuery) ||
            e.confusedDrugName.toLowerCase().includes(cleanQuery)
    );
}

/**
 * Retrieves source and research metadata.
 * @returns {Promise<Object>} Citation and source metadata
 */
export async function getSourceMetadata() {
    return lasaData.source;
}
