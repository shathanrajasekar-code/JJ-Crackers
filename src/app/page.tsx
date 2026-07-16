import Link from 'next/link';
import Image from 'next/image';
import { InteractiveHeroWrapper } from '@/components/effects/InteractiveHeroWrapper';
import { SlideInLeft, SlideInRight, ScrollFadeInUp } from '@/components/ui/ClientAnimation';
import { AnimatedKolam } from '@/components/ui/AnimatedKolam';
import { getSiteSettings } from '@/lib/settings';
import { Shield, Leaf, Factory, Package, Sparkles } from 'lucide-react';
import { CinematicHero25D } from '@/components/effects/CinematicHero25D';
import { HeroButtonsClient } from '@/components/ui/HeroButtonsClient';


export default async function HomePage() {
  const settings = await getSiteSettings();
  const globalDiscount = settings.global_discount || '60';
  const marqueeText = settings.marquee || 'Welcome to Jegajothi Crackers Sivakasi - Direct Factory Price Quality Fireworks! We Give Special Festive Discounts!';

  const displayMarquee = marqueeText.includes('[discount]')
    ? marqueeText.replace(/\[discount\]/g, `${globalDiscount}%`)
    : `${marqueeText} — 🔥 FLAT ${globalDiscount}% DISCOUNT ON ALL ITEMS! 🔥`;

  return (
    <div className="flex flex-col bg-[var(--bg)] -mt-20">

      {/* 3D HERO (RSC-friendly Client Wrapper handles interactive layers) */}
      <InteractiveHeroWrapper>
        {/* Dynamic Announcement Marquee Bar — at the top of hero, below fixed navbar */}
        <div className="relative w-full bg-[rgba(212,175,55,0.15)] border-t border-b border-[rgba(212,175,55,0.25)] py-2 sm:py-2.5 overflow-hidden flex select-none z-30 mt-16 sm:mt-20 lg:mt-24">
          <div className="animate-marquee-horizontal flex gap-6 sm:gap-8 whitespace-nowrap uppercase tracking-[0.12em] sm:tracking-[0.15em] font-black text-[10px] sm:text-xs text-[var(--color-gold)]">
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

        {/* Cinematic 2.5D Background Artwork covering 100% */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
          <CinematicHero25D />
        </div>

        {/* Luxury Cinematic Gradient Overlay (Deep Navy blended) */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none" 
          style={{ 
            background: 'linear-gradient(90deg, rgba(6,9,19,0.88) 0%, rgba(6,9,19,0.72) 28%, rgba(6,9,19,0.42) 52%, rgba(6,9,19,0.15) 75%, rgba(6,9,19,0) 100%)' 
          }}
        />

        {/* Ambient Top & Bottom fade overlays for seamless blending */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none" 
          style={{ 
            background: 'linear-gradient(to top, var(--bg) 0%, transparent 20%, transparent 80%, rgba(6,9,19,0.45) 100%)' 
          }} 
        />

        {/* Hero Content — Floating over background */}
        <div className="relative z-20 flex-1 w-full h-full max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 flex items-end sm:items-center justify-center lg:justify-start py-6 pb-10 sm:py-20 lg:py-24">
          
          {/* Upgraded High-Fidelity Glassmorphic Text Content Panel */}
          <div className="max-w-[600px] w-full glass-card hover:-translate-y-1.5 hover:scale-[1.01] hover:bg-white/55 dark:hover:bg-[rgba(39,18,18,0.55)] hover:border-[var(--color-gold)]/50 hover:shadow-[var(--shadow-gold-lg)] rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-12 mx-auto lg:mx-0 transition-all duration-500 ease-out">
            <SlideInLeft className="w-full">
              {/* JJ Crackers Logo + Branding */}
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-6">
                <div className="relative w-11 h-11 sm:w-16 sm:h-16 lg:w-20 lg:h-20 overflow-hidden flex-shrink-0">
                  <Image 
                    src="/logo/logo.png" 
                    alt="JJ Crackers Logo" 
                    fill 
                    className="object-contain" 
                    sizes="(max-width: 640px) 44px, 80px"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-display text-base sm:text-xl lg:text-2xl font-extrabold text-[var(--color-gold)] tracking-tight leading-none">JJ Crackers</span>
                  <span className="font-display text-xs sm:text-base lg:text-lg font-semibold text-[var(--text)]/90 transition-colors duration-400 leading-tight">Jegajothi Crackers</span>
                  <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold)]/70 font-bold mt-0.5">Since 2015 · Sivakasi</span>
                </div>
              </div>

              {/* Pill Badge */}
              <div 
                className="inline-block text-[10px] sm:text-[0.7rem] uppercase tracking-[0.1em] sm:tracking-[0.15em] px-3 py-1 sm:px-4 sm:py-1.5 rounded-full mb-3 sm:mb-5 font-semibold"
                style={{
                  color: '#D4AF37',
                  border: '1px solid rgba(212, 175, 55, 0.5)',
                  backgroundColor: 'rgba(212, 175, 55, 0.08)'
                }}
              >
                Sivakasi&apos;s Royal Legacy Since 2015
              </div>

              {/* Headline */}
              <h1 className="font-display leading-[1.1] mb-3 sm:mb-5 flex flex-col tracking-tight text-left">
                <span className="text-[var(--text)] font-light text-[1.5rem] sm:text-[3rem] lg:text-[4rem] transition-colors duration-400">Elegance in</span>
                <span className="text-[var(--color-gold)] font-extrabold text-[1.75rem] sm:text-[4rem] lg:text-[5rem] drop-shadow-[0_0_30px_rgba(212,175,55,0.4)]">Every Spark</span>
              </h1>

              {/* Body text */}
              <p className="text-[var(--text-muted)] text-xs sm:text-[1.05rem] leading-[1.5] sm:leading-[1.7] w-full mb-4 sm:mb-6 font-sans transition-colors duration-400">
                Experience the pinnacle of pyrotechnic artistry. Hand-crafted excellence from India&apos;s heartland, delivered to light up your legacy.
              </p>

              <HeroButtonsClient />
            </SlideInLeft>
          </div>
        </div>
      </InteractiveHeroWrapper>

      {/* TRUST BADGES - Ultra Premium */}
      <section className="py-8 sm:py-12 border-y border-[var(--border)]/10 bg-[var(--surface-high)] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-12">
          {[
            { icon: Shield, title: 'Uncompromising Safety', desc: 'Fully Safety Certified' },
            { icon: Leaf, title: 'Eco-Conscious', desc: 'Sustainable Green Crackers' },
            { icon: Factory, title: 'Direct Source', desc: 'Authentic Sivakasi Pricing' },
            { icon: Package, title: 'Premium Logistics', desc: 'White-glove Global Delivery' }
          ].map((b, i) => (
            <ScrollFadeInUp key={i} delay={i * 0.1} className="flex flex-col items-center text-center gap-2 sm:gap-4 group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-[var(--surface)] text-[var(--color-gold)] flex items-center justify-center border border-[var(--border)]/10 group-hover:border-[var(--color-gold)]/50 group-hover:bg-[var(--color-gold)]/5 transition-all duration-500">
                <b.icon size={24} className="sm:w-7 sm:h-7 group-hover:scale-110 transition-transform" />
              </div>
              <div className="space-y-0.5 sm:space-y-1">
                <h3 className="font-bold text-[var(--text)] text-xs sm:text-base tracking-tight">{b.title}</h3>
                <p className="text-[10px] sm:text-xs text-[var(--text-muted)] font-medium">{b.desc}</p>
              </div>
            </ScrollFadeInUp>
          ))}
        </div>
      </section>

      {/* CTA BANNER - Glassmorphism Edition */}
      <section className="py-10 sm:py-20 relative overflow-hidden bg-[var(--bg)] transition-colors duration-400" id="cta">
        <div className="w-full relative z-10 px-4 sm:px-6 md:px-8">
          <ScrollFadeInUp className="relative overflow-hidden w-full glass-premium border border-[var(--color-gold)]/30 shadow-[var(--shadow-gold-lg)]" style={{ borderRadius: '24px' }}>
            {/* Ambient gold glow underlay */}
            <div className="absolute inset-0 bg-radial from-[var(--color-gold)]/10 via-transparent to-transparent opacity-60" />
            <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center opacity-5 mix-blend-overlay scale-125" />
            <div className="absolute -top-20 -left-20 opacity-10"><AnimatedKolam size={400} color="var(--color-gold)" /></div>
            
            <div className="relative z-10 py-12 sm:py-20 text-center flex flex-col items-center justify-center px-6 sm:px-12 lg:px-20">
              <div className="text-[24px] sm:text-[28px] mx-auto mb-4 sm:mb-6 text-center select-none">🎆</div>
              <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-extrabold text-[var(--text)] mb-4 sm:mb-6 leading-[1.1] tracking-tighter drop-shadow-[0_0_20px_rgba(208,160,48,0.2)]">
                Ready to Light Up <br /> Your Next Legacy?
              </h2>
              <p 
                className="mx-auto mb-8 sm:mb-10 text-center font-medium text-[var(--text-muted)]"
                style={{ 
                  fontSize: 'clamp(0.85rem, 2.5vw, 1.05rem)', 
                  maxWidth: '520px', 
                  lineHeight: '1.7' 
                }}
              >
                Browse our master collection or speak with our concierge for bespoke wedding and corporate orders.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <Link href="/products">
                  <button 
                    className="px-8 py-4 bg-gradient-to-r from-[var(--color-gold-light)] via-[var(--color-gold)] to-[var(--color-gold-dark)] hover:shadow-[0_0_25px_rgba(208,160,48,0.3)] text-black font-extrabold text-base sm:text-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-[0.98] cursor-pointer"
                    style={{ borderRadius: '8px' }}
                  >
                    Shop Now <span className="text-xl">→</span>
                  </button>
                </Link>
                <Link href="/contact">
                  <button 
                    className="px-8 py-4 font-bold text-base sm:text-lg transition-all border-2 border-[var(--color-gold)]/60 text-[var(--color-gold)] hover:text-[var(--color-gold-light)] hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)]/5 hover:scale-105 active:scale-[0.98] cursor-pointer"
                    style={{ 
                      borderRadius: '8px' 
                    }}
                  >
                    Contact Us
                  </button>
                </Link>
              </div>
            </div>
          </ScrollFadeInUp>
        </div>
        <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none">
          <AnimatedKolam size={600} color="#D4AF37" />
        </div>
      </section>
    </div>
  );
}
