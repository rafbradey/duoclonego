import lessons from "../data/lessons.json";

export async function getLessons() {
    return lessons;
}

export async function getLessonById(lessonId) {
    return lessons.find((l) => l.id === lessonId) || null;
}
