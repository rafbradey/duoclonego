import { allUnits } from "../data/levels/index.js";

/**
 * Retrieves all learning units across sections.
 * @returns {Promise<Array>} Array of unit definitions
 */
export async function getUnits() {
    return allUnits;
}

/**
 * Retrieves a specific unit by its unique identifier or unit number.
 * @param {string|number} unitId - Unique unit ID (e.g. 'unit_001') or number (e.g. 1)
 * @returns {Promise<Object|null>} Unit object or null if not found
 */
export async function getUnitById(unitId) {
    if (!unitId) return null;
    const strId = String(unitId).trim();
    const unit = allUnits.find(
        (u) =>
            u.id === strId ||
            String(u.unitNumber) === strId ||
            String(u.unit_number) === strId ||
            u.id === `unit_00${strId}` ||
            u.id === `unit_0${strId}` ||
            u.id === `unit_${strId}`
    );
    return unit || null;
}

/**
 * Retrieves the dedicated Unit Mastery level for a unit.
 * @param {string|number} unitId - Unit identifier or unit number
 * @returns {Promise<Object|null>} Mastery level object or null
 */
export async function getMasteryLevelByUnitId(unitId) {
    const unit = await getUnitById(unitId);
    if (!unit) return null;
    return unit.masteryLevel || unit.levels.find((l) => l.type === "unit_mastery") || null;
}