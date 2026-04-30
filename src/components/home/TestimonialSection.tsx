'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScrollReveal } from '@/components/effects/ScrollReveal';

const testimonials = [
  {
    name: 'Rajesh Kumar',
    city: 'Chennai',
    initial: 'R',
    quote:
      'Best crackers in Sivakasi! The quality is outstanding and delivery was prompt. Will order again next Diwali.',
    rating: 5,
  },
  {
    name: 'Priya Sundar',
    city: 'Coimbatore',
    initial: 'P',
    quote:
      'Amazing variety and the kids loved the special pack. Safety instructions were very helpful. Highly recommend!',
    rating: 5,
  },
  {
    name: 'Karthik Murugan',
    city: 'Madurai',
    initial: 'K',
    quote:
      'Four decades of trust well deserved. The Royal kit was worth every rupee. Jegajothi never disappoints!',
    rating: 5,
  },
];

export function TestimonialSection() {
  const t = useTranslations('testimonials');

  return (
    <section className="relative py-20 bg-maroon">
      {/* Kolam Pattern */}
      <div className="absolute inset-0 kolam-dots opacity-20" />

      <div className="relative mx-auto max-w-[1400px] px-6">
        {/* Heading */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gold mb-4">
              {t('heading')}
            </h2>
            <p className="text-text-muted">
              {t('subtitle')}
            </p>
          </div>
        </ScrollReveal>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <GlassCard className="p-8 rounded-24 h-full">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <span key={j} className="text-gold">⭐</span>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-text-muted italic mb-6 leading-relaxed">
                  &quot;{testimonial.quote}&quot;
                </p>

                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-dim flex items-center justify-center text-bg font-bold text-lg">
                    {testimonial.initial}
                  </div>
                  <div>
                    <p className="font-semibold text-text">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-text-muted">
                      {testimonial.city}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
