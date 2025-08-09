// Utility types and helpers

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

// Helper type for making certain properties optional
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Helper type for making certain properties required
export type RequiredFields<T, K extends keyof T> = T &
  globalThis.Required<Pick<T, K>>;

// Helper type for deep partial
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Date range type for filtering
export interface DateRange {
  start: string; // ISO 8601 format
  end: string; // ISO 8601 format
}

// Sorting options
export type SortOrder = "asc" | "desc";

export interface SortOptions<T extends string = string> {
  field: T;
  order: SortOrder;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
