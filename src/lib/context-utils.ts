import { useState, useCallback } from 'react';
import { BaseContextState, LoadingState } from '@/types/context-types';

type UseAsyncOptions = {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
};

export function useAsyncState<T>(
  initialData: T | null = null
): [BaseContextState<T>, (promise: Promise<T>, options?: UseAsyncOptions) => Promise<void>] {
  const [state, setState] = useState<BaseContextState<T>>({
    data: initialData,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(async (promise: Promise<T>, options: UseAsyncOptions = {}) => {
    try {
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      const data = await promise;
      
      setState({
        data,
        isLoading: false,
        error: null,
      });

      if (options.onSuccess) {
        options.onSuccess(data);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      if (options.onError) {
        options.onError(error instanceof Error ? error : new Error(errorMessage));
      }
    }
  }, []);

  return [state, execute];
}
