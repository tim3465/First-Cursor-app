import { useState, useCallback } from 'react';

export type ToastType = { message: string; type: 'success' | 'error' } | null;

export function useToast() {
  const [toast, setToast] = useState<ToastType>(null);

  const showSuccess = useCallback((message: string) => {
    setToast({ message, type: 'success' });
    setTimeout(() => setToast(null), 2500);
  }, []);

  const showError = useCallback((message: string) => {
    setToast({ message, type: 'error' });
    setTimeout(() => setToast(null), 2500);
  }, []);

  return { toast, showSuccess, showError };
}

