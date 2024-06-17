'use client';
import { useAuth } from '@/contexts/AuthContext';
import { redirect, useRouter } from 'next/navigation';
import { useLayoutEffect } from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuth()?.user;

  useLayoutEffect(() => {
    if (user) {
      redirect('/');
    }
  }, [user]);

  return <>{children}</>;
}
