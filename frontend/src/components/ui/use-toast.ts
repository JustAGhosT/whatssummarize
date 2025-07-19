import * as React from 'react';
import { X } from 'lucide-react';

type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info';

type Toast = {
  id: string;
  title?: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  isOpen?: boolean;
};

type ToastContextType = {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id' | 'isOpen'>) => string;
  removeToast: (id: string) => void;
  updateToast: (id: string, updates: Partial<Toast>) => void;
};

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

const toastTypeStyles: Record<ToastType, string> = {
  default: 'bg-gray-800 text-white',
  success: 'bg-green-600 text-white',
  error: 'bg-red-600 text-white',
  warning: 'bg-yellow-600 text-white',
  info: 'bg-blue-600 text-white',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, 'id' | 'isOpen'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id, isOpen: true };
    
    setToasts((prevToasts) => [
      ...prevToasts.filter(t => t.id !== id),
      newToast,
    ].slice(-5)); // Limit to 5 toasts

    // Auto-dismiss
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 5000);
    }

    return id;
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prevToasts) => 
      prevToasts.map(toast => 
        toast.id === id 
          ? { ...toast, isOpen: false } 
          : toast
      )
    );
    
    // Remove from DOM after animation
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, 300);
  }, []);

  const updateToast = React.useCallback((id: string, updates: Partial<Toast>) => {
    setToasts(prevToasts => 
      prevToasts.map(toast => 
        toast.id === id ? { ...toast, ...updates } : toast
      )
    );
  }, []);

  const value = React.useMemo(
    () => ({
      toasts,
      addToast,
      removeToast,
      updateToast,
    }),
    [toasts, addToast, removeToast, updateToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${toastTypeStyles[toast.type || 'default']} 
              rounded-md p-4 shadow-lg transition-all duration-300 ease-in-out
              ${toast.isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
              flex items-start justify-between space-x-4 min-w-[300px] max-w-[350px]`}
          >
            <div className="flex-1">
              {toast.title && (
                <h3 className="font-medium">{toast.title}</h3>
              )}
              {toast.description && (
                <p className="text-sm opacity-90">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function toast(toast: Omit<Toast, 'id' | 'isOpen'>) {
  // This is a fallback for when toast is called outside of React components
  // In a real app, you'd want to handle this differently
  console.warn('Toast called outside of ToastProvider');
  return Math.random().toString(36).substring(2, 9);
}

export function Toaster() {
  // This is a no-op component that's only here to maintain API compatibility
  return null;
}
