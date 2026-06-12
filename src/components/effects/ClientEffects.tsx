'use client';

import dynamic from 'next/dynamic';

const SparkCursor = dynamic(
  () => import('./SparkCursor').then(m => m.SparkCursor),
  { ssr: false }
);

const GlobalAtmosphere = dynamic(
  () => import('./GlobalAtmosphere').then(m => m.GlobalAtmosphere),
  { ssr: false }
);

export function ClientEffects() {
  return (
    <>
      <GlobalAtmosphere />
      <SparkCursor />
    </>
  );
}
