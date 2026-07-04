'use client';

import { useCallback } from 'react';
import { useAdminToast } from '@/components/admin/AdminToastProvider';

/** Toast helpers for admin CRUD managers — success/error popups, no inline banners. */
export function useAdminFeedback() {
  const { success, error: toastError, toast, info, warning } = useAdminToast();

  const flash = useCallback(
    (message: string, title?: string) => {
      success(message, title ?? 'Success');
    },
    [success]
  );

  const setError = useCallback(
    (msg: string | null) => {
      if (msg) toastError(msg);
    },
    [toastError]
  );

  return { flash, setError, toast, success, error: toastError, info, warning };
}
