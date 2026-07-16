'use client';

import React from 'react';
import Link from 'next/link';
import { useHeroStore } from '@/lib/hero-store';

export function HeroButtonsClient() {
  const { setHoveringShopNow, setHoveringCatalogue, triggerClickBurst } = useHeroStore();

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 w-full sm:w-auto z-30 relative">
      <Link 
        href="/products" 
        className="w-full sm:w-auto"
        onMouseEnter={() => setHoveringShopNow(true)}
        onMouseLeave={() => setHoveringShopNow(false)}
        onClick={() => triggerClickBurst()}
      >
        <button 
          id="btn-shop-now"
          className="w-full px-6 py-3 sm:px-9 sm:py-3.5 rounded text-[#0A0A0A] font-bold text-xs sm:text-sm uppercase tracking-wider transition-all text-center cursor-pointer hover:bg-[#FFD700] hover:shadow-[0_8px_24px_rgba(212,175,55,0.35)] active:scale-[0.98]"
          style={{ backgroundColor: '#D4AF37', borderRadius: '4px' }}
        >
          Shop Now
        </button>
      </Link>
      <Link 
        href="/products" 
        className="w-full sm:w-auto"
        onMouseEnter={() => setHoveringCatalogue(true)}
        onMouseLeave={() => setHoveringCatalogue(false)}
      >
        <button 
          id="btn-view-catalogue"
          className="w-full px-6 py-3 sm:px-9 sm:py-3.5 rounded border bg-transparent font-bold text-xs sm:text-sm uppercase tracking-wider transition-all text-center cursor-pointer hover:bg-[rgba(212,175,55,0.08)] active:scale-[0.98]"
          style={{ borderColor: '#D4AF37', color: '#D4AF37', borderRadius: '4px' }}
        >
          View Catalogue
        </button>
      </Link>
    </div>
  );
}
