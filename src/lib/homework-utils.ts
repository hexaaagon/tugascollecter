import { Homework } from "./types";

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatRelativeDate = (date: Date): string => {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays > 1) return `In ${diffDays} days`;
  if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;

  return formatDate(date);
};

export const isDueSoon = (deadline: Date): boolean => {
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 3;
};

export const isOverdue = (deadline: Date): boolean => {
  const now = new Date();
  return deadline.getTime() < now.getTime();
};

export const sortHomeworkByDeadline = (homework: Homework[]): Homework[] => {
  return [...homework].sort((a, b) => {
    // Items without deadline always go to top
    if (!a.deadline && !b.deadline) return 0;
    if (!a.deadline) return -1;
    if (!b.deadline) return 1;

    // Sort by deadline (earliest first)
    return a.deadline.getTime() - b.deadline.getTime();
  });
};

export const getDeadlineStatus = (
  deadline?: Date
): "no-deadline" | "overdue" | "due-soon" | "normal" => {
  if (!deadline) return "no-deadline";
  if (isOverdue(deadline)) return "overdue";
  if (isDueSoon(deadline)) return "due-soon";
  return "normal";
};

export const getPriorityColor = (
  priority: "low" | "medium" | "high"
): string => {
  switch (priority) {
    case "high":
      return "text-red-600";
    case "medium":
      return "text-yellow-600";
    case "low":
      return "text-green-600";
    default:
      return "text-gray-600";
  }
};

export const getStatusBadgeVariant = (
  status: string
): "default" | "secondary" | "destructive" | "success" | "warning" => {
  switch (status) {
    case "overdue":
      return "destructive";
    case "due-soon":
      return "warning";
    case "no-deadline":
      return "secondary";
    default:
      return "default";
  }
};
