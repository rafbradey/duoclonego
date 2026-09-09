import { allUnits } from "../data/levels/index.js";

/**
 * Retrieves all learning units across sections.
 * @returns {Promise<Array>} Array of unit definitions
 */
export async function getUnits() {
    return allUnits;
}

/**
 * Retrieves a specific unit by its unique identifier.
 * @param {string} unitId - Unique unit ID (e.g. 'unit_001')
 * @returns {Promise<Object|null>} Unit object or null if not found
 */
export async function getUnitById(unitId) {
    const unit = allUnits.find((u) => u.id === unitId);
    return unit || null;
}