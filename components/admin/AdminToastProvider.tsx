'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

export type AdminToastVariant = 'success' | 'error' | 'info' | 'warning';

export type AdminToastInput = {
  message: string;
  title?: string;
  variant?: AdminToastVariant;
  /** Auto-dismiss after ms (default 4500). Set 0 to keep until dismissed. */
  duration?: number;
};

type ToastItem = Required<Pick<AdminToastInput, 'message'>> &
  AdminToastInput & { id: string; variant: AdminToastVariant };

const DEFAULT_DURATION_MS = 4500;
const MAX_VISIBLE = 4;

type AdminToastContextValue = {
  toast: (input: AdminToastInput) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
};

const AdminToastContext = createContext<AdminToastContextValue | null>(null);

export function useAdminToast() {
  const ctx = useContext(AdminToastContext);
  if (!ctx) {
    throw new Error('useAdminToast must be used within AdminToastProvider');
  }
  return ctx;
}

function ToastIcon({ variant }: { variant: AdminToastVariant }) {
  if (variant === 'success') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.75" />
        <path
          d="M8 12.5l2.5 2.5L16 9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (variant === 'error') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.75" />
        <path d="M12 8v5M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (variant === 'warning') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3L2 20h20L12 3z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <path d="M12 10v4M12 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.75" />
      <path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function AdminToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: () => void;
}) {
  const duration = toast.duration ?? DEFAULT_DURATION_MS;
  const [phase, setPhase] = useState<'enter' | 'visible' | 'exit'>('enter');

  useEffect(() => {
    const enterFrame = requestAnimationFrame(() => setPhase('visible'));
    if (duration <= 0) {
      return () => cancelAnimationFrame(enterFrame);
    }
    const exitAt = Math.max(duration - 320, 0);
    const exitTimer = window.setTimeout(() => setPhase('exit'), exitAt);
    const removeTimer = window.setTimeout(onDismiss, duration);
    return () => {
      cancelAnimationFrame(enterFrame);
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
    };
  }, [duration, onDismiss]);

  const phaseClass =
    phase === 'visible'
      ? 'admin-toast--visible'
      : phase === 'exit'
        ? 'admin-toast--exit'
        : '';

  return (
    <div
      className={`admin-toast admin-toast--${toast.variant} ${phaseClass}`}
      role={toast.variant === 'error' ? 'alert' : 'status'}
    >
      <div className="admin-toast-accent" aria-hidden />
      <div className="admin-toast-icon" aria-hidden>
        <ToastIcon variant={toast.variant} />
      </div>
      <div className="admin-toast-body">
        <p className="admin-toast-title">{toast.title ?? defaultTitle(toast.variant)}</p>
        <p className="admin-toast-message">{toast.message}</p>
      </div>
      <button
        type="button"
        className="admin-toast-close"
        onClick={() => {
          setPhase('exit');
          window.setTimeout(onDismiss, 280);
        }}
        aria-label="Dismiss notification"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {duration > 0 && (
        <span
          className="admin-toast-progress"
          style={{ animationDuration: `${duration}ms` }}
          aria-hidden
        />
      )}
    </div>
  );
}

function defaultTitle(variant: AdminToastVariant): string {
  switch (variant) {
    case 'success':
      return 'Done';
    case 'error':
      return 'Error';
    case 'warning':
      return 'Warning';
    default:
      return 'Notice';
  }
}

export function AdminToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const dismiss = useCallback((id: string) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((input: AdminToastInput) => {
    const id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const item: ToastItem = {
      ...input,
      id,
      variant: input.variant ?? 'info',
      message: input.message,
    };
    setToasts((list) => [...list, item].slice(-MAX_VISIBLE));
  }, []);

  const success = useCallback(
    (message: string, title?: string) => push({ variant: 'success', message, title }),
    [push]
  );
  const error = useCallback(
    (message: string, title?: string) => push({ variant: 'error', message, title, duration: 6000 }),
    [push]
  );
  const info = useCallback(
    (message: string, title?: string) => push({ variant: 'info', message, title }),
    [push]
  );
  const warning = useCallback(
    (message: string, title?: string) => push({ variant: 'warning', message, title }),
    [push]
  );

  const value: AdminToastContextValue = { toast: push, success, error, info, warning };

  return (
    <AdminToastContext.Provider value={value}>
      {children}
      {mounted &&
        createPortal(
          <div className="admin-toast-stack" aria-live="polite" aria-relevant="additions">
            {toasts.map((t) => (
              <AdminToastCard key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
            ))}
          </div>,
          document.body
        )}
    </AdminToastContext.Provider>
  );
}
