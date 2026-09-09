import { allLessons } from "../data/levels/index.js";

/**
 * Retrieves all lessons across the entire curriculum.
 * @returns {Promise<Array>} Array of lesson definitions
 */
export async function getLessons() {
    return allLessons;
}

/**
 * Retrieves a lesson by its unique identifier across all sections and units.
 * @param {string} lessonId - Unique lesson ID (e.g. 'lesson_001')
 * @returns {Promise<Object|null>} Lesson object or null if not found
 */
export async function getLessonById(lessonId) {
    const lesson = allLessons.find((l) => l.id === lessonId);
    return lesson || null;
}

/**
 * Retrieves lessons belonging to a specific unit.
 * @param {string} unitId - Unit identifier (e.g. 'unit_001')
 * @returns {Promise<Array>} Array of lessons in the unit
 */
export async function getLessonsByUnit(unitId) {
    return allLessons.filter((l) => l.unit_id === unitId || l.unitId === unitId);
}
