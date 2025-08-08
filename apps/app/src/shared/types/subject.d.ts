import { DayOfWeek } from "./utils";

export type Subject = {
  id: string;
  name: string;
  color: string;
  description?: string;
  day: DayOfWeek[];
};
