import React, { useEffect, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

let toastId = 0;
const listeners = new Set<(toast: ToastItem) => void>();

const emitToast = (message: string, type: ToastType) => {
  const toast = { id: ++toastId, message, type };
  listeners.forEach((listener) => listener(toast));
};

const useToast = () => {
  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    console.log(`Toast: ${type} - ${message}`);
    emitToast(message, type);
  }, []);

  return { showToast };
};

export const ToastViewport: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const listener = (toast: ToastItem) => {
      setToasts((prev) => [...prev, toast]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 4500);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-[calc(100%-2rem)]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={[
            'rounded-lg border px-4 py-3 text-sm shadow-lg backdrop-blur-sm',
            toast.type === 'success' && 'bg-emerald-600 text-white border-emerald-500',
            toast.type === 'error' && 'bg-red-600 text-white border-red-500',
            toast.type === 'info' && 'bg-slate-900 text-white border-slate-700',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export { useToast };
