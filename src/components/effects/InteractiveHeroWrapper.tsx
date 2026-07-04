'use client';

import React, { useState, useCallback, useEffect, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { RealisticFirework } from './RealisticFirework';
import dynamic from 'next/dynamic';

// Dynamic import of Three.js canvas to keep it out of the initial payload
const Traditional3DHero = dynamic(
  () => import('./Traditional3DHero').then(m => m.Traditional3DHero),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-[#0A0A08] animate-pulse" />
  }
);

export function InteractiveHeroWrapper({ children }: { children: React.ReactNode }) {
  const [bursts, setBursts] = useState<Array<{ id: number; x: number; y: number; type: 'burst' | 'fountain' | 'spin' | 'sparkle' }>>([]);

  useEffect(() => {
    // Launch festive firework bursts on page entry — lazy load canvas-confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
    
    let interval: ReturnType<typeof setInterval>;
    
    // Defer loading slightly to let initial paint happen first
    const timer = setTimeout(() => {
      interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        
        const particleCount = 30 * (timeLeft / duration);
        
        import('canvas-confetti').then((confetti) => {
          confetti.default({
            particleCount,
            startVelocity: 30,
            spread: 360,
            ticks: 70,
            origin: { x: randomInRange(0.1, 0.35), y: randomInRange(0.2, 0.5) },
            colors: ['#D4AF37', '#F4E296', '#F43F5E', '#10B981', '#FF9F1C'],
          });
          confetti.default({
            particleCount,
            startVelocity: 30,
            spread: 360,
            ticks: 70,
            origin: { x: randomInRange(0.65, 0.9), y: randomInRange(0.2, 0.5) },
            colors: ['#D4AF37', '#F4E296', '#F43F5E', '#10B981', '#FF9F1C'],
          });
        });
      }, 500);
    }, 1000);
    
    return () => {
      clearTimeout(timer);
      if (interval) clearInterval(interval);
    };
  }, []);

  const handleHeroClick = (e: React.MouseEvent) => {
    // Prevent bursts when clicking interactive buttons or links
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.closest('button')) {
      return;
    }
    const types = ['burst', 'fountain', 'spin', 'sparkle'] as const;
    const randomType = types[Math.floor(Math.random() * types.length)];
    const id = Date.now();
    setBursts(prev => [...prev, { id, x: e.clientX, y: e.clientY, type: randomType }]);
  };

  const removeBurst = useCallback((id: number) => {
    setBursts(prev => prev.filter(b => b.id !== id));
  }, []);

  return (
    <section 
      className="relative min-h-screen flex flex-col overflow-hidden cursor-crosshair bg-[var(--bg)] transition-colors duration-400" 
      onClick={handleHeroClick} 
      id="hero"
    >
      <Traditional3DHero />
      {children}
      <AnimatePresence>
        {bursts.map(b => (
          <RealisticFirework key={b.id} x={b.x} y={b.y} type={b.type} onComplete={() => removeBurst(b.id)} />
        ))}
      </AnimatePresence>
    </section>
  );
}
