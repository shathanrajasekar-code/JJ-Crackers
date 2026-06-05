'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatedKolam } from '@/components/ui/AnimatedKolam';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { Shield, Leaf, Factory, Award, Users, Clock, Target, Heart, ArrowRight, Sparkles, Star, MapPin } from 'lucide-react';

const timeline = [
  { year: '1984', title: 'The Beginning', desc: 'Founded in Sivakasi by master craftsmen with a vision to create premium fireworks for every Indian celebration.' },
  { year: '1995', title: 'First Expansion', desc: 'Expanded manufacturing facility with modern equipment. Introduced 200+ new product lines for festivals and events.' },
  { year: '2005', title: 'ISO Certification', desc: 'Achieved ISO 9001:2015 certification, setting new benchmarks for quality and safety in the fireworks industry.' },
  { year: '2015', title: 'Green Revolution', desc: 'Pioneered eco-friendly crackers with reduced emissions. 40% of our product line is now green-certified.' },
  { year: '2020', title: 'Digital Transformation', desc: 'Launched online ordering platform, reaching customers across India with direct factory pricing.' },
  { year: '2024', title: 'Global Reach', desc: '40 years of excellence. Serving 10,000+ families with 500+ premium products. The legacy continues.' },
];

const values = [
  { icon: Shield, title: 'Safety First', desc: 'Every product undergoes rigorous quality testing. We follow the highest safety standards in manufacturing.' },
  { icon: Leaf, title: 'Eco-Conscious', desc: 'Our green crackers reduce pollution by 40%. We invest in sustainable practices for a better tomorrow.' },
  { icon: Heart, title: 'Customer Love', desc: 'Every order is handled with personal care. From selection to delivery, we ensure a premium experience.' },
  { icon: Target, title: 'Quality Promise', desc: 'Four decades of perfecting our craft. Each sparkle, each burst is a testament to our unwavering quality.' },
];

const teamMembers = [
  { name: 'Founder', role: 'Managing Director', desc: 'With 40+ years of experience in pyrotechnics, our founder laid the foundation of JJ Crackers in 1984.' },
  { name: 'Operations Head', role: 'Production Director', desc: 'Overseeing 500+ product lines with precision. Ensuring every cracker meets our quality standards.' },
  { name: 'Quality Team', role: 'Safety & Compliance', desc: 'Our dedicated QC team tests every batch. ISO certified processes ensure the highest safety margins.' },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col bg-[var(--bg)]">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <AnimatedKolam className="absolute -left-20 top-0" size={500} color="#D4AF37" />
          <AnimatedKolam className="absolute -right-20 bottom-0 rotate-180" size={500} color="#D4AF37" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[var(--color-gold)]/40 bg-[var(--color-gold)]/10 text-[var(--color-gold)] text-xs font-black tracking-[0.4em] uppercase mb-8">
            <Sparkles size={14} /> Our Heritage
          </motion.span>
          
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.9] mb-8 tracking-tighter">
            Four Decades of
            <span className="block text-gradient-gold text-glow">Brilliance</span>
          </motion.h1>
          
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-xl text-[var(--text-muted)] max-w-3xl mx-auto leading-relaxed font-light">
            Born in the heart of Sivakasi, refined by time, and celebrated across the nation. Jegajothi Crackers has been 
            crafting moments of joy since 1984.
          </motion.p>
        </div>
      </section>

      {/* Logo & Story Section */}
      <section className="py-24 bg-[var(--surface-high)] border-y border-[var(--border)]/10">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative flex justify-center">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--color-gold)]/20 to-transparent animate-spin-slow" />
              <div className="absolute inset-4 rounded-full overflow-hidden border-4 border-[var(--color-gold)]/30 shadow-[0_0_60px_rgba(212,175,55,0.2)]">
                <Image src="/jj-crackers-logo.png" alt="JJ Crackers Logo" fill className="object-contain p-6" sizes="(max-width: 768px) 300px, 400px" />
              </div>
              <motion.div initial={{ rotate: 0 }} whileInView={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 rounded-full border-2 border-dashed border-[var(--color-gold)]/20" />
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="inline-flex items-center gap-3 text-sm font-black text-[var(--color-gold)] uppercase tracking-[0.4em] mb-6">
              <div className="w-8 h-[1px] bg-[var(--color-gold)]" /> Our Story
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 text-[var(--text)] leading-tight tracking-tighter">
              From a Workshop to a <span className="text-gradient-gold">Legacy</span>
            </h2>
            <p className="text-lg text-[var(--text)]/60 leading-relaxed mb-6">
              In 1984, a master craftsman in Sivakasi — India&apos;s fireworks capital — set out with a singular vision: 
              to create fireworks that don&apos;t just light up the sky, but illuminate hearts.
            </p>
            <p className="text-lg text-[var(--text)]/60 leading-relaxed mb-8">
              What started as a small workshop has grown into one of Sivakasi&apos;s most trusted fireworks manufacturers. 
              Today, JJ Crackers (Jegajothi) serves over 10,000 families across India with 500+ premium products, 
              maintaining the same passion for quality and safety that defined our founder&apos;s first sparkler.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)] text-sm font-bold">
                <MapPin size={14} /> Sivakasi, Tamil Nadu
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)] text-sm font-bold">
                <Award size={14} /> Est. 1984
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { value: 40, suffix: '+', label: 'Years of Excellence', icon: Clock },
            { value: 10000, suffix: '+', label: 'Happy Families', icon: Users },
            { value: 500, suffix: '+', label: 'Premium Products', icon: Factory },
            { value: 100, suffix: '%', label: 'Safety Certified', icon: Shield },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center group">
              <div className="w-20 h-20 rounded-full bg-white/5 text-[var(--color-gold)] flex items-center justify-center mx-auto mb-6 border border-white/10 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] transition-all">
                <s.icon size={32} />
              </div>
              <div className="text-4xl md:text-5xl font-display font-bold text-[var(--text)] mb-2 tracking-tighter">
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </div>
              <div className="text-xs text-[var(--text-muted)] font-black uppercase tracking-[0.2em]">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-[var(--surface-high)] border-y border-[var(--border)]/10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <span className="inline-flex items-center gap-3 text-sm font-black text-[var(--color-gold)] uppercase tracking-[0.4em] mb-6">Our Journey</span>
            <h2 className="text-5xl md:text-6xl font-display font-bold text-[var(--text)] tracking-tighter">The JJ Crackers Timeline</h2>
          </motion.div>
          
          <div className="relative">
            {/* Center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[var(--color-gold)]/20 hidden md:block" />
            
            <div className="space-y-12 md:space-y-0">
              {timeline.map((item, i) => (
                <motion.div key={item.year} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className={`relative md:flex md:items-center md:gap-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} md:mb-16`}>
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="glass-card rounded-2xl p-8 hover:border-[var(--color-gold)]/40 transition-all">
                      <div className="text-3xl font-display font-bold text-[var(--color-gold)] mb-2">{item.year}</div>
                      <h3 className="text-xl font-bold text-[var(--text)] mb-3">{item.title}</h3>
                      <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dark)] items-center justify-center text-[#1a1400] font-black text-sm shrink-0 shadow-[0_0_20px_rgba(212,175,55,0.3)] z-10">
                    <Star size={16} fill="currentColor" />
                  </div>
                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <span className="inline-flex items-center gap-3 text-sm font-black text-[var(--color-gold)] uppercase tracking-[0.4em] mb-6">What We Believe In</span>
            <h2 className="text-5xl md:text-6xl font-display font-bold text-[var(--text)] tracking-tighter">Our Core Values</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass-card rounded-3xl p-8 text-center group hover:border-[var(--color-gold)]/40">
                <div className="w-20 h-20 rounded-2xl bg-[var(--color-gold)]/10 text-[var(--color-gold)] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <v.icon size={36} />
                </div>
                <h3 className="text-xl font-bold font-display text-[var(--text)] mb-3">{v.title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-[var(--surface-high)] border-y border-[var(--border)]/10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <span className="inline-flex items-center gap-3 text-sm font-black text-[var(--color-gold)] uppercase tracking-[0.4em] mb-6">The People Behind JJ</span>
            <h2 className="text-5xl md:text-6xl font-display font-bold text-[var(--text)] tracking-tighter">Our Leadership</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((m, i) => (
              <motion.div key={m.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass-card rounded-3xl p-8 text-center group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dark)] flex items-center justify-center mx-auto mb-6 text-[#1a1400] text-2xl font-black shadow-xl">
                  {m.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold font-display text-[var(--text)] mb-1">{m.name}</h3>
                <div className="text-xs text-[var(--color-gold)] font-bold uppercase tracking-[0.15em] mb-4">{m.role}</div>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <span className="inline-flex items-center gap-3 text-sm font-black text-[var(--color-gold)] uppercase tracking-[0.4em] mb-6">Trust & Quality</span>
            <h2 className="text-5xl md:text-6xl font-display font-bold text-[var(--text)] tracking-tighter">Certifications</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'ISO 9001:2015', desc: 'International quality management certification ensuring consistent product quality.', icon: '🏆' },
              { title: 'BIS Approved', desc: 'Bureau of Indian Standards approved manufacturing processes and materials.', icon: '✅' },
              { title: 'PESO Licensed', desc: 'Petroleum and Explosives Safety Organisation licensed for safe manufacturing.', icon: '🛡️' },
            ].map((cert, i) => (
              <motion.div key={cert.title} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass-card rounded-3xl p-8 text-center group">
                <div className="text-5xl mb-6">{cert.icon}</div>
                <h3 className="text-xl font-bold font-display text-[var(--text)] mb-3">{cert.title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{cert.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[var(--surface-high)] border-t border-[var(--border)]/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <Sparkles size={48} className="mx-auto mb-8 text-[var(--color-gold)] animate-bounce" />
            <h2 className="text-4xl md:text-6xl font-display font-bold text-[var(--text)] mb-6 tracking-tighter">
              Ready to Experience <br /><span className="text-gradient-gold">Our Excellence?</span>
            </h2>
            <p className="text-lg text-[var(--text-muted)] mb-10 max-w-2xl mx-auto">
              Browse our premium collection of Sivakasi&apos;s finest fireworks and let us make your celebration extraordinary.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/products">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                  className="px-10 py-4 rounded-full bg-gradient-to-r from-[var(--color-gold-light)] via-[var(--color-gold)] to-[var(--color-gold-dark)] text-[#1a1400] font-bold text-lg flex items-center gap-3 shadow-lg">
                  Shop Now <ArrowRight size={20} />
                </motion.button>
              </Link>
              <Link href="/contact">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                  className="px-10 py-4 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-[var(--text)] font-bold text-lg hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-all">
                  Contact Us
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
