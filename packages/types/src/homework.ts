// Homework-related types
import type { BaseEntity, Priority, Status } from "./core";
import type { Subject } from "./subject";

// Attachment data interface (defined here to avoid circular imports)
export interface AttachmentData {
  id: string;
  name: string;
  type: "image" | "document" | "audio" | "video" | "other";
  uri: string;
  size: number; // in bytes
  mimeType?: string;
  uploadedAt: string;
}

export interface Homework extends BaseEntity {
  subjectId: Subject["id"];
  title: string;
  description?: string;
  details: string[];
  dueDate?: string; // ISO 8601 format
  priority: Priority;
  status: Status;
  attachments?: AttachmentData[];
  tags?: string[];
  completedAt?: string; // ISO 8601 format - when the task was completed
}

export type HomeworkData = Homework;

// Homework creation input (without id and timestamps)
export type CreateHomeworkInput = Omit<
  Homework,
  "id" | "createdAt" | "updatedAt"
>;

// Homework update input (partial except for id)
export type UpdateHomeworkInput = Partial<Omit<Homework, "id">> & {
  id: string;
};

// Homework filtering options
export interface HomeworkFilters {
  subjectId?: string;
  status?: Status | Status[];
  priority?: Priority | Priority[];
  dueAfter?: string; // ISO 8601 format
  dueBefore?: string; // ISO 8601 format
  tags?: string[];
}
