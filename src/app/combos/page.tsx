'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Star, CheckCircle2, ArrowRight, Sparkles, Gift, Eye, MessageCircle, X } from 'lucide-react';
import { useEnquiryStore } from '@/lib/store/enquiryStore';
import { useToast } from '@/components/ui/Toast';
import { openWhatsApp } from '@/lib/whatsapp';
import type { Product, ComboPack } from '@/lib/supabase/types';
import Image from 'next/image';

export default function CombosPage() {
  const { addToast } = useToast();
  const { addItem } = useEnquiryStore();
  const [combos, setCombos] = useState<ComboPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState('');
  const [mounted, setMounted] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState<ComboPack | null>(null);

  const fetchCombos = async () => {
    try {
      const res = await fetch('/api/combos');
      const data = await res.json();
      if (Array.isArray(data)) setCombos(data);
    } catch (err) {
      console.error('Failed to load combos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchCombos();
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[var(--bg)]" />;

  const getDiscountPercent = (combo: ComboPack) => {
    return Math.round(((combo.original_price - combo.offer_price) / combo.original_price) * 100);
  };

  const handleAddToEnquiry = (combo: ComboPack) => {
    const product: Product = {
      id: combo.id, name_en: combo.combo_name, name_ta: '', slug: combo.combo_name.toLowerCase().replace(/\s+/g, '-'),
      category: 'combo', price: combo.offer_price, mrp: combo.original_price,
      discount_percent: getDiscountPercent(combo),
      badge_text: 'Combo Pack', image_url: combo.image_url, images: [], description_en: combo.description,
      description_ta: null, in_stock: true, is_featured: combo.featured, is_eco_friendly: true,
      sort_order: 0, created_at: new Date().toISOString(),
    };
    addItem({ product, quantity: 1 });
    addToast(`🎁 ${combo.combo_name} added to your cart!`, 'success');
  };

  const handleWhatsAppOrder = (combo: ComboPack) => {
    const msg = `Hi Jegajothi Crackers, I want to order the ${combo.combo_name} for ₹${combo.offer_price}.`;
    openWhatsApp(msg);
  };

  const handleBulkQuote = () => {
    const msg = `Hi Jegajothi Crackers! I am interested in a bulk order enquiry. My mobile: ${phone || 'Not provided'}. Please call me back.`;
    openWhatsApp(msg);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-20 max-w-3xl mx-auto">
        <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/5 text-[var(--color-gold)] text-xs font-bold mb-6 tracking-[0.2em] uppercase">
          <Sparkles size={12} /> Curated Value Bundles
        </motion.span>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
          The Premium <br /><span className="text-gradient-gold text-glow">Combo Packs</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-[var(--text-muted)]">
          Specially curated selections of Sivakasi&apos;s finest pyrotechnics with maximum savings.
        </motion.p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card rounded-3xl p-8 h-[600px] animate-pulse flex flex-col">
              <div className="w-full h-10 bg-[var(--surface-high)] rounded-lg mb-4" />
              <div className="w-32 h-6 bg-[var(--surface-high)] rounded-lg mb-8 mx-auto" />
              <div className="w-32 h-32 bg-[var(--surface-high)] rounded-2xl mx-auto mb-8" />
              <div className="space-y-4 flex-1">
                <div className="w-full h-4 bg-[var(--surface-high)] rounded" />
                <div className="w-5/6 h-4 bg-[var(--surface-high)] rounded" />
                <div className="w-4/6 h-4 bg-[var(--surface-high)] rounded" />
              </div>
              <div className="flex gap-4 mt-auto">
                <div className="flex-1 h-12 bg-[var(--surface-high)] rounded-xl" />
                <div className="flex-1 h-12 bg-[var(--surface-high)] rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Combo Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {combos.map((combo, i) => (
            <motion.div key={combo.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className={`glass-card rounded-3xl p-8 flex flex-col h-full relative group ${combo.featured ? 'border-2 border-[var(--color-gold)] shadow-[0_0_40px_rgba(212,175,55,0.15)] scale-[1.02] md:scale-105' : ''}`}
            >
              {combo.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] text-[#1a1400] px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.15em] shadow-xl flex items-center gap-1.5">
                  <Star size={10} fill="currentColor" /> Featured
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold font-display uppercase tracking-wider mb-2">{combo.combo_name}</h3>
                <span className="text-xs font-bold text-[var(--color-gold)] bg-[var(--color-gold)]/10 px-3 py-1 rounded-full border border-[var(--color-gold)]/20">
                  {combo.total_items} ITEMS • {combo.combo_type}
                </span>
              </div>

              <div className="relative mb-8 text-center bg-[var(--surface-high)] w-32 h-32 rounded-2xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110 border border-[var(--border)] overflow-hidden">
                {combo.image_url ? (
                  <Image src={combo.image_url} alt={combo.combo_name} fill className="object-cover" />
                ) : (
                  <Gift size={48} className="text-[var(--color-gold)]" />
                )}
              </div>

              <div className="flex-1 flex flex-col">
                <p className="text-[var(--text-muted)] text-sm mb-6 leading-relaxed text-center">{combo.description}</p>
                
                <div className="flex flex-col items-center gap-1 mb-8 flex-grow">
                  <div className="text-base text-[var(--text-muted)] line-through">₹{combo.original_price.toLocaleString('en-IN')}</div>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-bold text-[var(--color-gold)]">₹{combo.offer_price.toLocaleString('en-IN')}</span>
                    <span className="text-emerald-500 font-bold text-xs bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      {getDiscountPercent(combo)}% OFF
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button onClick={() => setSelectedCombo(combo)} className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-[var(--surface-high)] border border-[var(--border)] hover:border-[var(--color-gold)] transition-colors">
                    <Eye size={16} /> View Details
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => handleAddToEnquiry(combo)} className="py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-[var(--color-gold)] text-[#1a1400] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all">
                      <ShoppingCart size={16} /> Add to Cart
                    </button>
                    <button onClick={() => handleWhatsAppOrder(combo)} className="py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-[#25D366] text-white hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all">
                      <MessageCircle size={16} /> Order
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Bulk Quote CTA */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="glass-card rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-gold)]/5 via-transparent to-[var(--color-gold)]/5 pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <Star className="text-[var(--color-gold)] mx-auto mb-6 w-10 h-10" />
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Want a Custom Bundle?</h2>
          <p className="text-[var(--text-muted)] mb-10 text-sm">Planning a big event or wedding? We offer bulk quotes and custom packs tailored to your needs.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Your Phone Number"
              className="flex-1 bg-[var(--surface-high)] border border-[var(--border)] text-[var(--text)] px-5 py-3.5 rounded-xl outline-none focus:border-[var(--color-gold)] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] transition-all text-sm" />
            <motion.button onClick={handleBulkQuote} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] text-[#1a1400] px-6 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg">
              Get Quote <ArrowRight size={16} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* View Details Modal */}
      <AnimatePresence>
        {selectedCombo && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="glass-card rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col relative overflow-hidden border border-[var(--color-gold)]/30"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-[var(--border)] flex justify-between items-start bg-gradient-to-b from-[var(--color-gold)]/10 to-transparent">
                <div>
                  <h2 className="text-3xl font-bold font-display uppercase text-[var(--color-gold)]">{selectedCombo.combo_name}</h2>
                  <p className="text-sm text-[var(--text-muted)] mt-1">{selectedCombo.total_items} Premium Items • ₹{selectedCombo.offer_price.toLocaleString('en-IN')}</p>
                </div>
                <button onClick={() => setSelectedCombo(null)} className="p-2 bg-[var(--surface-high)] hover:bg-rose-500/20 hover:text-rose-400 rounded-full transition-colors text-[var(--text-muted)]">
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Products List */}
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-[var(--text)]">
                  <Gift size={18} className="text-[var(--color-gold)]" /> What&apos;s Included:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(Array.isArray(selectedCombo.products) ? selectedCombo.products : []).map((product, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface-high)] border border-[var(--border)]">
                      <CheckCircle2 size={16} className="text-[var(--color-gold)] shrink-0" />
                      <span className="text-sm font-medium">{String(product)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-[var(--border)] bg-[var(--surface)] flex gap-4">
                <button onClick={() => { handleAddToEnquiry(selectedCombo); setSelectedCombo(null); }} className="flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] text-[#1a1400] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all">
                  <ShoppingCart size={18} /> Add to Cart
                </button>
                <button onClick={() => handleWhatsAppOrder(selectedCombo)} className="flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-[#25D366] text-white hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all">
                  <MessageCircle size={18} /> WhatsApp Order
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
