import * as React from 'react';

interface ContextProviderProps<T> {
  children: React.ReactNode;
  value: T;
}

interface CreateContextResult<T> {
  Provider: React.FC<ContextProviderProps<T>>;
  useContext: () => T;
  Context: React.Context<T>;
}

export function createContext<T>(defaultValue: T, displayName?: string): CreateContextResult<T> {
  const Context = React.createContext<T>(defaultValue);
  
  if (displayName) {
    Context.displayName = displayName;
  }

  const Provider: React.FC<ContextProviderProps<T>> = (props) => {
    return React.createElement(
      Context.Provider,
      { value: props.value },
      props.children
    );
  };

  const useCustomContext = (): T => {
    const context = React.useContext(Context);
    if (context === undefined) {
      throw new Error('useContext must be used within a Provider');
    }
    return context;
  };

  return {
    Provider,
    useContext: useCustomContext,
    Context
  };
}
