'use client';

import { motion } from 'framer-motion';
import { Plus, Minus, ShoppingCart, Leaf, Check } from 'lucide-react';
import { useState } from 'react';
import { useEnquiryStore } from '@/lib/store/enquiryStore';
import type { Product } from '@/lib/supabase/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useEnquiryStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    addItem({ product, quantity });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
    setQuantity(1);
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card rounded-2xl overflow-hidden flex flex-col group relative"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.badge_text && (
          <span className="bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] text-[#1a1400] text-[10px] font-black px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
            {product.badge_text}
          </span>
        )}
        {product.is_eco_friendly && (
          <span className="bg-emerald-500/20 text-emerald-500 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm border border-emerald-500/20">
            <Leaf size={10} /> Eco
          </span>
        )}
      </div>

      {/* Discount badge */}
      {product.discount_percent && product.discount_percent > 0 && (!product.badge_text || !product.badge_text.includes(`${product.discount_percent}%`)) && (
        <div className="absolute top-3 right-3 z-10 bg-[#F43F5E] text-white text-[10px] font-black px-2 py-1 rounded-full shadow-md">
          {product.discount_percent}% OFF
        </div>
      )}

      {/* Image */}
      <div className="relative w-full pt-[100%] bg-[var(--surface-high)] overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name_en}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center shimmer">
            <span className="text-5xl opacity-30">🎇</span>
          </div>
        )}
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-[10px] text-[var(--color-gold)] font-bold mb-1 uppercase tracking-[0.15em]">
          {product.category}
        </div>
        <h3 className="text-sm font-bold text-[var(--text)] mb-3 leading-snug line-clamp-2 group-hover:text-[var(--color-gold)] transition-colors">
          {product.name_en}
        </h3>

        <div className="mt-auto">
          <div className="flex items-end gap-2 mb-3">
            <span className="text-xl font-bold text-[var(--text)]">₹{product.price}</span>
            <span className="text-xs text-[var(--text-muted)] line-through mb-0.5">₹{product.mrp}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quantity Selector */}
            <div className="flex items-center bg-[var(--surface-high)] rounded-lg border border-[var(--border)] overflow-hidden h-9">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 flex justify-center items-center text-[var(--text-muted)] hover:text-[var(--text)] transition-colors h-full hover:bg-[var(--surface-highest)]"
              >
                <Minus size={12} />
              </button>
              <div className="w-7 text-center text-xs font-bold text-[var(--text)] h-full flex items-center justify-center border-x border-[var(--border)]">
                {quantity}
              </div>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 flex justify-center items-center text-[var(--text-muted)] hover:text-[var(--text)] transition-colors h-full hover:bg-[var(--surface-highest)]"
              >
                <Plus size={12} />
              </button>
            </div>

            {/* Add Button */}
            <motion.button
              onClick={handleAdd}
              whileTap={{ scale: 0.95 }}
              className={`flex-1 h-9 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-all duration-300 ${
                isAdded
                  ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] text-[#1a1400] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]'
              }`}
            >
              {isAdded ? (
                <><Check size={14} /> Added</>
              ) : (
                <><ShoppingCart size={14} /> Add</>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
