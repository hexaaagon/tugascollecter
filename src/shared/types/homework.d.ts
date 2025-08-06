import { Subject } from "./subject";

export type Homework = {
  id: string;
  subjectId: Subject["id"];
  title: string;
  description?: string;
  details: string[];
  dueDate?: string; // ISO 8601 format
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed" | "overdue";
  attachments?: string[];
  tags?: string[];
  completedAt?: string; // ISO 8601 format - when the task was completed
  createdAt?: string; // ISO 8601 format - when the task was created
};
