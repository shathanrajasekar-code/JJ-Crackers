'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Sparkles, ChevronDown } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product } from '@/lib/supabase/types';

const categories = [
  { id: 'all', label: 'All Products', emoji: '🎆' },
  { id: 'single-sound', label: 'Single Sound', emoji: '💥' },
  { id: 'sparklers', label: 'Sparklers', emoji: '✨' },
  { id: 'chakkars', label: 'Chakkars', emoji: '🌀' },
  { id: 'flowerpots', label: 'Flower Pots', emoji: '🌸' },
  { id: 'rockets', label: 'Rockets', emoji: '🚀' },
  { id: 'bombs', label: 'Bombs', emoji: '💣' },
  { id: 'bijili', label: 'Bijili', emoji: '⚡' },
  { id: 'chain', label: 'Chain Crackers', emoji: '🔗' },
  { id: 'fountains', label: 'Fountains', emoji: '⛲' },
  { id: 'novelties', label: 'Novelties', emoji: '🎭' },
  { id: 'multishots', label: 'Multi Shots', emoji: '🎇' },
  { id: 'giftbox', label: 'Gift Boxes', emoji: '🎁' },
];

const sortOptions = [
  { id: 'default', label: 'Default' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'name', label: 'Name: A to Z' },
  { id: 'discount', label: 'Best Discount' },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [showSort, setShowSort] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchDebounce, setSearchDebounce] = useState('');

  useEffect(() => { setMounted(true); }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounce(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (activeCategory !== 'all') params.set('category', activeCategory);
      if (searchDebounce) params.set('search', searchDebounce);
      if (sortBy !== 'default') params.set('sort', sortBy);
      params.set('limit', '200');

      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();

      // Handle both new paginated response and old array response
      if (Array.isArray(data)) {
        setProducts(data);
        setTotalProducts(data.length);
      } else {
        setProducts(data.products || []);
        setTotalProducts(data.total || 0);
      }
    } catch (err: any) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchDebounce, sortBy]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Category counts from current products (only when showing all)
  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return totalProducts;
    if (activeCategory !== 'all') return null; // Don't show counts when filtered
    return products.filter(p => p.category === catId).length || null;
  };

  if (!mounted) {
    return <div className="min-h-screen bg-[var(--bg)]" />;
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold text-[var(--color-gold)] uppercase tracking-[0.2em] mb-3">
              <Sparkles size={12} /> Premium Collection
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">Our Products</h1>
            <p className="text-[var(--text-muted)] max-w-2xl">
              Browse our premium collection of Sivakasi crackers. Quality and safety guaranteed.
            </p>
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl py-2.5 pl-10 pr-4 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--color-gold)] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] transition-all"
                id="product-search"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text-muted)] hover:border-[var(--color-gold)] transition-colors"
              >
                Sort <ChevronDown size={14} />
              </button>
              <AnimatePresence>
                {showSort && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-2xl z-20 overflow-hidden"
                  >
                    {sortOptions.map((opt) => (
                      <button key={opt.id} onClick={() => { setSortBy(opt.id); setShowSort(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${sortBy === opt.id ? 'bg-[var(--color-gold)]/10 text-[var(--color-gold)] font-bold' : 'text-[var(--text-muted)] hover:bg-[var(--surface-high)]'}`}>
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-60 flex-shrink-0">
          <div className="glass-card rounded-2xl p-5 sticky top-28">
            <div className="flex items-center gap-2 font-bold text-sm mb-5 border-b border-[var(--border)] pb-3 text-[var(--text)]">
              <SlidersHorizontal size={16} /> Categories
            </div>
            <div className="flex flex-col gap-1">
              {categories.map((cat) => {
                const count = getCategoryCount(cat.id);
                return (
                  <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${activeCategory === cat.id
                      ? 'bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] text-[#1a1400] font-bold shadow-sm'
                      : 'text-[var(--text-muted)] hover:bg-[var(--surface-high)] hover:text-[var(--text)]'}`}>
                    <span className="flex items-center gap-2">
                      <span className="text-xs">{cat.emoji}</span> {cat.label}
                    </span>
                    {count !== null && count > 0 && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeCategory === cat.id ? 'bg-[#1a1400]/20' : 'bg-[var(--surface-high)]'}`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Results count */}
          {!loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between mb-6">
              <span className="text-sm text-[var(--text-muted)]">
                Showing <span className="font-bold text-[var(--text)]">{products.length}</span> of <span className="font-bold text-[var(--text)]">{totalProducts}</span> products
              </span>
            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl p-8 text-center mb-6">
              <div className="text-3xl mb-3">⚠️</div>
              <h3 className="text-lg font-bold mb-2 text-rose-400">{error}</h3>
              <button onClick={fetchProducts} className="px-4 py-2 rounded-lg bg-[var(--color-gold)] text-[#1a1400] font-bold text-sm mt-2">Retry</button>
            </motion.div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="glass-card rounded-2xl overflow-hidden">
                  <div className="w-full pt-[100%] bg-[var(--surface-high)] shimmer" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-[var(--surface-high)] rounded-full w-1/3 shimmer" />
                    <div className="h-4 bg-[var(--surface-high)] rounded-full w-2/3 shimmer" />
                    <div className="h-6 bg-[var(--surface-high)] rounded-full w-1/2 shimmer" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.5) }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-2xl p-16 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold font-display mb-2">No products found</h3>
              <p className="text-[var(--text-muted)] text-sm mb-4">Try adjusting your search or filter criteria</p>
              <button onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="px-4 py-2 rounded-lg bg-[var(--color-gold)] text-[#1a1400] font-bold text-sm">
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
