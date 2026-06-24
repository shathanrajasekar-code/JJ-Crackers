'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowUp, Sparkles, Send } from 'lucide-react';
import { useState } from 'react';

const footerLinks = {
  shop: [
    { label: 'All Products', href: '/products' },
    { label: 'Combo Packs', href: '/combos' },
    { label: 'New Arrivals', href: '/products?category=new' },
    { label: 'Best Sellers', href: '/products?category=best' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Safety Guidelines', href: '/safety' },
    { label: 'Enquiry Cart', href: '/enquiry' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Shipping Info', href: '/contact' },
  ]
};

const socialLinks = [
  { icon: Phone, label: 'Call Us', href: 'tel:+917092300252', color: 'hover:text-[#E4405F] hover:border-[#E4405F]' },
  { icon: MapPin, label: 'Visit Factory', href: 'https://maps.app.goo.gl/pi2T1vsVV5dzjZpv9', color: 'hover:text-[#1877F2] hover:border-[#1877F2]' },
  { icon: Mail, label: 'Email', href: 'mailto:jjcrackersworld@gmail.com', color: 'hover:text-[var(--color-gold)] hover:border-[var(--color-gold)]' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      setSubscribed(true); setEmail('');
    } catch { /* ignore */ }
  };

  return (
    <footer suppressHydrationWarning className="relative bg-[var(--surface)] border-t border-[var(--border)] overflow-hidden" id="footer">
      <div className="gold-divider" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--color-gold)]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-[1400px] mx-auto px-6 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <Link href="/" suppressHydrationWarning className="inline-flex items-center gap-3 mb-6 group">
              <div className="relative w-12 h-12 overflow-hidden flex-shrink-0">
                <Image src="/logo/logo.png" alt="JJ Crackers" fill className="object-contain dark:brightness-[0.9] dark:contrast-[1.1] transition-all duration-300" sizes="48px" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-2xl tracking-tight leading-none">Jegajothi Crackers</span>
                <span className="text-xs text-[var(--color-gold)] font-semibold uppercase tracking-wider mt-0.5">ஜெகஜோதி பட்டாசுகள்</span>
              </div>
            </Link>
            <p className="text-[var(--text-muted)] max-w-sm mb-6 leading-relaxed">
              Sivakasi&apos;s most trusted fireworks manufacturer since 2015. Lighting up millions of homes with uncompromising safety and premium quality.
            </p>

            {/* Removed Newsletter */}

            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a key={social.label} href={social.href} whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] transition-all duration-300 ${social.color}`}
                  aria-label={social.label} target={social.href.startsWith('http') ? '_blank' : undefined}>
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[var(--text)] mb-6 uppercase text-xs tracking-[0.2em] flex items-center gap-2">
              <Sparkles size={12} className="text-[var(--color-gold)]" /> Shop
            </h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}><Link href={link.href} className="text-[var(--text-muted)] hover:text-[var(--color-gold)] transition-colors text-sm inline-flex items-center gap-1 group">
                  <span className="w-0 group-hover:w-2 h-px bg-[var(--color-gold)] transition-all duration-300" />{link.label}
                </Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[var(--text)] mb-6 uppercase text-xs tracking-[0.2em] flex items-center gap-2">
              <Sparkles size={12} className="text-[var(--color-gold)]" /> Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}><Link href={link.href} className="text-[var(--text-muted)] hover:text-[var(--color-gold)] transition-colors text-sm inline-flex items-center gap-1 group">
                  <span className="w-0 group-hover:w-2 h-px bg-[var(--color-gold)] transition-all duration-300" />{link.label}
                </Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[var(--text)] mb-6 uppercase text-xs tracking-[0.2em] flex items-center gap-2">
              <Sparkles size={12} className="text-[var(--color-gold)]" /> Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-[var(--text-muted)]"><MapPin size={16} className="shrink-0 text-[var(--color-gold)] mt-0.5" /><span>1/406, Sivakasi-Vembakottai Main Road, Opp. EB Office, Vembakottai.</span></li>
              <li><a href="tel:+917092300252" className="flex gap-3 text-sm text-[var(--text-muted)] hover:text-[var(--color-gold)]"><Phone size={16} className="shrink-0 text-[var(--color-gold)]" /><span>+91 70923 00252</span></a></li>
              <li><a href="mailto:jjcrackersworld@gmail.com" className="flex gap-3 text-sm text-[var(--text-muted)] hover:text-[var(--color-gold)]"><Mail size={16} className="shrink-0 text-[var(--color-gold)]" /><span>jjcrackersworld@gmail.com</span></a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 py-8 border-y border-[var(--border)] mb-8">
          {['🛡️ 100% Safety Certified', '🌿 Eco-Friendly Options', '🏭 Direct Factory Price', '📦 Secure Packaging'].map((badge) => (
            <span key={badge} className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">{badge}</span>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[var(--text-muted)] text-xs font-medium">
          <p suppressHydrationWarning>© {currentYear} Jegajothi Crackers (JJ Crackers). All rights reserved.</p>
          <div suppressHydrationWarning className="flex items-center gap-8">
            {footerLinks.legal.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-[var(--color-gold)] transition-colors">{link.label}</Link>
            ))}
          </div>
        </div>
      </div>

      <motion.button onClick={scrollToTop} whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[var(--surface-high)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--color-gold)] hover:border-[var(--color-gold)]"
        aria-label="Back to top">
        <ArrowUp size={16} />
      </motion.button>
    </footer>
  );
}
