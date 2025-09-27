export interface ApiResponse<T> {
  alert: string;
  status: boolean;
  data: T;
  messages?: string[];
}
