'use client';

import { Toaster as HotToaster, toast as hotToast } from 'react-hot-toast';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

// Re-export hot-toast for convenience
export { hotToast as toast };

// Custom toast wrapper component
export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--color-bg-card)',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-border)',
          borderRadius: '0.5rem',
          padding: '0.75rem 1rem',
        },
        success: {
          iconTheme: {
            primary: 'var(--color-success)',
            secondary: 'var(--color-bg-card)',
          },
        },
        error: {
          iconTheme: {
            primary: 'var(--color-error)',
            secondary: 'var(--color-bg-card)',
          },
        },
      }}
    />
  );
}

// Custom toast functions with Ukrainian text
export const showToast = {
  success: (message: string) => {
    hotToast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-fade-in' : 'opacity-0'
        } max-w-md w-full bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-lg pointer-events-auto flex items-start gap-3 p-4`}
      >
        <CheckCircle className="w-5 h-5 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-[var(--color-text-primary)]">{message}</p>
        </div>
      </div>
    ));
  },

  error: (message: string) => {
    hotToast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-fade-in' : 'opacity-0'
        } max-w-md w-full bg-[var(--color-bg-card)] border border-[var(--color-error)] rounded-lg shadow-lg pointer-events-auto flex items-start gap-3 p-4`}
      >
        <XCircle className="w-5 h-5 text-[var(--color-error)] flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-[var(--color-text-primary)]">{message}</p>
        </div>
      </div>
    ));
  },

  warning: (message: string) => {
    hotToast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-fade-in' : 'opacity-0'
        } max-w-md w-full bg-[var(--color-bg-card)] border border-[var(--color-warning)] rounded-lg shadow-lg pointer-events-auto flex items-start gap-3 p-4`}
      >
        <AlertCircle className="w-5 h-5 text-[var(--color-warning)] flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-[var(--color-text-primary)]">{message}</p>
        </div>
      </div>
    ));
  },

  info: (message: string) => {
    hotToast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-fade-in' : 'opacity-0'
        } max-w-md w-full bg-[var(--color-bg-card)] border border-[var(--color-info)] rounded-lg shadow-lg pointer-events-auto flex items-start gap-3 p-4`}
      >
        <Info className="w-5 h-5 text-[var(--color-info)] flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-[var(--color-text-primary)]">{message}</p>
        </div>
      </div>
    ));
  },

  // Loading toast with promise
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return hotToast.promise(promise, messages);
  },
};
