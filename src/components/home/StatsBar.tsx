'use client';

import { useTranslations } from 'next-intl';
import { motion, useInView, useMotionValue, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface CountUpProps {
  value: number;
  suffix?: string;
}

function CountUp({ value, suffix = '' }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  if (isInView) {
    count.set(value);
  }

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export function StatsBar() {
  const t = useTranslations('stats');

  const stats = [
    { value: 40, suffix: '+', label: t('years') },
    { value: 500, suffix: '+', label: t('products') },
    { value: 10, suffix: 'K+', label: t('families') },
    { value: 100, suffix: '%', label: t('certified') },
  ];

  return (
    <section className="relative bg-surface border-y border-gold/8 py-12">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="font-display text-4xl sm:text-5xl font-black text-shimmer mb-2"
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 + 0.2, type: 'spring' }}
              >
                <CountUp value={stat.value} suffix={stat.suffix} />
              </motion.div>
              <p className="text-xs uppercase tracking-widest text-text-muted">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
