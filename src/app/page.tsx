'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Traditional3DHero } from '@/components/effects/Traditional3DHero';
import { RealisticFirework } from '@/components/effects/RealisticFirework';
import { AnimatedKolam } from '@/components/ui/AnimatedKolam';
import { Shield, Leaf, Factory, Package, ArrowRight, Sparkles } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';

export default function HomePage() {
  const [bursts, setBursts] = useState<Array<{ id: number; x: number; y: number; type: 'burst' | 'fountain' | 'spin' | 'sparkle' }>>([]);

  useEffect(() => {
    // Launch festive firework bursts on page entry
    const duration = 6 * 1000;
    const animationEnd = Date.now() + duration;
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
    
    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      
      const particleCount = 45 * (timeLeft / duration);
      
      import('canvas-confetti').then((confetti) => {
        confetti.default({
          particleCount,
          startVelocity: 35,
          spread: 360,
          ticks: 90,
          origin: { x: randomInRange(0.1, 0.35), y: randomInRange(0.2, 0.5) },
          colors: ['#D4AF37', '#F4E296', '#F43F5E', '#10B981', '#FF9F1C'],
        });
        confetti.default({
          particleCount,
          startVelocity: 35,
          spread: 360,
          ticks: 90,
          origin: { x: randomInRange(0.65, 0.9), y: randomInRange(0.2, 0.5) },
          colors: ['#D4AF37', '#F4E296', '#F43F5E', '#10B981', '#FF9F1C'],
        });
      });
    }, 450);
    
    return () => clearInterval(interval);
  }, []);

  const handleHeroClick = (e: React.MouseEvent) => {
    const types = ['burst', 'fountain', 'spin', 'sparkle'] as const;
    const randomType = types[Math.floor(Math.random() * types.length)];
    const id = Date.now();
    setBursts(prev => [...prev, { id, x: e.clientX, y: e.clientY, type: randomType }]);
  };

  const removeBurst = useCallback((id: number) => {
    setBursts(prev => prev.filter(b => b.id !== id));
  }, []);

  return (
    <div className="flex flex-col bg-[var(--bg)]">
      {/* 3D HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden cursor-crosshair" onClick={handleHeroClick} id="hero">
        <Traditional3DHero />

        {/* Left Side Hanging Diya Lights */}
        <div className="absolute left-6 md:left-16 top-0 z-20 flex gap-4 md:gap-8 pointer-events-none">
          {/* Diya 1 */}
          <motion.div 
            initial={{ y: -200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.2, duration: 1.5, stiffness: 80 }}
            className="flex flex-col items-center"
          >
            <div className="w-0.5 h-32 md:h-44 bg-gradient-to-b from-[var(--color-gold)]/20 via-[var(--color-gold)]/60 to-[var(--color-gold)]" />
            <svg width="36" height="36" viewBox="0 0 100 100" className="text-[var(--color-gold)] drop-shadow-[0_0_10px_rgba(212,175,55,0.75)]">
              <path fill="currentColor" d="M50 15 C52 35 75 50 75 70 A25 25 0 0 1 25 70 C25 50 48 35 50 15 Z" />
              <circle cx="50" cy="70" r="10" fill="#E25822" />
              <motion.path 
                animate={{ scaleY: [1, 1.3, 0.95, 1.2, 1], scaleX: [1, 1.15, 0.9, 1.1, 1] }} 
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                fill="#FFD700" 
                d="M50 42 C53 52 56 58 50 70 C44 58 47 52 50 42 Z" 
              />
            </svg>
          </motion.div>

          {/* Diya 2 */}
          <motion.div 
            initial={{ y: -250, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.4, duration: 1.8, stiffness: 70 }}
            className="flex flex-col items-center"
          >
            <div className="w-0.5 h-48 md:h-64 bg-gradient-to-b from-[var(--color-gold)]/20 via-[var(--color-gold)]/60 to-[var(--color-gold)]" />
            <svg width="44" height="44" viewBox="0 0 100 100" className="text-[var(--color-gold)] drop-shadow-[0_0_12px_rgba(212,175,55,0.85)]">
              <path fill="currentColor" d="M50 15 C52 35 75 50 75 70 A25 25 0 0 1 25 70 C25 50 48 35 50 15 Z" />
              <circle cx="50" cy="70" r="10" fill="#E25822" />
              <motion.path 
                animate={{ scaleY: [1, 1.25, 0.9, 1.15, 1], scaleX: [1, 1.1, 0.95, 1.05, 1] }} 
                transition={{ repeat: Infinity, duration: 1.3, ease: 'easeInOut' }}
                fill="#FFD700" 
                d="M50 42 C53 52 56 58 50 70 C44 58 47 52 50 42 Z" 
              />
            </svg>
          </motion.div>

          {/* Diya 3 */}
          <motion.div 
            initial={{ y: -150, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.6, duration: 1.2, stiffness: 90 }}
            className="flex flex-col items-center hidden sm:flex"
          >
            <div className="w-0.5 h-20 md:h-28 bg-gradient-to-b from-[var(--color-gold)]/20 via-[var(--color-gold)]/60 to-[var(--color-gold)]" />
            <svg width="28" height="28" viewBox="0 0 100 100" className="text-[var(--color-gold)] drop-shadow-[0_0_8px_rgba(212,175,55,0.65)]">
              <path fill="currentColor" d="M50 15 C52 35 75 50 75 70 A25 25 0 0 1 25 70 C25 50 48 35 50 15 Z" />
              <circle cx="50" cy="70" r="10" fill="#E25822" />
              <motion.path 
                animate={{ scaleY: [1, 1.2, 0.95, 1.1, 1], scaleX: [1, 1.15, 0.9, 1.1, 1] }} 
                transition={{ repeat: Infinity, duration: 1.7, ease: 'easeInOut' }}
                fill="#FFD700" 
                d="M50 42 C53 52 56 58 50 70 C44 58 47 52 50 42 Z" 
              />
            </svg>
          </motion.div>
        </div>

        {/* Right Side Hanging Diya Lights */}
        <div className="absolute right-6 md:right-16 top-0 z-20 flex gap-4 md:gap-8 pointer-events-none">
          {/* Diya 1 */}
          <motion.div 
            initial={{ y: -180, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.3, duration: 1.4, stiffness: 85 }}
            className="flex flex-col items-center hidden sm:flex"
          >
            <div className="w-0.5 h-24 md:h-36 bg-gradient-to-b from-[var(--color-gold)]/20 via-[var(--color-gold)]/60 to-[var(--color-gold)]" />
            <svg width="30" height="30" viewBox="0 0 100 100" className="text-[var(--color-gold)] drop-shadow-[0_0_8px_rgba(212,175,55,0.65)]">
              <path fill="currentColor" d="M50 15 C52 35 75 50 75 70 A25 25 0 0 1 25 70 C25 50 48 35 50 15 Z" />
              <circle cx="50" cy="70" r="10" fill="#E25822" />
              <motion.path 
                animate={{ scaleY: [1, 1.25, 0.9, 1.15, 1], scaleX: [1, 1.1, 0.95, 1.05, 1] }} 
                transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                fill="#FFD700" 
                d="M50 42 C53 52 56 58 50 70 C44 58 47 52 50 42 Z" 
              />
            </svg>
          </motion.div>

          {/* Diya 2 */}
          <motion.div 
            initial={{ y: -260, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.5, duration: 1.9, stiffness: 65 }}
            className="flex flex-col items-center"
          >
            <div className="w-0.5 h-52 md:h-72 bg-gradient-to-b from-[var(--color-gold)]/20 via-[var(--color-gold)]/60 to-[var(--color-gold)]" />
            <svg width="44" height="44" viewBox="0 0 100 100" className="text-[var(--color-gold)] drop-shadow-[0_0_12px_rgba(212,175,55,0.85)]">
              <path fill="currentColor" d="M50 15 C52 35 75 50 75 70 A25 25 0 0 1 25 70 C25 50 48 35 50 15 Z" />
              <circle cx="50" cy="70" r="10" fill="#E25822" />
              <motion.path 
                animate={{ scaleY: [1, 1.35, 0.95, 1.2, 1], scaleX: [1, 1.1, 0.9, 1.15, 1] }} 
                transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                fill="#FFD700" 
                d="M50 42 C53 52 56 58 50 70 C44 58 47 52 50 42 Z" 
              />
            </svg>
          </motion.div>

          {/* Diya 3 */}
          <motion.div 
            initial={{ y: -210, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.7, duration: 1.6, stiffness: 75 }}
            className="flex flex-col items-center"
          >
            <div className="w-0.5 h-36 md:h-48 bg-gradient-to-b from-[var(--color-gold)]/20 via-[var(--color-gold)]/60 to-[var(--color-gold)]" />
            <svg width="36" height="36" viewBox="0 0 100 100" className="text-[var(--color-gold)] drop-shadow-[0_0_10px_rgba(212,175,55,0.75)]">
              <path fill="currentColor" d="M50 15 C52 35 75 50 75 70 A25 25 0 0 1 25 70 C25 50 48 35 50 15 Z" />
              <circle cx="50" cy="70" r="10" fill="#E25822" />
              <motion.path 
                animate={{ scaleY: [1, 1.25, 1], scaleX: [1, 1.1, 1] }} 
                transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                fill="#FFD700" 
                d="M50 42 C53 52 56 58 50 70 C44 58 47 52 50 42 Z" 
              />
            </svg>
          </motion.div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT COLUMN — Text Content */}
          <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: 0.5 }} 
              className="inline-flex items-center gap-2 py-2 px-6 rounded-full border border-[var(--color-gold)]/40 bg-[var(--color-gold)]/10 text-[var(--color-gold)] text-xs font-black mb-10 tracking-[0.4em] uppercase backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.2)]"
            >
              <Sparkles size={14} className="animate-pulse" /> Sivakasi&apos;s Royal Legacy Since 2015 <Sparkles size={14} className="animate-pulse" />
            </motion.span>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-[1.1] mb-10 tracking-tighter text-center lg:text-left">
              <motion.span initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7, duration: 1 }} className="block text-[var(--text)]/90">Elegance in</motion.span>
              <motion.span initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9, duration: 1 }} className="block text-gradient-gold text-glow drop-shadow-[0_0_30px_rgba(212,175,55,0.4)]">Every Spark</motion.span>
            </h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="text-lg md:text-xl lg:text-2xl text-[var(--text)]/60 max-w-xl mb-12 leading-relaxed font-light text-center lg:text-left">
              Experience the pinnacle of pyrotechnic artistry. Hand-crafted excellence from India&apos;s heartland, delivered to light up your legacy.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
              <Link href="/products">
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(212,175,55,0.5)' }} 
                  whileTap={{ scale: 0.97 }} 
                  className="px-10 py-5 rounded-full bg-gradient-to-r from-[var(--color-gold-light)] via-[var(--color-gold)] to-[var(--color-gold-dark)] text-[#1a1400] font-black text-xl flex items-center gap-4 shadow-[0_10px_40px_rgba(212,175,55,0.3)] transition-all"
                >
                  Explore Collection <ArrowRight size={24} />
                </motion.button>
              </Link>
              <Link href="/combos">
                <motion.button 
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(212,175,55,0.1)' }} 
                  whileTap={{ scale: 0.97 }} 
                  className="px-10 py-5 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 text-white font-bold text-xl hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-all"
                >
                  Combo Packs
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN — Hero Image */}
          <motion.div 
            initial={{ opacity: 0, x: 60 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="order-first lg:order-last"
          >
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 hover:border-[var(--color-gold)]/40 shadow-[0_40px_80px_rgba(0,0,0,0.4)] transition-all duration-700 group">
              <Image 
                src="/family-festive.png" 
                alt="Family Diwali Celebration with JJ Crackers" 
                fill 
                className="object-cover scale-110 group-hover:scale-100 transition-transform duration-1000 ease-out" 
                sizes="(max-width: 768px) 100vw, 50vw" 
                priority
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              {/* Subtle gold shimmer on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold)]/0 to-[var(--color-gold)]/0 group-hover:from-[var(--color-gold)]/5 group-hover:to-transparent transition-all duration-700" />
              {/* JJ Badge overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/10 group-hover:border-[var(--color-gold)]/30 transition-all duration-500">
                  <div className="w-12 h-12 rounded-full overflow-hidden shadow-xl flex-shrink-0 relative bg-white border border-[var(--color-gold)]/30">
                    <Image src="/logo/logo.png" alt="Jegajothi Crackers" fill className="object-cover dark:brightness-[0.9] dark:contrast-[1.1] transition-all duration-300" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm tracking-tight">Jegajothi Crackers</div>
                    <div className="text-[var(--color-gold)] text-xs font-black tracking-widest">SINCE 2015</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>



        {/* Realistic Blasts Overlay */}
        <AnimatePresence>
          {bursts.map(b => (
            <RealisticFirework key={b.id} x={b.x} y={b.y} type={b.type} onComplete={() => removeBurst(b.id)} />
          ))}
        </AnimatePresence>
      </section>

      {/* TRUST BADGES - Ultra Premium */}
      <section className="py-12 border-y border-[var(--border)]/10 bg-[var(--surface-high)] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[{ icon: Shield, title: 'Uncompromising Safety', desc: 'Fully Safety Certified' }, { icon: Leaf, title: 'Eco-Conscious', desc: 'Sustainable Green Crackers' }, { icon: Factory, title: 'Direct Source', desc: 'Authentic Sivakasi Pricing' }, { icon: Package, title: 'Premium Logistics', desc: 'White-glove Global Delivery' }].map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center text-center gap-4 group">
              <div className="w-16 h-16 rounded-3xl bg-[var(--surface)] text-[var(--color-gold)] flex items-center justify-center border border-[var(--border)]/10 group-hover:border-[var(--color-gold)]/50 group-hover:bg-[var(--color-gold)]/5 transition-all duration-500">
                <b.icon size={28} className="group-hover:scale-110 transition-transform" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-[var(--text)] text-base tracking-tight">{b.title}</h3>
                <p className="text-xs text-[var(--text-muted)] font-medium">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>




      {/* CTA BANNER - The Final Flourish */}
      <section className="py-32 relative overflow-hidden" id="cta">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative rounded-[4rem] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold-dark)] via-[var(--color-gold)] to-[var(--color-gold-light)]" />
            <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center opacity-10 mix-blend-overlay scale-125" />
            <div className="absolute -top-20 -left-20 opacity-20"><AnimatedKolam size={400} color="#000" /></div>
            
            <div className="relative z-10 px-10 py-24 md:px-24 md:py-32 text-center">
              <Sparkles size={48} className="mx-auto mb-10 text-[#1a1400]/40 animate-bounce" />
              <h2 className="text-5xl md:text-8xl font-display font-bold text-[#1a1400] mb-10 leading-[0.85] tracking-tighter">Ready to Light Up <br /> Your Next Legacy?</h2>
              <p className="text-[#1a1400]/60 max-w-2xl mx-auto mb-16 text-xl md:text-2xl font-medium">Browse our master collection or speak with our concierge for bespoke wedding and corporate orders.</p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <Link href="/products">
                  <motion.button whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }} whileTap={{ scale: 0.97 }} className="px-12 py-6 rounded-full bg-[#1a1400] text-[var(--color-gold)] font-black text-2xl flex items-center gap-4 shadow-2xl transition-all">
                    Shop Now <ArrowRight size={28} />
                  </motion.button>
                </Link>
                <Link href="/contact">
                  <motion.button whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.3)' }} whileTap={{ scale: 0.97 }} className="px-12 py-6 rounded-full bg-white/20 backdrop-blur-md border border-[#1a1400]/20 text-[#1a1400] font-black text-2xl hover:bg-white/30 transition-all">
                    Contact Us
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none">
          <AnimatedKolam size={600} color="#D4AF37" />
        </div>
      </section>
    </div>
  );
}
