'use client';

import dynamic from 'next/dynamic';

const HeroScene3D = dynamic(
  () => import('./HeroScene3D').then(m => m.HeroScene3D),
  {
    ssr: false,
    loading: () => (
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0A0A08 0%, #1a1400 50%, #0A0A08 100%)',
        }}
      />
    ),
  }
);

export function HeroScene3DClient() {
  return <HeroScene3D />;
}
