// Subject-related types
import type { BaseEntity } from "./core";
import type { DayOfWeek } from "./utils";

export interface Subject extends BaseEntity {
  name: string;
  color: string;
  description?: string;
  day: DayOfWeek[];
}

export type SubjectData = Subject;

// Subject creation input (without id and timestamps)
export type CreateSubjectInput = Omit<
  Subject,
  "id" | "createdAt" | "updatedAt"
>;

// Subject update input (partial except for id)
export type UpdateSubjectInput = Partial<Omit<Subject, "id">> & { id: string };
