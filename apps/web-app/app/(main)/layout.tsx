import React from 'react';
import { PersistentShell } from '../../components/PersistentShell';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PersistentShell>
      {children}
    </PersistentShell>
  );
}
