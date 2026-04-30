'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, ShoppingCart } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { LangToggle } from '@/components/ui/LangToggle';
import { useEnquiryStore } from '@/lib/store/enquiryStore';
import { MobileMenu } from './MobileMenu';

export function Navbar() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const itemCount = useEnquiryStore((state) => state.getItemCount());
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/products', label: t('products') },
    { href: '/combos', label: t('combos') },
    { href: '/safety', label: t('safety') },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Navbar — sits below the 36px ticker */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          'fixed left-0 right-0 z-30 transition-all duration-300',
          'top-9', // below the 36px ticker
          isScrolled
            ? 'bg-bg/95 backdrop-blur-xl shadow-lg shadow-black/40 border-b border-gold/10'
            : 'bg-bg/90 backdrop-blur-md border-b border-gold/10'
        )}
      >
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="flex h-[70px] items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-gold-dim">
                <span className="text-xl">🎆</span>
              </div>
              <div>
                <p className="font-display text-base font-bold text-gold leading-tight">
                  Jegajothi Crackers
                </p>
                <p className="text-[10px] text-text-muted">Since 1984 • Sivakasi</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm font-medium transition-colors relative py-1',
                    isActive(link.href)
                      ? 'text-gold'
                      : 'text-text-muted hover:text-text'
                  )}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="hidden md:flex items-center gap-3">
              <LangToggle />
              <Link
                href="/enquiry"
                className="relative bg-gradient-to-br from-gold to-gold-dim text-[#342800] px-5 py-2 rounded-full font-extrabold text-[13px] transition-transform duration-300 hover:scale-105"
              >
                My Enquiry
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-black">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-gold hover:bg-gold/10 rounded-lg transition-colors"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu onClose={() => setMobileMenuOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
