// Main exports - common types that are used frequently
export * from "./src/core.js";
export * from "./src/storage.js";
export * from "./src/homework.js";
export * from "./src/subject.js";
export * from "./src/utils.js";

// Backward compatibility aliases
export type { Homework as HomeworkData } from "./src/homework.js";
export type { Subject as SubjectData } from "./src/subject.js";
