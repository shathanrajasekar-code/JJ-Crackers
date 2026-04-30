'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface LangToggleProps {
  className?: string;
}

export function LangToggle({ className }: LangToggleProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'ta' : 'en';
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <button
      onClick={toggleLocale}
      className={cn(
        'relative flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors',
        'bg-surface-high/50 border border-gold/20 hover:border-gold/40',
        className
      )}
    >
      <span className={cn('text-sm', locale === 'en' ? 'text-gold' : 'text-text-muted')}>
        ENG
      </span>
      <motion.div
        className="w-px h-4 bg-gold/30"
        layoutId="lang-divider"
      />
      <span className={cn('text-sm', locale === 'ta' ? 'text-gold' : 'text-text-muted')}>
        தமிழ்
      </span>
    </button>
  );
}
