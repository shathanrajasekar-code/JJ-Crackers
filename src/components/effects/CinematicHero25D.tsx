'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useHeroStore } from '@/lib/hero-store';

// ═══════════════════════════════════════════════════════════════
// CONSTANTS & CORE CONFIGURATION (SINGLE LAYER UNIFIED SCENE)
// ═══════════════════════════════════════════════════════════════

const CW = 2752; // Original canvas width
const CH = 1536; // Original canvas height

// Flame wick coordinates relative to original 2752x1536 dimensions
const FLAMES: any[] = [];

const FIREWORK_COLORS = [
  { main: '#FFD700', glow: 'rgba(255, 215, 0, 0.06)' }, 
  { main: '#FF3B30', glow: 'rgba(255, 59, 48, 0.05)' },  
  { main: '#007AFF', glow: 'rgba(0, 122, 255, 0.05)' },  
  { main: '#AF52DE', glow: 'rgba(175, 82, 222, 0.05)' }, 
  { main: '#34C759', glow: 'rgba(52, 199, 89, 0.05)' },  
  { main: '#E5E5EA', glow: 'rgba(229, 229, 234, 0.04)' } 
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  targetX?: number;
  targetY?: number;
  speed?: number;
  alpha?: number;
}

export function CinematicHero25D() {
  const { hoveringShopNow, clickBurstTrigger } = useHeroStore();

  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [flashColor, setFlashColor] = useState<string | null>(null);
  const [viewport, setViewport] = useState({ width: CW, height: CH, scale: 1, left: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);

  // ═══════════════════════════════════════════════════════════════
  // VIEWPORT RESIZER (OBJECT-AWARE FOCAL ALIGNMENT)
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!containerRef.current) return;
    const resize = () => {
      if (!containerRef.current) return;
      const pw = containerRef.current.clientWidth;
      const ph = containerRef.current.clientHeight;
      const parentAspect = pw / ph;
      const targetAspect = CW / CH;

      let w = pw;
      let h = ph;

      if (parentAspect > targetAspect) {
        h = pw / targetAspect;
      } else {
        w = ph * targetAspect;
      }

      const scale = w / CW;
      // On mobile (<768px), center the scene on the subjects (center of image)
      // On desktop, bias toward the right side where the gift box is
      const isMobile = pw < 768;
      const focalX = isMobile ? CW * 0.5 : 2000;
      const halfScreenWidth = pw / 2;
      const focalPos = focalX * scale;

      let left = halfScreenWidth - focalPos;
      const minLeft = pw - w;
      const maxLeft = 0;
      left = Math.max(minLeft, Math.min(maxLeft, left));

      setViewport({
        width: w,
        height: h,
        scale,
        left,
      });
    };

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(containerRef.current);
    window.addEventListener('resize', resize);
    resize();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  // ═══════════════════════════════════════════════════════════════
  // MOUSE LISTENER FOR UNIFIED CURSOR PARALLAX
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);



  // ═══════════════════════════════════════════════════════════════
  // DISTANT FIREWORKS LOOP (EVERY 6.5 SECONDS)
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    const triggerFirework = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const firework = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
      const explodeX = (0.2 + Math.random() * 0.55) * canvas.width;
      const explodeY = (0.1 + Math.random() * 0.3) * canvas.height;

      setFlashColor(firework.glow);
      setTimeout(() => setFlashColor(null), 550);

      const particles = particlesRef.current;
      for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.0 + Math.random() * 3.0;
        particles.push({
          x: explodeX,
          y: explodeY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 75 + Math.random() * 50,
          size: 1.4 + Math.random() * 2.0,
          color: firework.main,
        });
      }
    };

    const interval = setInterval(triggerFirework, 6500);
    const initialTid = setTimeout(triggerFirework, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTid);
    };
  }, []);

  // ═══════════════════════════════════════════════════════════════
  // PARTICLES UPDATE ENGINE (CANVAS 2D)
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;

    const resizeCanvas = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resizeCanvas();

    const particles = particlesRef.current;

    if (clickBurstTrigger > 0) {
      const startX = canvas.width * 0.72; 
      const startY = canvas.height * 0.78;
      for (let i = 0; i < 45; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2.0 + Math.random() * 6.5;
        particles.push({
          x: startX,
          y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 40 + Math.random() * 35,
          size: 1.8 + Math.random() * 3.5,
          color: `rgba(212, 175, 55, ${0.75 + Math.random() * 0.25})`,
        });
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Ambient floating particles (fewer on mobile for performance)
      const isMobileCanvas = canvas.width < 768;
      const maxParticles = isMobileCanvas ? 35 : 85;
      const spawnRate = isMobileCanvas ? 0.12 : 0.25;
      if (particles.length < maxParticles && Math.random() < spawnRate) {
        particles.push({
          x: Math.random() * canvas.width,
          y: canvas.height + 10,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -0.3 - Math.random() * 0.6,
          life: 0,
          maxLife: 150 + Math.random() * 150,
          size: 0.8 + Math.random() * (isMobileCanvas ? 1.2 : 2.0),
          color: `rgba(212, 175, 55, ${0.2 + Math.random() * 0.4})`,
        });
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += 1;

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.y += 0.01; 
        p.x += Math.sin(p.life * 0.04) * 0.1;

        const progress = p.life / p.maxLife;
        const alpha = 1 - progress;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      }

      animFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [clickBurstTrigger]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden select-none bg-[#0A0A08]"
      style={{
        perspective: '1000px',
      }}
    >
      {/* Unified single layer viewport. Swaying entire container for locked camera parallax */}
      <div
        className="absolute origin-center transition-all duration-500 ease-out"
        style={{
          width: viewport.width,
          height: viewport.height,
          left: viewport.left,
          top: '50%',
          transform: `translateY(-50%) translate3d(${mouse.x * 6}px, ${mouse.y * 4}px, 0)`,
          // Premium luxury warmth warmth warmth color boosts
          filter: 'brightness(1.16) contrast(1.12) saturate(1.15) sepia(0.14)',
        }}
      >
        <style>{`


          /* Gift box pulse golden glow */
          @keyframes boxGlowAnim {
            0%, 100% { filter: drop-shadow(0 0 12px rgba(212,175,55,0.22)); }
            50% { filter: drop-shadow(0 0 28px rgba(212,175,55,0.65)); }
          }
          .animate-box-glow {
            animation: boxGlowAnim 5s ease-in-out infinite;
          }
        `}</style>

        {/* 1. Background (Complete Original Scene) */}
        <img
          src="/hero/original_scene.png"
          alt="Diwali Courtyard Scene"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* 2. Environmental Firework Glow */}
        {flashColor && (
          <div
            className="absolute inset-0 z-2 pointer-events-none transition-opacity duration-300"
            style={{
              backgroundColor: flashColor,
              mixBlendMode: 'screen',
            }}
          />
        )}

        {/* Eyelids blink overlays mapped relative to complete original layout coordinates */}
        


        {/* Gift Box soft ambient glow overlay */}
        <div
          className="absolute pointer-events-none rounded-full bg-radial from-[rgba(212,175,55,0.48)] via-[rgba(212,175,55,0.18)] to-transparent mix-blend-screen animate-box-glow"
          style={{
            left: '72%',
            top: '75%',
            width: '30%',
            height: '22%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9,
            filter: 'blur(28px)',
          }}
        />

        {/* 3. Flame overlays on Diyas */}
        {FLAMES.map((f, i) => (
          <div
            key={i}
            className="absolute pointer-events-none rounded-full bg-radial from-[#FFCC33] via-[#FF6600]/40 to-transparent mix-blend-screen animate-pulse"
            style={{
              left: `${f.left}%`,
              top: `${f.top}%`,
              width: `${f.size}%`,
              height: `${f.size * 1.8}%`,
              transform: 'translate(-50%, -50%)',
              animationDuration: `${0.18 + ((i * 7) % 35) / 100}s`,
              zIndex: 13,
              opacity: 0.82 + Math.sin(Date.now() * 0.012) * 0.18,
            }}
          />
        ))}

        {/* 4. Particle canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-11" />

        {/* 5. Box ambient glow */}
        <div
          className="absolute pointer-events-none rounded-full bg-radial from-[rgba(212,175,55,0.35)] via-[rgba(212,175,55,0.12)] to-transparent mix-blend-screen"
          style={{
            left: '72%',
            top: '75%',
            width: '45%',
            height: '35%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9,
            filter: 'blur(32px)',
          }}
        />
      </div>
    </div>
  );
}
