// Main exports - common types that are used frequently
export * from "./src/core";
export * from "./src/storage";
export * from "./src/homework";
export * from "./src/subject";
export * from "./src/utils";

// Backward compatibility aliases
export type { Homework as HomeworkData } from "./src/homework";
export type { Subject as SubjectData } from "./src/subject";
