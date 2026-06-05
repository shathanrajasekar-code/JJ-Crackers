'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, Phone, Sparkles } from 'lucide-react';
import { useEnquiryStore } from '@/lib/store/enquiryStore';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/combos', label: 'Combos' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
  { href: '/safety', label: 'Safety' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const itemCount = useEnquiryStore((state) => state.getItemCount());

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => { setIsScrolled(window.scrollY > 20); };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  return (
    <>
      <header suppressHydrationWarning
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-2 bg-[var(--bg)]/70 backdrop-blur-2xl border-b border-[var(--border)]/50 shadow-[0_4px_30px_rgba(0,0,0,0.1)]' : 'py-4 bg-transparent'}`}>
        <div suppressHydrationWarning className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <Link href="/" suppressHydrationWarning className="flex items-center gap-3 group" id="nav-logo">
            <motion.div suppressHydrationWarning whileHover={{ scale: 1.1, rotate: 5 }}
              className="relative w-11 h-11 rounded-full overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.3)] border-2 border-[var(--color-gold)]/30">
              <Image src="/jj-crackers-logo.png" alt="JJ Crackers" fill className="object-contain" sizes="44px" />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold tracking-tight text-[var(--text)] leading-none">Jegajothi</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold)] font-semibold leading-none mt-0.5">Premium Crackers</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1" id="nav-desktop">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-full ${isActive ? 'text-[var(--color-gold)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}>
                  {link.label}
                  {isActive && (
                    <motion.div layoutId="nav-indicator" className="absolute inset-0 bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20 rounded-full -z-10"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }} />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <a href="tel:+917092300252" className="hidden lg:flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--color-gold)] transition-colors">
              <Phone size={14} /><span>+91 70923 00252</span>
            </a>
            <div className="hidden lg:block w-px h-6 bg-[var(--border)]" />
            <div className="hidden sm:block"><ThemeToggle /></div>
            <Link href="/enquiry" id="nav-enquiry-btn">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="relative flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] text-[#1a1400] text-sm font-bold shadow-[0_4px_15px_rgba(212,175,55,0.3)]">
                <ShoppingCart size={16} /><span className="hidden sm:inline">Cart</span>
                {mounted && itemCount > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-[#F43F5E] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                    {itemCount}
                  </motion.span>
                )}
              </motion.button>
            </Link>
            <motion.button whileTap={{ scale: 0.9 }} className="md:hidden p-2 text-[var(--text)] rounded-lg hover:bg-[var(--surface-high)]"
              onClick={() => setMobileMenuOpen(true)} id="nav-mobile-toggle">
              <Menu size={22} />
            </motion.button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99] bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-[400px] z-[100] bg-[var(--bg)] border-l border-[var(--border)] flex flex-col shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                <div className="flex items-center gap-2"><Sparkles size={18} className="text-[var(--color-gold)]" /><span className="font-display font-bold text-lg">Menu</span></div>
                <div className="flex items-center gap-3"><ThemeToggle /><button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-[var(--surface-high)]"><X size={20} /></button></div>
              </div>
              <div className="flex flex-col p-6 gap-2">
                {navLinks.map((link, i) => (
                  <motion.div key={link.href} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                    <Link href={link.href} onClick={() => setMobileMenuOpen(false)}
                      className={`block text-2xl font-display font-bold py-3 px-4 rounded-xl transition-all ${pathname === link.href ? 'text-[var(--color-gold)] bg-[var(--color-gold)]/10' : 'text-[var(--text)] hover:bg-[var(--surface-high)]'}`}>
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="mt-auto p-6 border-t border-[var(--border)] space-y-3">
                <a href="tel:+917092300252" className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-[var(--surface-high)] border border-[var(--border)] font-bold text-sm hover:border-[var(--color-gold)]">
                  <Phone size={16} /> +91 70923 00252
                </a>
                <Link href="/enquiry" onClick={() => setMobileMenuOpen(false)} className="block">
                  <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] text-[#1a1400] font-bold text-sm shadow-lg flex items-center justify-center gap-2">
                    <ShoppingCart size={16} /> View Cart {mounted && itemCount > 0 && <span className="bg-[#1a1400]/20 px-2 py-0.5 rounded-full text-xs">{itemCount}</span>}
                  </button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
