'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Traditional3DHero } from '@/components/effects/Traditional3DHero';
import { RealisticFirework } from '@/components/effects/RealisticFirework';
import { AnimatedKolam } from '@/components/ui/AnimatedKolam';
import { Shield, Leaf, Factory, Package, ArrowRight, Sparkles, Send, Mail, Heart } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';

export default function HomePage() {
  const [bursts, setBursts] = useState<Array<{ id: number; x: number; y: number; type: 'burst' | 'fountain' | 'spin' | 'sparkle' }>>([]);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');
  const [marqueeText, setMarqueeText] = useState('Welcome to Jegajothi Crackers Sivakasi - Direct Factory Price Quality Fireworks! We Give Special Festive Discounts! Buy More Save More!');
  const [globalDiscount, setGlobalDiscount] = useState('60');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (data.marquee) {
            setMarqueeText(data.marquee);
          }
          if (data.global_discount) {
            setGlobalDiscount(data.global_discount);
          }
        }
      })
      .catch(err => console.error('Failed to load settings on home:', err));
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setSubscribeError('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubscribed(true);
        setEmail('');
      } else {
        setSubscribeError(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (err) {
      setSubscribeError('Something went wrong. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Launch festive firework bursts on page entry — shorter for snappy feel
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
    
    const interval: ReturnType<typeof setInterval> = setInterval(() => {
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

  const displayMarquee = marqueeText.includes('[discount]')
    ? marqueeText.replace(/\[discount\]/g, `${globalDiscount}%`)
    : `${marqueeText} — 🔥 FLAT ${globalDiscount}% DISCOUNT ON ALL ITEMS! 🔥`;

  return (
    <div className="flex flex-col bg-[var(--bg)] -mt-20">

      {/* 3D HERO */}
      <section 
        className="relative min-h-screen flex flex-col overflow-hidden cursor-crosshair bg-[var(--bg)] transition-colors duration-400" 
        onClick={handleHeroClick} 
        id="hero"
      >
        <Traditional3DHero />

        {/* Dynamic Announcement Marquee Bar — at the top of hero, below fixed navbar */}
        <div className="relative w-full bg-[rgba(212,175,55,0.15)] border-t border-b border-[rgba(212,175,55,0.25)] py-2 sm:py-2.5 overflow-hidden flex select-none z-30 mt-20 lg:mt-24">
          <div className="animate-marquee-horizontal flex gap-6 sm:gap-8 whitespace-nowrap uppercase tracking-[0.12em] sm:tracking-[0.15em] font-black text-[9px] sm:text-xs text-[var(--color-gold)]">
            <span>{displayMarquee}</span>
            <span>🎆</span>
            <span>{displayMarquee}</span>
            <span>🎆</span>
            {/* Duplicate for seamless looping */}
            <span>{displayMarquee}</span>
            <span>🎆</span>
            <span>{displayMarquee}</span>
            <span>🎆</span>
          </div>
        </div>

        {/* Hero Content — side-by-side split screen layout */}
        <div className="relative z-10 flex-1 grid grid-cols-[45%_55%] sm:grid-cols-[55%_45%] w-full h-full">
          
          {/* LEFT COLUMN — Text Content */}
          <div className="relative flex flex-col justify-center items-start py-6 sm:py-10 lg:py-12 px-4 sm:px-10 md:px-14 lg:px-0" style={{ paddingLeft: 'clamp(1rem, 6vw, 10rem)' }}>
            {/* Radial Gradient Glow behind headline */}
            <div 
              className="absolute inset-0 pointer-events-none -z-10 w-full h-full" 
              style={{ 
                background: 'radial-gradient(ellipse 600px 400px at 30% 50%, rgba(212,175,55,0.12) 0%, transparent 70%)'
              }} 
            />

            <motion.div 
              initial={{ opacity: 0, x: -40 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-xl pt-4 sm:pt-10 lg:pt-0"
            >
              {/* JJ Crackers Logo + Branding */}
              <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                <div className="relative w-9 h-9 sm:w-18 sm:h-18 lg:w-22 lg:h-22 overflow-hidden flex-shrink-0">
                  <Image 
                    src="/logo/logo.png" 
                    alt="JJ Crackers Logo" 
                    fill 
                    className="object-contain" 
                    sizes="(max-width: 640px) 45px, 88px"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-display text-xs sm:text-xl lg:text-2xl font-extrabold text-[var(--color-gold)] tracking-tight leading-none">JJ Crackers</span>
                  <span className="font-display text-[9px] sm:text-base lg:text-lg font-semibold text-[var(--text)]/90 transition-colors duration-400 leading-tight">Jegajothi Crackers</span>
                  <span className="text-[6px] sm:text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold)]/70 font-bold mt-0.5">Since 2015 · Sivakasi</span>
                </div>
              </div>

              {/* Pill Badge */}
              <div 
                className="inline-block text-[7px] sm:text-[0.7rem] uppercase tracking-[0.1em] sm:tracking-[0.15em] px-2 py-0.5 sm:px-4 sm:py-1.5 rounded-full mb-3 sm:mb-5 font-semibold"
                style={{
                  color: '#D4AF37',
                  border: '1px solid rgba(212, 175, 55, 0.6)',
                  backgroundColor: 'rgba(212, 175, 55, 0.1)'
                }}
              >
                Sivakasi&apos;s Royal Legacy Since 2015
              </div>

              {/* Headline */}
              <h1 className="font-display leading-[1.1] mb-3 sm:mb-5 flex flex-col tracking-tight text-left">
                <span className="text-[var(--text)] font-light text-[1.2rem] xs:text-[1.5rem] sm:text-[3rem] lg:text-[4rem] transition-colors duration-400">Elegance in</span>
                <span className="text-[var(--color-gold)] font-extrabold text-[1.4rem] xs:text-[1.8rem] sm:text-[4rem] lg:text-[5rem] drop-shadow-[0_0_30px_rgba(212,175,55,0.4)]">Every Spark</span>
              </h1>

              {/* Body text */}
              <p className="text-[var(--text-muted)] text-[9px] sm:text-[1.05rem] leading-[1.4] sm:leading-[1.7] max-w-[180px] xs:max-w-[220px] sm:max-w-[420px] mb-4 sm:mb-5 font-sans transition-colors duration-400">
                Experience the pinnacle of pyrotechnic artistry. Hand-crafted excellence from India&apos;s heartland, delivered to light up your legacy.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                <Link href="/products" className="w-full sm:w-auto">
                  <motion.button 
                    whileHover={{ scale: 1.03, backgroundColor: '#FFD700', boxShadow: '0 8px 24px rgba(212,175,55,0.35)' }} 
                    whileTap={{ scale: 0.98 }} 
                    className="w-full px-4 py-2 sm:px-9 sm:py-3.5 rounded text-[#0A0A0A] font-bold text-[9px] sm:text-sm uppercase tracking-wider transition-all text-center"
                    style={{ backgroundColor: '#D4AF37', borderRadius: '4px' }}
                  >
                    Shop Now
                  </motion.button>
                </Link>
                <Link href="/products" className="w-full sm:w-auto">
                  <motion.button 
                    whileHover={{ scale: 1.03, backgroundColor: 'rgba(212,175,55,0.08)' }} 
                    whileTap={{ scale: 0.98 }} 
                    className="w-full px-4 py-2 sm:px-9 sm:py-3.5 rounded border bg-transparent font-bold text-[9px] sm:text-sm uppercase tracking-wider transition-all text-center"
                    style={{ borderColor: '#D4AF37', color: '#D4AF37', borderRadius: '4px' }}
                  >
                    View Catalogue
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN — Hero Image (visible side-by-side on all screens) */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden h-full min-h-[250px] sm:min-h-[350px] lg:min-h-[500px]"
          >
            <Image 
              src="/family-festive.png" 
              alt="Family Diwali Celebration with JJ Crackers" 
              fill 
              className="object-cover" 
              style={{ objectPosition: 'center center' }}
              priority
            />
            {/* Gradient overlays */}
            <div 
              className="absolute inset-0 z-10 pointer-events-none" 
              style={{ background: 'linear-gradient(to right, var(--bg) 0%, transparent 40%)' }}
            />
            <div 
              className="absolute inset-0 z-10 pointer-events-none" 
              style={{ background: 'linear-gradient(to top, var(--bg) 0%, transparent 60%)' }} 
            />
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
      <section className="py-8 sm:py-12 border-y border-[var(--border)]/10 bg-[var(--surface-high)] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-12">
          {[{ icon: Shield, title: 'Uncompromising Safety', desc: 'Fully Safety Certified' }, { icon: Leaf, title: 'Eco-Conscious', desc: 'Sustainable Green Crackers' }, { icon: Factory, title: 'Direct Source', desc: 'Authentic Sivakasi Pricing' }, { icon: Package, title: 'Premium Logistics', desc: 'White-glove Global Delivery' }].map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center text-center gap-2 sm:gap-4 group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-[var(--surface)] text-[var(--color-gold)] flex items-center justify-center border border-[var(--border)]/10 group-hover:border-[var(--color-gold)]/50 group-hover:bg-[var(--color-gold)]/5 transition-all duration-500">
                <b.icon size={24} className="sm:w-7 sm:h-7 group-hover:scale-110 transition-transform" />
              </div>
              <div className="space-y-0.5 sm:space-y-1">
                <h3 className="font-bold text-[var(--text)] text-xs sm:text-base tracking-tight">{b.title}</h3>
                <p className="text-[10px] sm:text-xs text-[var(--text-muted)] font-medium">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Removed Newsletter Section */}

      {/* CTA BANNER - The Final Flourish */}
      <section className="py-10 sm:py-20 relative overflow-hidden bg-[var(--bg)] transition-colors duration-400" id="cta">
        <div className="w-full relative z-10 px-0">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            viewport={{ once: true }} 
            className="relative overflow-hidden w-full"
            style={{ borderRadius: '16px' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold-dark)] via-[var(--color-gold)] to-[var(--color-gold-light)]" />
            <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center opacity-10 mix-blend-overlay scale-125" />
            <div className="absolute -top-20 -left-20 opacity-20"><AnimatedKolam size={400} color="#000" /></div>
            
            <div className="relative z-10 py-12 sm:py-20 text-center flex flex-col items-center justify-center px-6 sm:px-12 lg:px-20">
              <div className="text-[24px] sm:text-[28px] mx-auto mb-4 sm:mb-6 text-center select-none" style={{ color: '#0A0A0A' }}>🎆</div>
              <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-extrabold text-[#0A0A0A] mb-4 sm:mb-6 leading-[1.1] tracking-tighter">
                Ready to Light Up <br /> Your Next Legacy?
              </h2>
              <p 
                className="mx-auto mb-8 sm:mb-10 text-center font-medium"
                style={{ 
                  color: 'rgba(0,0,0,0.65)', 
                  fontSize: 'clamp(0.85rem, 2.5vw, 1.05rem)', 
                  maxWidth: '520px', 
                  lineHeight: '1.7' 
                }}
              >
                Browse our master collection or speak with our concierge for bespoke wedding and corporate orders.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <Link href="/products">
                  <motion.button 
                    whileHover={{ scale: 1.02, backgroundColor: '#1a1a1a', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }} 
                    whileTap={{ scale: 0.98 }} 
                    className="px-6 sm:px-8 py-3 sm:py-4 text-[#D4AF37] font-bold text-base sm:text-lg flex items-center gap-2 transition-all"
                    style={{ backgroundColor: '#0A0A0A', borderRadius: '6px' }}
                  >
                    Shop Now <span className="text-xl">→</span>
                  </motion.button>
                </Link>
                <Link href="/contact">
                  <motion.button 
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(0,0,0,0.08)' }} 
                    whileTap={{ scale: 0.98 }} 
                    className="px-6 sm:px-8 py-3 sm:py-4 font-semibold text-base sm:text-lg transition-all"
                    style={{ 
                      border: '2px solid #0A0A0A', 
                      backgroundColor: 'transparent', 
                      color: '#0A0A0A', 
                      borderRadius: '6px' 
                    }}
                  >
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
