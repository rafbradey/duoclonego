import lessons from "../data/lessons.json" with { type: "json" };

/**
 * Retrieves all lessons in the curriculum.
 * @returns {Promise<Array>} Array of lesson definitions
 */
export async function getLessons() {
    return lessons;
}

/**
 * Retrieves a lesson by its unique identifier.
 * @param {string} lessonId - Unique lesson ID (e.g. 'lesson_001')
 * @returns {Promise<Object|null>} Lesson object or null if not found
 */
export async function getLessonById(lessonId) {
    const lesson = lessons.find((l) => l.id === lessonId);
    return lesson || null;
}

/**
 * Retrieves lessons belonging to a specific unit.
 * @param {string} unitId - Unit identifier (e.g. 'unit_001')
 * @returns {Promise<Array>} Array of lessons in the unit
 */
export async function getLessonsByUnit(unitId) {
    return lessons.filter((l) => l.unit_id === unitId);
}
