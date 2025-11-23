import * as React from 'react';

// Types
type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  title?: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  isOpen?: boolean;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id' | 'isOpen'>) => string;
  removeToast: (id: string) => void;
  updateToast: (id: string, updates: Partial<Toast>) => void;
}

// Context
const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

// Provider Component
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, 'id' | 'isOpen'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id, isOpen: true };
    
    setToasts(prev => [...prev.filter(t => t.id !== id), newToast].slice(-5));

    if (toast.duration !== 0) {
      setTimeout(() => removeToast(id), toast.duration || 5000);
    }

    return id;
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, isOpen: false } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 300);
  }, []);

  const updateToast = React.useCallback((id: string, updates: Partial<Toast>) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const contextValue = React.useMemo(() => ({
    toasts,
    addToast,
    removeToast,
    updateToast,
  }), [toasts, addToast, removeToast, updateToast]);

  return React.createElement(
    ToastContext.Provider,
    { value: contextValue },
    children
  );
}

// Hook
export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Utility function
export function toast(toast: Omit<Toast, 'id' | 'isOpen'>) {
  console.warn('Toast called outside of ToastProvider');
  return Math.random().toString(36).substring(2, 9);
}

// No-op component for compatibility
export function Toaster() {
  return null;
}
