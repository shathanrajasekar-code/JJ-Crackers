'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Sparkles, ChevronDown, LayoutGrid, List } from 'lucide-react';
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
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [showSort, setShowSort] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mounted, setMounted] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchDebounce, setSearchDebounce] = useState('');
  const [categoriesList, setCategoriesList] = useState(categories);
  const [highlightedCategory, setHighlightedCategory] = useState('all');

  // Keep highlightedCategory in sync when activeCategory changes manually
  useEffect(() => {
    setHighlightedCategory(activeCategory);
  }, [activeCategory]);

  // Scroll-spy: Detect and highlight category section in viewport
  useEffect(() => {
    if (activeCategory !== 'all' || !mounted) return;

    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting);
      if (visible.length > 0) {
        // Find the top-most visible section in the viewport
        visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const topSection = visible[0];
        const catId = topSection.target.id.replace('category-sec-', '');
        setHighlightedCategory(catId);
      }
    }, {
      root: null,
      rootMargin: '-10% 0px -70% 0px', // Focus region in viewport
      threshold: 0
    });

    categoriesList.forEach(cat => {
      if (cat.id === 'all') return;
      const el = document.getElementById(`category-sec-${cat.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [activeCategory, categoriesList, mounted]);

  // Auto-scroll the active category button into view inside the sticky container
  useEffect(() => {
    const btn = document.getElementById(`cat-btn-${highlightedCategory}`);
    if (btn) {
      btn.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, [highlightedCategory]);

  useEffect(() => { 
    setMounted(true); 
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const hasAll = data.some((c: any) => c.id === 'all');
          if (hasAll) {
            setCategoriesList(data);
          } else {
            setCategoriesList([
              { id: 'all', label: 'All Products', emoji: '🎆' },
              ...data.map((c: any) => ({
                id: c.id,
                label: c.label,
                emoji: c.emoji || '✨'
              }))
            ]);
          }
        }
      })
      .catch(err => console.error('Failed to load categories:', err));
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounce(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch all products once on page load
  const fetchAllProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/products?limit=500');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();

      let list: Product[] = [];
      if (Array.isArray(data)) {
        list = data;
      } else {
        list = data.products || [];
      }
      setAllProducts(list);
      setTotalProducts(list.length);
    } catch (err: any) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products. Please try again.');
      setAllProducts([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // Compute filtered and sorted products instantaneously on the client side
  const products = useMemo(() => {
    let filtered = [...allProducts];

    // Category filter
    if (activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }

    // Exclude combos (packs) from giftbox category
    filtered = filtered.filter(p => {
      if (p.category === 'giftbox' && (p.name_en || '').toLowerCase().includes('pack')) {
        return false;
      }
      return true;
    });

    // Search filter
    if (searchDebounce) {
      const q = searchDebounce.toLowerCase();
      filtered = filtered.filter(p => 
        (p.name_en || '').toLowerCase().includes(q) ||
        (p.name_ta || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'name':
        filtered.sort((a, b) => (a.name_en || '').localeCompare(b.name_en || ''));
        break;
      case 'discount':
        filtered.sort((a, b) => (b.discount_percent || 0) - (a.discount_percent || 0));
        break;
    }

    return filtered;
  }, [allProducts, activeCategory, searchDebounce, sortBy]);

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
    <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 md:px-12 py-12">
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

          {/* View Toggle & Sort */}
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-[var(--surface)] border border-[var(--border)] rounded-xl p-1 gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] text-[#1a1400] font-bold shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}
                aria-label="Grid View"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] text-[#1a1400] font-bold shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}
                aria-label="List View"
              >
                <List size={15} />
              </button>
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

      <div className="flex flex-row gap-3 md:gap-8">
        {/* Categories Sidebar */}
        <aside className="w-[75px] md:w-48 lg:w-60 flex-shrink-0">
          <div className="glass-card rounded-xl md:rounded-2xl p-1 md:p-5 sticky top-20 md:top-28 max-h-[80vh] overflow-y-auto scrollbar-none">
            <div className="hidden md:flex items-center gap-1.5 font-bold text-sm mb-4 border-b border-[var(--border)] pb-2.5 text-[var(--text)]">
              <SlidersHorizontal size={14} className="shrink-0" /> Categories
            </div>
            <div className="flex flex-col gap-1">
              {categoriesList.map((cat) => {
                const count = getCategoryCount(cat.id);
                const isActive = highlightedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    id={`cat-btn-${cat.id}`}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`text-center md:text-left px-1 py-2 md:px-3 md:py-2 rounded-lg text-sm transition-all flex flex-col md:flex-row items-center md:justify-between ${
                      isActive
                        ? 'bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] text-[#1a1400] font-bold shadow-sm'
                        : 'text-[var(--text-muted)] hover:bg-[var(--surface-high)] hover:text-[var(--text)]'
                    } min-w-0`}
                  >
                    <span className="flex flex-col md:flex-row items-center gap-1 md:gap-1.5 min-w-0">
                      <span className="text-sm shrink-0">{cat.emoji}</span>
                      <span className="text-[9px] md:text-sm truncate leading-tight md:leading-normal">{cat.label.replace(' Products', '')}</span>
                    </span>
                    {count !== null && count > 0 && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 hidden md:inline-block ${
                        isActive ? 'bg-[#1a1400]/20' : 'bg-[var(--surface-high)]'
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Product Grid Container */}
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
              <button onClick={fetchAllProducts} className="px-4 py-2 rounded-lg bg-[var(--color-gold)] text-[#1a1400] font-bold text-sm mt-2">Retry</button>
            </motion.div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
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
            activeCategory === 'all' ? (
              // E-commerce Grouped Category Sections
              <div className="space-y-16">
                {categoriesList.filter(cat => cat.id !== 'all').map((cat) => {
                  const catProducts = products.filter(p => p.category === cat.id);
                  if (catProducts.length === 0) return null;
                  return (
                    <section key={cat.id} id={`category-sec-${cat.id}`} className="scroll-mt-28">
                      {/* Category Header */}
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-2xl font-bold font-display flex items-center gap-2.5 text-[var(--text)]">
                          <span className="text-2xl">{cat.emoji}</span>
                          <span className="text-gradient-gold text-glow">{cat.label}</span>
                          <span className="text-[10px] font-black bg-[var(--surface-high)] text-[var(--text-muted)] px-2.5 py-0.5 rounded-full border border-[var(--border)] ml-1">
                            {catProducts.length} Products
                          </span>
                        </h2>
                      </div>

                      {/* Category Divider */}
                      <div className="h-px bg-gradient-to-r from-[var(--color-gold)]/40 via-[var(--border)]/30 to-transparent mb-6" />

                      {/* Responsive Grid / List */}
                      <div className={viewMode === 'grid' 
                        ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5" 
                        : "flex flex-col gap-3 md:gap-4"}>
                        {catProducts.map((product) => (
                          <ProductCard key={product.id} product={product} viewMode={viewMode} />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            ) : (
              // Single Category View
              <section>
                {/* Category Header */}
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold font-display flex items-center gap-2.5 text-[var(--text)]">
                    <span className="text-2xl">{categoriesList.find(c => c.id === activeCategory)?.emoji || '🎆'}</span>
                    <span className="text-gradient-gold text-glow">{categoriesList.find(c => c.id === activeCategory)?.label || activeCategory}</span>
                    <span className="text-[10px] font-black bg-[var(--surface-high)] text-[var(--text-muted)] px-2.5 py-0.5 rounded-full border border-[var(--border)] ml-1">
                      {products.length} Products
                    </span>
                  </h2>
                </div>

                {/* Category Divider */}
                <div className="h-px bg-gradient-to-r from-[var(--color-gold)]/40 via-[var(--border)]/30 to-transparent mb-6" />

                {/* Responsive Grid / List */}
                <div className={viewMode === 'grid' 
                  ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5" 
                  : "flex flex-col gap-3 md:gap-4"}>
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} viewMode={viewMode} />
                  ))}
                </div>
              </section>
            )
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
