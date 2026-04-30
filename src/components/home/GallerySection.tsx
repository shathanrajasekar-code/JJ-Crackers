'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { Badge } from '@/components/ui/Badge';

export function GallerySection() {
  const t = useTranslations('gallery');

  const images = [
    {
      title: t('aerial'),
      tags: [t('shots', { count: 60 }), t('multicolor')],
      emoji: '🎆',
      wide: true,
    },
    {
      title: t('sparklers'),
      tags: ['Premium Quality', 'Long Lasting'],
      emoji: '✨',
      wide: false,
    },
  ];

  return (
    <section className="relative py-20 bg-surface">
      {/* Kolam Pattern */}
      <div className="absolute inset-0 kolam-dots opacity-30" />

      <div className="relative mx-auto max-w-[1400px] px-6">
        <div className="grid lg:grid-cols-12 gap-6">
          {images.map((image, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <motion.div
                className={image.wide ? 'lg:col-span-8' : 'lg:col-span-4'}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              >
                <GlassCard className="overflow-hidden rounded-[40px]">
                  {/* Image Container */}
                  <div className="relative h-[400px] lg:h-[600px] overflow-hidden">
                    {/* Placeholder */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-maroon/10 flex items-center justify-center">
                      <span className="text-8xl">{image.emoji}</span>
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <h3 className="font-display text-2xl font-bold text-text mb-3">
                        {image.title}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {image.tags.map((tag, j) => (
                          <Badge key={j} variant="gold">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
