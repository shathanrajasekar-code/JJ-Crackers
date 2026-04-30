'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ProductCard } from '@/components/products/ProductCard';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { Link } from '@/i18n/navigation';
import { products, ALL_CATEGORIES } from '@/lib/data/products';

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = activeCategory === 'all' ? products : products.filter((p) => p.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name_en.toLowerCase().includes(q) || (p.excel_category || '').toLowerCase().includes(q));
    }
    return list;
  }, [activeCategory, search]);

  return (
    <section className="min-h-screen bg-bg">
      <div className="mx-auto max-w-[1400px] px-6 py-12">
        {/* Header */}
        <ScrollReveal>
          <div className="mb-12">
            <div className="text-[12px] text-gold uppercase tracking-[0.2em] mb-3">Sivakasi&apos;s Finest</div>
            <h1 className="font-display text-[clamp(32px,6vw,72px)] font-black text-gold leading-[1.1]">
              Royal Tamil<br />Festive Catalog
            </h1>
            <p className="text-[17px] text-text-muted max-w-[600px] leading-[1.7] mt-3">
              Hand-crafted excellence from Sivakasi. Safety-certified brilliance for a celebration that echoes through the night.
            </p>
          </div>
        </ScrollReveal>

        {/* Build Box Banner */}
        <ScrollReveal>
          <Link href="/combos" className="block">
            <div className="glass rounded-[24px] p-9 mb-12 border-2 border-gold/20 cursor-pointer transition-colors duration-300 hover:border-gold/50">
              <div className="flex justify-between items-center flex-wrap gap-5">
                <div>
                  <span className="inline-block bg-gold text-[#342800] px-[14px] py-[3px] rounded-full text-[11px] font-black uppercase tracking-[0.1em] mb-3">
                    🆕 New Experience
                  </span>
                  <h2 className="font-display text-[28px] font-extrabold text-gold mb-2">Build Your Own Royal Box</h2>
                  <p className="text-text-muted text-[15px]">
                    Curate your perfect celebration — select your favorite crackers and we&apos;ll pack them in our signature heritage wooden crate.
                  </p>
                </div>
                <button className="bg-gradient-to-br from-gold to-gold-dim text-[#342800] px-8 py-3.5 rounded-full font-extrabold text-[15px] border-none cursor-pointer whitespace-nowrap transition-transform duration-300 hover:scale-105">
                  Start Customizing ✨
                </button>
              </div>
            </div>
          </Link>
        </ScrollReveal>

        {/* Search & Filter Bar */}
        <ScrollReveal>
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-wrap gap-2.5">
              {ALL_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`px-[18px] py-[8px] rounded-full text-[13px] font-semibold border-[1.5px] cursor-pointer transition-all duration-300 ${
                      isActive
                        ? 'bg-gold text-[#342800] border-gold'
                        : 'border-gold/25 text-text-muted/70 hover:bg-gold hover:text-[#342800] hover:border-gold'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
            
            <div className="w-full md:w-auto max-w-sm">
              <input
                type="text"
                placeholder="Search crackers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-5 py-[10px] rounded-full bg-surface-high/50 border border-gold/20 text-text placeholder-text-muted focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>
          </div>
        </ScrollReveal>

        {/* Product Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product, i) => (
            <ScrollReveal key={product.id} delay={Math.min(i * 0.03, 0.5)}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-text-muted text-lg">No products found</p>
          </div>
        )}
      </div>
    </section>
  );
}
