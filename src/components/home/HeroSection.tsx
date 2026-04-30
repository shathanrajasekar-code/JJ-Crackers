'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Shield, Truck, Leaf, Factory } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { GoldButton } from '@/components/ui/GoldButton';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { FireParticles } from '@/components/effects/FireParticles';

export function HeroSection() {
  const t = useTranslations('hero');
  const trust = useTranslations('trust');

  const trustBadges = [
    { icon: Shield, label: trust('safety') },
    { icon: Factory, label: trust('factory') },
    { icon: Truck, label: trust('delivery') },
    { icon: Leaf, label: trust('eco') },
  ];

  return (
    <section className="relative -mt-[106px] pt-[106px] min-h-screen flex items-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-maroon via-bg to-bg" />

      {/* Kolam Pattern Overlay */}
      <div className="absolute inset-0 kolam-dots opacity-20" />

      {/* Fire Particles */}
      <FireParticles />

      {/* Decorative Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-tertiary/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-[1400px] px-6 py-20">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column - Mascot */}
          <motion.div
            className="lg:col-span-5 relative"
            animate={{ y: [-18, 18, -18] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Glow Ring */}
            <div className="absolute inset-0 bg-gradient-radial from-gold/20 to-transparent rounded-full blur-2xl" />

            {/* Mascot Placeholder */}
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-gold/30 to-maroon/30 rounded-full blur-xl" />
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-gold to-gold-dim flex items-center justify-center overflow-hidden">
                <span className="text-9xl">🎆</span>
              </div>

              {/* Floating Sparkles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-gold-light rounded-full"
                  style={{
                    top: `${20 + i * 30}%`,
                    left: `${70 - i * 20}%`,
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                />
              ))}
            </div>

            {/* Drop Shadow */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/30 rounded-full blur-xl" />
          </motion.div>

          {/* Right Column - Content */}
          <div className="lg:col-span-7">
            {/* Trust Badge */}
            <ScrollReveal delay={0.1}>
              <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/10 mb-6">
                <motion.div
                  className="w-2 h-2 bg-green-wa rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-gold text-sm font-medium">
                  {t('trustBadge')}
                </span>
              </motion.div>
            </ScrollReveal>

            {/* Heading */}
            <ScrollReveal delay={0.2}>
              <motion.h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-gold mb-6 leading-tight">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {t('heading')}
                </motion.span>
                <br />
                <motion.span
                  className="text-shimmer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  — {t('brand')}
                </motion.span>
              </motion.h1>
            </ScrollReveal>

            {/* Subtitle */}
            <ScrollReveal delay={0.3}>
              <p className="text-lg text-text-muted mb-8 leading-relaxed max-w-2xl">
                {t('subtitle')}
              </p>
            </ScrollReveal>

            {/* CTA Buttons */}
            <ScrollReveal delay={0.4}>
              <div className="flex flex-wrap gap-4 mb-12">
                <Link href="/products">
                  <GoldButton size="lg">{t('ctaProducts')}</GoldButton>
                </Link>
                <GoldButton
                  size="lg"
                  variant="outlined"
                  onClick={() => {
                    const msg = encodeURIComponent(
                      'நமஸ்காரம் Jegajothi Crackers! 🙏 I would like to know more about your products.'
                    );
                    window.open(`https://wa.me/919876543210?text=${msg}`, '_blank');
                  }}
                >
                  {t('ctaWhatsapp')}
                </GoldButton>
              </div>
            </ScrollReveal>

            {/* Trust Icons */}
            <ScrollReveal delay={0.5}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {trustBadges.map((badge, i) => (
                  <motion.div
                    key={i}
                    className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-surface-high/30 border border-gold/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <badge.icon className="w-6 h-6 text-gold" />
                    <span className="text-xs text-text-muted font-medium">
                      {badge.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0 -mb-px">
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="w-full h-20 text-surface"
        >
          <path
            d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
}
