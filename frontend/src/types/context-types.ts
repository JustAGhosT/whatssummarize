// Base context state that can be extended by specific contexts
export interface BaseContextState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

// Standard API response format
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

// Standard error format
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Standard loading states
export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed'
}
