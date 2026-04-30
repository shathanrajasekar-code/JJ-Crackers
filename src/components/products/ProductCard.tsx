'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useEnquiryStore } from '@/lib/store/enquiryStore';
import { useToast } from '@/components/ui/Toast';
import { FireworkBurst } from '@/components/effects/FireworkBurst';
import { formatPrice, calculateDiscount } from '@/lib/utils';

interface Product {
  id: string;
  name_en: string;
  name_ta: string;
  slug: string;
  category: string;
  price: number;
  mrp: number;
  discount_percent: number | null;
  badge_text: string | null;
  image_url: string | null;
  in_stock: boolean;
  is_featured: boolean;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations('products');
  const locale = useLocale();
  const { addItem } = useEnquiryStore();
  const { addToast } = useToast();
  const [burst, setBurst] = useState<{ x: number; y: number } | null>(null);

  const handleAddToEnquiry = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.currentTarget.getBoundingClientRect();
    setBurst({
      x: e.clientX,
      y: e.clientY,
    });

    addItem({
      id: product.id,
      name: product.name_en,
      name_ta: product.name_ta,
      price: product.price,
      mrp: product.mrp,
      image_url: product.image_url,
      category: product.category,
    });

    addToast(`${product.name_en} added to enquiry!`, 'success');

    setTimeout(() => setBurst(null), 850);
  };

  const discount = calculateDiscount(product.price, product.mrp);

  return (
    <div className="glass group rounded-[24px] overflow-hidden cursor-pointer transition-transform duration-500 hover:-translate-y-3 hover:shadow-[0_30px_60px_-15px_rgba(233,195,73,0.25)] flex flex-col h-full">
      {/* Image Zone */}
      <div className="relative h-[280px] overflow-hidden shrink-0 bg-surface-high">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name_en}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center transition-transform duration-700 group-hover:scale-110">
            <span className="text-6xl">
              {product.category === 'sparklers' && '🎇'}
              {product.category === 'rockets' && '🚀'}
              {product.category === 'flowerpots' && '🌸'}
              {product.category === 'chakkars' && '🌀'}
              {product.category === 'aerial' && '💥'}
              {product.category === 'giftbox' && '🎁'}
              {!['sparklers', 'rockets', 'flowerpots', 'chakkars', 'aerial', 'giftbox'].includes(product.category) && '🎇'}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />
        
        {product.badge_text && (
          <div className="absolute top-[14px] left-[14px] bg-bg/80 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-extrabold text-gold border border-gold/20">
            {product.badge_text}
          </div>
        )}
        
        {discount > 0 && (
          <div className="absolute top-[14px] right-[14px] bg-maroon text-gold px-2.5 py-1 rounded-full text-[10px] font-black">
            {discount}% OFF
          </div>
        )}

        {/* Firework Burst Effect */}
        {burst && (
          <FireworkBurst
            x={burst.x}
            y={burst.y}
            onComplete={() => setBurst(null)}
          />
        )}
      </div>

      {/* Content Zone */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-display text-[20px] font-extrabold mb-1 leading-tight text-text">
          {product.name_en}
        </h3>
        
        {locale === 'ta' && (
          <div className="text-[12px] text-text-muted mb-3.5">
            {product.name_ta}
          </div>
        )}
        {!locale || locale === 'en' && (
          <div className="text-[12px] text-text-muted mb-3.5 opacity-0">
            -
          </div>
        )}

        <div className="flex items-baseline gap-2.5 mb-5 mt-auto">
          <span className="font-display text-[28px] font-black text-gold">
            {formatPrice(product.price)}
          </span>
          {product.mrp > product.price && (
            <span className="text-[13px] text-text-muted/60 line-through">
              {formatPrice(product.mrp)}
            </span>
          )}
        </div>

        {product.in_stock ? (
          <button
            onClick={handleAddToEnquiry}
            className="w-full bg-gradient-to-br from-gold to-gold-dim text-[#342800] p-3.5 rounded-full font-extrabold text-[14px] border-none cursor-pointer flex items-center justify-center gap-2 transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(233,195,73,0.4)]"
          >
            🛒 {t('addToEnquiry')}
          </button>
        ) : (
          <button
            disabled
            className="w-full bg-surface-highest text-text-muted p-3.5 rounded-full font-extrabold text-[14px] border-none cursor-not-allowed flex items-center justify-center gap-2"
          >
            {t('outOfStock')}
          </button>
        )}
      </div>
    </div>
  );
}
