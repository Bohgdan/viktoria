'use client';

import { useEffect } from 'react';
import { AdminLayout } from '@/components/admin';
import { Toaster } from '@/components/ui';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Hide main site elements when in admin
    document.body.classList.add('admin-page');
    return () => {
      document.body.classList.remove('admin-page');
    };
  }, []);

  return (
    <>
      <AdminLayout>{children}</AdminLayout>
      <Toaster />
    </>
  );
}
