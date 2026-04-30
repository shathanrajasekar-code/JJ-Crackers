'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';

const announcements = [
  '🎆 DIWALI SUPER SALE — UP TO 70% OFF',
  '🪔 FREE DELIVERY ON ORDERS ABOVE ₹2000',
  '✨ SIVAKASI DIRECT FACTORY PRICES',
  '🎇 NEW: GALAXY BURST SERIES NOW IN STOCK',
  '🔥 BULK ORDERS WELCOME — CALL +91 70923 00252',
];

export const AnnouncementTicker = memo(function AnnouncementTicker() {
  // Duplicate announcements for seamless loop
  const items = [...announcements, ...announcements];

  return (
    <div className="fixed top-0 left-0 right-0 z-40 h-9 overflow-hidden bg-gradient-to-r from-maroon via-maroon-mid to-maroon">
      <motion.div
        className="flex items-center h-full whitespace-nowrap"
        animate={{ x: '-50%' }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {items.map((text, i) => (
          <span
            key={i}
            className="inline-flex items-center h-full px-8 text-gold text-xs font-semibold tracking-widest uppercase"
          >
            {text}
            {i < items.length - 1 && (
              <span className="ml-8 text-gold/40">|</span>
            )}
          </span>
        ))}
      </motion.div>
    </div>
  );
});
