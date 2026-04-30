'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { useEnquiryStore } from '@/lib/store/enquiryStore';
import { buildEnquiryMessage, openWhatsApp } from '@/lib/whatsapp';
import { formatPrice } from '@/lib/utils';
import { Link } from '@/i18n/navigation';

export default function EnquiryPage() {
  const items = useEnquiryStore((state) => state.items);
  const getTotal = useEnquiryStore((state) => state.getTotal);
  const getItemCount = useEnquiryStore((state) => state.getItemCount);
  const updateQuantity = useEnquiryStore((state) => state.updateQuantity);
  const removeItem = useEnquiryStore((state) => state.removeItem);
  const clearCart = useEnquiryStore((state) => state.clearCart);

  const total = getTotal();
  const count = getItemCount();

  const handleWhatsAppOrder = () => {
    const message = buildEnquiryMessage(items);
    openWhatsApp(message);
  };

  if (items.length === 0) {
    return (
      <section className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-[64px] mb-4">🧺</div>
          <h3 className="font-display text-[24px] text-gold mb-2">Your enquiry list is empty</h3>
          <p className="text-text-muted mb-6">Add products from our catalog to get started</p>
          <Link href="/products">
            <button className="bg-gradient-to-br from-gold to-gold-dim text-[#342800] px-7 py-3 rounded-full font-extrabold border-none cursor-pointer">
              Browse Products →
            </button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-bg">
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        {/* Header */}
        <ScrollReveal>
          <div className="mb-12">
            <h1 className="font-display text-[clamp(32px,6vw,68px)] font-black text-gold">Enquiry Summary</h1>
            <p className="text-[16px] text-text-muted max-w-[600px] leading-[1.7] mt-3">
              Review your selection and send your enquiry directly via WhatsApp for final pricing and availability.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-[2fr_1fr] gap-10">
          {/* Left Column */}
          <div className="space-y-5">
            {/* Items List */}
            <div className="glass rounded-[20px] overflow-hidden">
              <div className="px-6 py-5 border-b border-gold/10 flex justify-between items-center">
                <span className="text-gold uppercase tracking-[0.12em] text-[13px] font-bold">
                  Selected Items ({count})
                </span>
                <button
                  onClick={clearCart}
                  className="text-text-muted/40 text-[12px] bg-transparent border-none cursor-pointer underline hover:text-text-muted"
                >
                  Clear All
                </button>
              </div>

              <div className="p-4">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-4 p-3.5 rounded-xl mb-2 transition-colors hover:bg-surface-high/60"
                    >
                      {/* Image */}
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-[72px] h-[72px] rounded-[10px] object-cover shrink-0" />
                      ) : (
                        <div className="w-[72px] h-[72px] rounded-[10px] bg-surface-high flex items-center justify-center text-[28px] shrink-0">
                          {item.category === 'sparklers' && '🎇'}
                          {item.category === 'rockets' && '🚀'}
                          {item.category === 'flowerpots' && '🌸'}
                          {item.category === 'chakkars' && '🌀'}
                          {item.category === 'aerial' && '💥'}
                          {(item.category === 'giftbox' || item.category === 'combo') && '🎁'}
                        </div>
                      )}

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="font-display text-[16px] font-extrabold truncate">{item.name}</div>
                        <div className="text-[11px] text-text-muted uppercase tracking-[0.08em]">{item.category}</div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.qty - 1)}
                          className="w-7 h-7 rounded-full border border-gold/30 bg-transparent text-gold cursor-pointer flex items-center justify-center text-[16px]"
                        >
                          −
                        </button>
                        <span className="font-bold min-w-[20px] text-center">{item.qty}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.qty + 1)}
                          className="w-7 h-7 rounded-full border border-gold/30 bg-transparent text-gold cursor-pointer flex items-center justify-center text-[16px]"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right min-w-[80px]">
                        <div className="text-[13px] text-text-muted">{formatPrice(item.price)} × {item.qty}</div>
                        <div className="font-display text-[18px] font-extrabold text-gold">{formatPrice(item.price * item.qty)}</div>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-text-muted/35 bg-transparent border-none cursor-pointer text-[18px] p-1 transition-colors hover:text-red-400"
                      >
                        ✕
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Total Bar */}
            <div className="glass rounded-[20px] px-8 py-6 flex justify-between items-center flex-wrap gap-5">
              <div>
                <div className="text-[12px] text-text-muted uppercase tracking-[0.15em]">Estimated Grand Total</div>
                <div className="font-display text-[52px] font-black text-gold">{formatPrice(total)}</div>
              </div>
              <button
                onClick={handleWhatsAppOrder}
                className="bg-gradient-to-br from-green-wa to-[#128C7E] text-white px-9 py-[18px] rounded-[18px] font-extrabold text-[16px] border-none cursor-pointer flex flex-col items-center gap-1 shadow-[0_10px_30px_rgba(37,211,102,0.3)] transition-transform duration-300 hover:scale-[1.04]"
              >
                <span>⚡ Quick Order in 1 Click</span>
                <span className="text-[11px] font-normal opacity-80">Connect via WhatsApp</span>
              </button>
            </div>

            {/* WhatsApp Preview */}
            <div className="glass rounded-[16px] p-6 border-l-4 border-l-green-wa">
              <div className="text-[12px] text-text-muted uppercase tracking-[0.12em] mb-3">👁️ WhatsApp Preview Message</div>
              <div className="bg-[#0b141a] p-5 rounded-xl font-mono text-[13px] text-[#d1d7db] leading-[1.8]">
                <pre className="whitespace-pre-wrap">{buildEnquiryMessage(items)}</pre>
              </div>
            </div>

            <p className="text-[13px] text-text-muted italic p-4 rounded-xl bg-white/[0.03]">
              ℹ️ Prices are indicative. Festive discounts and final invoice will be shared on WhatsApp. Stock subject to availability.
            </p>
          </div>

          {/* Right Column — Trust & Contact */}
          <div className="flex flex-col gap-5">
            {/* Trust Card */}
            <div className="glass rounded-[20px] p-8">
              <h3 className="font-display text-[20px] font-extrabold text-gold mb-7 border-b border-gold/15 pb-4">
                The Jegajothi Standard
              </h3>
              <div className="flex flex-col gap-6">
                {[
                  { emoji: '🛡️', title: 'Sivakasi Heritage', desc: "40 years of expertise from India's fireworks hub." },
                  { emoji: '✅', title: 'Safety Tested', desc: 'Rigorous multi-point protocols on every product.' },
                  { emoji: '🏭', title: 'Direct Factory Price', desc: 'Zero middleman. Transparent, honest pricing.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gold/10 flex items-center justify-center text-[20px] shrink-0">
                      {item.emoji}
                    </div>
                    <div>
                      <h4 className="font-bold text-[14px] mb-1">{item.title}</h4>
                      <p className="text-[12px] text-text-muted leading-[1.5]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assistance Card */}
            <div className="glass rounded-[20px] p-8 text-center">
              <div className="text-[40px] mb-3">🎧</div>
              <h3 className="font-display text-[18px] font-extrabold mb-2">Need Assistance?</h3>
              <p className="text-[13px] text-text-muted mb-5">Our display consultants will help you curate the perfect show.</p>
              <a href="tel:+917092300252" className="block text-gold text-[20px] font-extrabold no-underline mb-3">
                +91 70923 00252
              </a>
              <button
                onClick={() => openWhatsApp('நமஸ்காரம்! I need help with my cracker order.')}
                className="w-full bg-green-wa/15 border border-green-wa/30 text-green-wa p-2.5 rounded-xl font-bold text-[13px] cursor-pointer"
              >
                Chat on WhatsApp 💬
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
