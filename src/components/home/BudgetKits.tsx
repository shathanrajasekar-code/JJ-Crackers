'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { cn } from '@/lib/utils';

const kits = [
  {
    title: 'budgetKits.essential.title',
    description: 'budgetKits.essential.description',
    items: 'budgetKits.essential.items',
    price: 500,
    icon: '🎇',
    variant: 'default' as const,
  },
  {
    title: 'budgetKits.grand.title',
    description: 'budgetKits.grand.description',
    items: 'budgetKits.grand.items',
    price: 2000,
    icon: '✨',
    variant: 'maroon' as const,
    badge: 'budgetKits.grand.badge',
    featured: true,
  },
  {
    title: 'budgetKits.royal.title',
    description: 'budgetKits.royal.description',
    items: 'budgetKits.royal.items',
    price: 5000,
    icon: '👑',
    variant: 'default' as const,
  },
];

export function BudgetKits() {
  const t = useTranslations();

  return (
    <section className="relative py-20 bg-bg">
      {/* Kolam Pattern */}
      <div className="absolute inset-0 kolam-diamond opacity-30" />

      <div className="relative mx-auto max-w-[1400px] px-6">
        {/* Heading */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gold mb-4">
              {t('budgetKits.heading')}
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              {t('budgetKits.subtitle')}
            </p>
          </div>
        </ScrollReveal>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {kits.map((kit, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <GlassCard
                className={cn(
                  'relative p-8 h-full flex flex-col',
                  kit.featured && 'border-2 border-gold/40 shadow-gold'
                )}
                variant={kit.variant}
              >
                {/* Popular Badge */}
                {kit.badge && (
                  <Badge
                    variant="popular"
                    className="absolute top-4 right-4"
                  >
                    {t(kit.badge)}
                  </Badge>
                )}

                {/* Icon */}
                <div className={cn(
                  'w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6',
                  kit.featured ? 'bg-maroon border-2 border-gold' : 'bg-surface-higher'
                )}>
                  {kit.icon}
                </div>

                {/* Title */}
                <h3 className="font-display text-2xl font-bold text-text mb-2">
                  {t(kit.title)}
                </h3>

                {/* Description */}
                <p className="text-text-muted text-sm mb-4">
                  {t(kit.description)}
                </p>

                {/* Items */}
                <p className="text-text-muted text-sm mb-6 flex-grow">
                  {t(kit.items)}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <span className="font-display text-4xl font-black text-gold">
                    ₹{kit.price}
                  </span>
                </div>

                {/* CTA */}
                <Link href="/products" className="group">
                  <span className="inline-flex items-center gap-2 text-gold font-semibold hover:gap-4 transition-all">
                    {t('budgetKits.explore')}
                  </span>
                </Link>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
