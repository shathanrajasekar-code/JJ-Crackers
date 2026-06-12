'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Traditional3DHero } from '@/components/effects/Traditional3DHero';
import { RealisticFirework } from '@/components/effects/RealisticFirework';
import { AnimatedKolam } from '@/components/ui/AnimatedKolam';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { Shield, Leaf, Factory, Package, ArrowRight, Star, Award, Clock, Users, Sparkles, Quote } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';

const stats = [
  { value: 40, suffix: '+', label: 'Years of Excellence', icon: Clock },
  { value: 10000, suffix: '+', label: 'Happy Families', icon: Users },
  { value: 500, suffix: '+', label: 'Premium Products', icon: Package },
  { value: 100, suffix: '%', label: 'Safety Certified', icon: Shield },
];

const testimonials = [
  { name: 'Rajesh Kumar', location: 'Chennai', text: "The quality of JJ Crackers is simply unmatched. The aerial shots were mesmerizing and the entire neighborhood was in awe. Best Diwali celebration we've ever had!", rating: 5 },
  { name: 'Priya Mahadevan', location: 'Madurai', text: "I specifically love their eco-friendly range. Low smoke, vibrant colors, and the kids were safe throughout. Will definitely order again next festival season.", rating: 5 },
  { name: 'Suresh Venkatesh', location: 'Coimbatore', text: "Ordered the Family Celebration Box — exceeded all expectations. Direct factory pricing saved us almost 40%. The packaging quality shows they truly care.", rating: 5 },
];

export default function HomePage() {
  const [bursts, setBursts] = useState<Array<{ id: number; x: number; y: number; type: any }>>([]);

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
    const types = ['burst', 'fountain', 'spin', 'sparkle'];
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
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT COLUMN — Text Content */}
          <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: 0.5 }} 
              className="inline-flex items-center gap-2 py-2 px-6 rounded-full border border-[var(--color-gold)]/40 bg-[var(--color-gold)]/10 text-[var(--color-gold)] text-xs font-black mb-10 tracking-[0.4em] uppercase backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.2)]"
            >
              <Sparkles size={14} className="animate-pulse" /> Sivakasi&apos;s Royal Legacy Since 1984 <Sparkles size={14} className="animate-pulse" />
            </motion.span>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.85] mb-10 tracking-tighter text-left">
              <motion.span initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7, duration: 1 }} className="block text-[var(--text)]/90">Elegance in</motion.span>
              <motion.span initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9, duration: 1 }} className="block text-gradient-gold text-glow drop-shadow-[0_0_30px_rgba(212,175,55,0.4)]">Every Spark</motion.span>
            </h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="text-lg md:text-xl lg:text-2xl text-[var(--text)]/60 max-w-xl mb-12 leading-relaxed font-light text-left">
              Experience the pinnacle of pyrotechnic artistry. Hand-crafted excellence from India&apos;s heartland, delivered to light up your legacy.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }} className="flex flex-col sm:flex-row items-start justify-start gap-5">
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
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-gold-light)] to-[var(--color-gold-dark)] flex items-center justify-center text-[#1a1400] font-black text-lg shadow-xl flex-shrink-0">JJ</div>
                  <div>
                    <div className="text-white font-bold text-sm tracking-tight">Jegajothi Crackers</div>
                    <div className="text-[var(--color-gold)] text-xs font-black tracking-widest">SINCE 1984</div>
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
          {[{ icon: Shield, title: 'Uncompromising Safety', desc: 'ISO 9001:2015 Certified' }, { icon: Leaf, title: 'Eco-Conscious', desc: 'Sustainable Green Crackers' }, { icon: Factory, title: 'Direct Source', desc: 'Authentic Sivakasi Pricing' }, { icon: Package, title: 'Premium Logistics', desc: 'White-glove Global Delivery' }].map((b, i) => (
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

      {/* STATS */}
      <section className="py-32 relative">
        <div className="absolute inset-0 opacity-10">
          <AnimatedKolam className="absolute -left-20 top-0" size={500} color="#D4AF37" />
          <AnimatedKolam className="absolute -right-20 bottom-0 rotate-180" size={500} color="#D4AF37" />
        </div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-16 relative z-10">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center group">
              <div className="w-20 h-20 rounded-full bg-white/5 text-[var(--color-gold)] flex items-center justify-center mx-auto mb-8 border border-white/10 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] transition-all">
                <s.icon size={32} />
              </div>
              <div className="text-5xl md:text-6xl font-display font-bold text-[var(--text)] mb-3 tracking-tighter">
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </div>
              <div className="text-sm text-[var(--text-muted)] font-black uppercase tracking-[0.2em]">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HERITAGE - Redesigned for Extreme Professionalism */}
      <section className="py-32 bg-[var(--surface-high)] border-y border-[var(--border)]/10 relative overflow-hidden" id="about">
        {/* Glow Effects to fix plain black backdrop */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--color-gold)]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center">
          <motion.div initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: -0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="relative">
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-[var(--border)]/10 shadow-[0_40px_80px_rgba(0,0,0,0.3)]">
              <Image src="/family-festive.png" alt="JJ Crackers Tamil Traditional Family Diwali Celebration" fill className="object-cover scale-110 hover:scale-100 transition-transform duration-1000" sizes="(max-width: 768px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-10 left-10 right-10">
                <div className="flex items-center gap-5 p-6 rounded-3xl bg-[var(--surface)]/20 backdrop-blur-xl border border-white/10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-gold-light)] to-[var(--color-gold-dark)] flex items-center justify-center text-[#1a1400] font-black text-2xl shadow-2xl">JJ</div>
                  <div>
                    <div className="text-white font-bold text-xl tracking-tight">Jegajothi Crackers</div>
                    <div className="text-[var(--color-gold)] text-sm font-black tracking-widest">LEGACY EST. 1984</div>
                  </div>
                </div>
              </div>
            </div>
            <motion.div initial={{ rotate: 0, scale: 0 }} whileInView={{ rotate: 12, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.6, type: 'spring' }} className="absolute -top-10 -right-10 w-32 h-32 rounded-3xl bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dark)] flex flex-col items-center justify-center text-[#1a1400] shadow-[0_20px_50px_rgba(212,175,55,0.4)]">
              <Award size={36} /><span className="text-sm font-black mt-2 tracking-tighter">40 YEARS</span>
            </motion.div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
            <span className="inline-flex items-center gap-3 text-sm font-black text-[var(--color-gold)] uppercase tracking-[0.4em] mb-8"><div className="w-8 h-[1px] bg-[var(--color-gold)]" /> Our Heritage</span>
            <h2 className="text-5xl md:text-7xl font-display font-bold mb-10 text-[var(--text)] leading-[0.9] tracking-tighter">
              Crafting Brilliance <br /><span className="text-gradient-gold">Since 1984</span>
            </h2>
            <p className="text-xl text-[var(--text-muted)] leading-relaxed mb-8 font-light italic">"Born in Sivakasi, refined by time, and celebrated across nations."</p>
            <p className="text-lg text-[var(--text)]/60 leading-relaxed mb-12">Founded in the heart of India&apos;s pyrotechnic capital, Jegajothi Crackers has evolved from a master craftsman&apos;s workshop into a global benchmark for quality. Each spark we create carries the weight of forty years of tradition, safety, and joy.</p>
            
            <div className="grid grid-cols-2 gap-6">
              {[{ label: 'Sivakasi Origin', year: '1984' }, { label: 'Global Standards', year: 'ISO' }, { label: 'Next-Gen Eco', year: '2020' }, { label: 'Digital Era', year: '2024' }].map((m) => (
                <div key={m.label} className="group p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)]/10 hover:border-[var(--color-gold)]/30 transition-all">
                  <div className="text-2xl font-display font-bold text-[var(--color-gold)] mb-1">{m.year}</div>
                  <div className="text-xs text-[var(--text-muted)] font-black uppercase tracking-widest">{m.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* TAMIL TRADITIONAL SPECIALTY SECTION */}
      <section className="py-32 relative overflow-hidden border-b border-[var(--border)]/10 bg-radial-[circle_at_center] from-[#100F0D] via-[var(--bg)] to-[var(--bg)]">
        {/* Floating elements */}
        <div className="absolute top-10 right-10 opacity-5 pointer-events-none">
          <AnimatedKolam size={400} color="#D4AF37" />
        </div>
        <div className="absolute bottom-10 left-10 opacity-5 pointer-events-none">
          <AnimatedKolam size={450} color="#D4AF37" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-gold)]/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <span className="inline-flex items-center gap-3 text-sm font-black text-[var(--color-gold)] uppercase tracking-[0.4em] mb-6">
              <div className="w-8 h-[1px] bg-[var(--color-gold)]" /> Traditional Pride <div className="w-8 h-[1px] bg-[var(--color-gold)]" />
            </span>
            <h2 className="text-5xl md:text-7xl font-display font-bold text-[var(--text)] tracking-tighter">
              Sivakasi Specialty <br /><span className="text-gradient-gold">Traditional Assortments</span>
            </h2>
            <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto mt-6 font-light">
              Bringing you the authentic sound and light formulas crafted in Sivakasi since 1984. Built for heritage celebrations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Oolai Vedi', desc: 'Tamil Nadu’s traditional hand-knotted dry palm-leaf cracker with a loud echoing thunder burst.', type: 'Palm Leaf Cracker', label: 'Classic Sound' },
              { title: 'Lakshmi Vedi', desc: 'Worshipped paper bomb wrapped in sacred red threads carrying the classic medium-frequency crackle.', type: 'Red Thread Bomb', label: 'Auspicious' },
              { title: 'Garland Chains', desc: 'Long-running continuous crackling wall hangers simulating a rhythmic waterfall of sparks.', type: 'Chain Crackers', label: '1000 to 10000 Lari' },
              { title: 'Golden Chakkars', desc: 'Traditional ground spinners releasing high-speed concentric golden sparks on flooring.', type: 'Ground Spinner', label: 'Vibrant Light' }
            ].map((vedi, idx) => (
              <motion.div 
                key={vedi.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="bg-[#141412] border border-[#2A2A24] rounded-3xl p-8 hover:border-[var(--color-gold)]/40 transition-all duration-500 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[var(--color-gold)]/5 to-transparent rounded-bl-3xl group-hover:from-[var(--color-gold)]/10 transition-all" />
                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--color-gold)] bg-[var(--color-gold)]/10 px-3 py-1 rounded-full border border-[var(--color-gold)]/20">{vedi.label}</span>
                <h3 className="text-2xl font-display font-bold text-[#F5F5F0] mt-6 group-hover:text-[var(--color-gold)] transition-colors">{vedi.title}</h3>
                <p className="text-xs text-[#A0A090] uppercase tracking-widest font-black mt-1">{vedi.type}</p>
                <p className="text-sm text-[var(--text-muted)] mt-5 leading-relaxed font-light">{vedi.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* TESTIMONIALS - Luxury Slider Style */}
      <section className="py-32 bg-[var(--surface-high)] border-t border-[var(--border)]/10" id="testimonials">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-10">
            <div>
              <span className="inline-flex items-center gap-3 text-sm font-black text-[var(--color-gold)] uppercase tracking-[0.4em] mb-6">Wall of Trust</span>
              <h2 className="text-6xl md:text-7xl font-display font-bold text-[var(--text)] tracking-tighter">Loved by Thousands</h2>
            </div>
            <p className="text-xl text-[var(--text-muted)] max-w-md font-light leading-relaxed">Join the global community of families who celebrate their most precious moments with JJ Crackers.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="h-full p-10 rounded-[3rem] bg-[var(--surface)] border border-[var(--border)]/10 hover:border-[var(--color-gold)]/20 transition-all duration-500 group shadow-sm hover:shadow-md">
                  <Quote size={48} className="text-[var(--color-gold)]/10 mb-8 group-hover:text-[var(--color-gold)]/30 transition-colors" />
                  <div className="flex text-[var(--color-gold)] mb-8 gap-1">{[...Array(t.rating)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}</div>
                  <p className="text-lg text-[var(--text)]/60 mb-12 leading-relaxed font-light italic">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-5 pt-8 border-t border-[var(--border)]/10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dark)] flex items-center justify-center text-[#1a1400] text-lg font-black shadow-xl">{t.name.charAt(0)}</div>
                    <div>
                      <div className="font-bold text-lg text-[var(--text)] tracking-tight">{t.name}</div>
                      <div className="text-xs text-[var(--text-muted)] font-black uppercase tracking-widest">{t.location}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
                <a href="https://wa.me/917092300252" target="_blank" rel="noopener noreferrer">
                  <motion.button whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.3)' }} whileTap={{ scale: 0.97 }} className="px-12 py-6 rounded-full bg-white/20 backdrop-blur-md border border-[#1a1400]/20 text-[#1a1400] font-black text-2xl hover:bg-white/30 transition-all">
                    WhatsApp Concierge
                  </motion.button>
                </a>
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
