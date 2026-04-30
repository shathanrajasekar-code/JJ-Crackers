'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Shield, Leaf, Factory, Package } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { Badge } from '@/components/ui/Badge';

export function LegacySection() {
  const t = useTranslations('legacy');

  const features = [
    { icon: Shield, label: t('features.safety') },
    { icon: Leaf, label: t('features.eco') },
    { icon: Factory, label: t('features.factory') },
    { icon: Package, label: t('features.packaging') },
  ];

  return (
    <section className="relative py-20 bg-gradient-to-r from-maroon-deep via-maroon to-bg overflow-hidden">
      {/* Kolam Pattern */}
      <div className="absolute inset-0 kolam-dots opacity-20" />

      <div className="relative mx-auto max-w-[1400px] px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          <ScrollReveal>
            <motion.div
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
            >
              {/* Image Container */}
              <div className="relative aspect-square rounded-[32px] overflow-hidden bg-gradient-to-br from-gold/20 to-maroon/20 border border-gold/20">
                {/* Placeholder Image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-9xl">🪔</span>
                </div>

                {/* Floating Stat Badge */}
                <motion.div
                  className="absolute -bottom-6 -right-6 glass px-6 py-4 rounded-2xl"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="font-display text-2xl font-black text-gold">
                    40+
                  </p>
                  <p className="text-xs text-text-muted uppercase tracking-wider">
                    Years of Tradition
                  </p>
                </motion.div>
              </div>

              {/* Shadow */}
              <div className="absolute -bottom-8 left-8 right-8 h-16 bg-black/40 rounded-full blur-2xl" />
            </motion.div>
          </ScrollReveal>

          {/* Right - Content */}
          <ScrollReveal delay={0.2}>
            {/* Label */}
            <p className="text-gold text-sm uppercase tracking-widest mb-4">
              {t('label')}
            </p>

            {/* Heading */}
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-text mb-6">
              {t('heading')}
            </h2>

            {/* Description */}
            <p className="text-text-muted text-lg leading-relaxed mb-8">
              {t('description')}
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 p-4 rounded-xl bg-surface-high/30 border border-gold/10"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-gold" />
                  </div>
                  <span className="text-sm font-medium text-text">
                    {feature.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
