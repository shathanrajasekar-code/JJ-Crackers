'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { LangToggle } from '@/components/ui/LangToggle';
import { useEnquiryStore } from '@/lib/store/enquiryStore';

interface MobileMenuProps {
  onClose: () => void;
}

export function MobileMenu({ onClose }: MobileMenuProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const itemCount = useEnquiryStore((state) => state.getItemCount());

  const navLinks = [
    { href: '/', label: t('home'), icon: '🏠' },
    { href: '/products', label: t('products'), icon: '🎆' },
    { href: '/combos', label: t('combos'), icon: '🎁' },
    { href: '/safety', label: t('safety'), icon: '🛡️' },
    { href: '/enquiry', label: `${t('enquiry')} (${itemCount})`, icon: '🛒' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-bg border-l border-gold/20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-gold/12">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎆</span>
              <span className="font-display text-lg font-bold text-gold">
                Jegajothi
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gold hover:bg-gold/10 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-4 px-4 py-4 rounded-xl transition-all',
                  isActive(link.href)
                    ? 'bg-gold/20 border border-gold/40 text-gold'
                    : 'text-text-muted hover:bg-surface-high/50 hover:text-text'
                )}
              >
                <span className="text-xl">{link.icon}</span>
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-high/50 border border-gold/20">
              <span className="text-text-muted text-sm">Language</span>
              <LangToggle />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
