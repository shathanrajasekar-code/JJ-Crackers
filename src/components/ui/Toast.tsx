'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

export function Toast({
  message,
  type = 'success',
  duration = 3000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: 'border-green-wa/40 bg-green-wa/10',
    error: 'border-red-500/40 bg-red-500/10',
    info: 'border-gold/40 bg-gold/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={cn(
        'fixed bottom-24 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-xl border backdrop-blur-xl shadow-lg',
        typeStyles[type]
      )}
    >
      <span className="text-text font-medium">{message}</span>
      <button
        onClick={onClose}
        className="text-text-muted hover:text-text transition-colors"
      >
        <X size={18} />
      </button>
    </motion.div>
  );
}

// Toast Manager Hook
interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

let toastId = 0;
let toastListeners: ((toasts: ToastMessage[]) => void)[] = [];
let toasts: ToastMessage[] = [];

export function useToast() {
  const [, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = ++toastId;
    toasts = [...toasts, { id, message, type }];
    setToasts([...toasts]);
    toastListeners.forEach((listener) => listener(toasts));

    setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id);
      setToasts([...toasts]);
      toastListeners.forEach((listener) => listener(toasts));
    }, 3000);
  };

  const removeToast = (id: number) => {
    toasts = toasts.filter((t) => t.id !== id);
    setToasts([...toasts]);
    toastListeners.forEach((listener) => listener(toasts));
  };

  return { addToast, removeToast, toasts };
}

// Toast Container Component
export function ToastContainer() {
  const [activeToasts, setActiveToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const listener = (newToasts: ToastMessage[]) => {
      setActiveToasts([...newToasts]);
    };
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  return (
    <AnimatePresence>
      {activeToasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => {
            toasts = toasts.filter((t) => t.id !== toast.id);
            setActiveToasts([...toasts]);
            toastListeners.forEach((listener) => listener(toasts));
          }}
        />
      ))}
    </AnimatePresence>
  );
}
