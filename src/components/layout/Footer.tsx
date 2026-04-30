'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const t = useTranslations('footer');

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/combos', label: 'Combo Packs' },
    { href: '/safety', label: 'Safety Tips' },
    { href: '/enquiry', label: 'My Enquiry' },
  ];

  const socialLinks = [
    { label: 'FB', href: '#', name: 'Facebook' },
    { label: 'IG', href: '#', name: 'Instagram' },
    { label: 'TW', href: '#', name: 'Twitter' },
  ];

  return (
    <footer className="relative bg-maroon border-t border-gold/12">
      {/* Kolam pattern background */}
      <div className="absolute inset-0 kolam-dots opacity-30" />

      <div className="relative mx-auto max-w-[1400px] px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-gold-dim">
                <span className="text-2xl">🎆</span>
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-gold">
                  Jegajothi Crackers
                </h3>
                <p className="text-xs text-text-muted">
                  Since 1984 • Sivakasi
                </p>
              </div>
            </div>
            <p className="text-text-muted mb-6 max-w-md">
              {t('tagline')}
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="p-2 rounded-lg bg-surface-high/50 border border-gold/20 hover:border-gold/40 transition-colors text-gold font-bold text-xs"
                  aria-label={social.name}
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-bold text-gold mb-4">
              {t('quickLinks')}
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-muted hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-bold text-gold mb-4">
              {t('contact')}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-text-muted">
                <MapPin size={18} className="text-gold" />
                <span>{t('address')}</span>
              </li>
              <li className="flex items-center gap-3 text-text-muted">
                <Phone size={18} className="text-gold" />
                <a href="tel:+917092300252" className="hover:text-gold transition-colors">
                  +91 70923 00252
                </a>
              </li>
              <li className="flex items-center gap-3 text-text-muted">
                <Mail size={18} className="text-gold" />
                <a href="mailto:jjcrackersworld@gmail.com" className="hover:text-gold transition-colors">
                  jjcrackersworld@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gold/12 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-sm">
            {t('copyright').replace('{year}', String(currentYear))}
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-text-muted hover:text-gold text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-text-muted hover:text-gold text-sm transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
