import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/lib/supabase/types';

export interface EnquiryItem {
  product: Product;
  quantity: number;
}

interface EnquiryState {
  items: EnquiryItem[];
  addItem: (payload: { product: Product; quantity: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getSavings: () => number;
  getItemCount: () => number;
}

export const useEnquiryStore = create<EnquiryState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: ({ product, quantity }) => {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === id ? { ...i, quantity: Math.min(quantity, 100) } : i
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      },

      getSavings: () => {
        return get().items.reduce((sum, item) => sum + ((item.product.mrp || item.product.price) - item.product.price) * item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'jegajothi-enquiry-cart',
    }
  )
);
