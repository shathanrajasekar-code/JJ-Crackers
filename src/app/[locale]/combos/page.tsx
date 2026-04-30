'use client';

import { useState } from 'react';

import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { useEnquiryStore } from '@/lib/store/enquiryStore';
import { useToast } from '@/components/ui/Toast';
import { openWhatsApp } from '@/lib/whatsapp';

const combos = [
  {
    id: 'kids',
    name: 'Kids Special Pack',
    nameTa: 'குழந்தைகள் சிறப்பு பேக்',
    emoji: '🎈',
    desc: 'Low-smoke, low-noise, maximum visual delight with a rainbow of colors. Perfect for the little ones.',
    items: ['20 Magic Sparklers (Multi-color)', '10 Flower Pots (Mini Glow)', '5 Spinning Ground Chakras'],
    price: 699,
    badge1: 'Safety First',
    badge2: 'Sivakasi Original',
    popular: false,
  },
  {
    id: 'family',
    name: 'Family Celebration Box',
    nameTa: 'குடும்ப கொண்டாட்ட பெட்டி',
    emoji: '👨‍👩‍👧‍👦',
    desc: 'The perfect balance for a memorable evening. A curated mix of floor wonders and sky-high bursts.',
    items: ['12 Aerial Comets (Multi-effect)', '15 Mega Flower Pots', '8 Deluxe Ground Wheels'],
    price: 2000,
    badge1: '⭐ Most Popular',
    badge2: 'Family Choice',
    popular: true,
  },
  {
    id: 'royal',
    name: 'Premium Royal Grandeur',
    nameTa: 'பிரீமியம் ராஜ தீபாவளி',
    emoji: '👑',
    desc: "Command the sky with Sivakasi's elite collection. Massive shells and professional-grade multi-shots.",
    items: ['5 Massive Rocket Launchers', '2 Multi-Shot 50-Flower Pots', '10 Premium Gold Crackers'],
    price: 5000,
    badge1: '👑 Luxury Tier',
    badge2: 'Limited Edition',
    popular: false,
  },
];

export default function CombosPage() {
  const { addToast } = useToast();
  const { addItem } = useEnquiryStore();
  const [phone, setPhone] = useState('');

  const handleAddToEnquiry = (combo: typeof combos[0]) => {
    addItem({
      id: `combo-${combo.id}`,
      name: combo.name,
      name_ta: combo.nameTa,
      price: combo.price,
      mrp: combo.price * 1.5,
      image_url: null,
      category: 'combo',
    });
    addToast(`🎁 ${combo.name} added!`, 'success');
  };

  const handleBulkQuote = () => {
    const msg = `நமஸ்காரம் Jegajothi Crackers! I am interested in bulk order enquiry. My mobile: ${phone || 'Not provided'}. Please call me. Thank you!`;
    openWhatsApp(msg);
  };

  return (
    <section className="min-h-screen bg-bg">
      <div className="mx-auto max-w-[1400px] px-6 py-12">
        {/* Header */}
        <ScrollReveal>
          <div className="mb-16">
            <h1 className="font-display text-[clamp(40px,6vw,80px)] font-black leading-[1.1] mb-4">
              The Royal <span className="text-tertiary">Tamil Bundles</span>
            </h1>
            <p className="text-[18px] text-text-muted max-w-[600px] leading-[1.7]">
              Curated selections of Sivakasi&apos;s finest pyrotechnics. From the gentle glow of family evenings to the thunderous grandeur of royal festivities.
            </p>

            {/* Mascot Endorsement */}
            <div className="glass inline-flex items-center gap-5 px-7 py-5 rounded-[20px] mt-8 border-l-4 border-l-gold">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-gold-dim flex items-center justify-center text-3xl shrink-0">
                🎆
              </div>
              <div>
                <p className="text-tertiary italic font-display text-[16px]">&quot;ஜெகஜோதியின் சிறந்த தேர்வு!&quot;</p>
                <p className="text-text-muted text-[11px] uppercase tracking-[0.12em] mt-1">Heritage Quality Guaranteed</p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Combo Cards */}
        <div className="grid md:grid-cols-3 gap-7 mb-20">
          {combos.map((combo, i) => (
            <ScrollReveal key={combo.id} delay={i * 0.1}>
              <div
                className={`glass rounded-[28px] overflow-hidden flex flex-col h-full transition-transform duration-500 hover:-translate-y-3 hover:shadow-[0_20px_60px_rgba(233,195,73,0.15)] ${
                  combo.popular ? 'border-2 border-gold/40 shadow-[0_20px_60px_rgba(233,195,73,0.15)]' : ''
                }`}
              >
                {/* Image Area */}
                <div className="relative h-[320px] overflow-hidden shrink-0 bg-gradient-to-br from-gold/10 to-maroon/10">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-8xl">{combo.emoji}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.08em] ${
                      combo.popular ? 'bg-gold text-[#342800]' : 'bg-maroon text-gold'
                    }`}>
                      {combo.badge1}
                    </span>
                    <span className="bg-bg/80 text-gold px-3 py-1 rounded-full text-[10px] font-extrabold border border-gold/20">
                      {combo.badge2}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-7 flex-1 flex flex-col">
                  <h3 className="font-display text-[24px] font-black text-gold mb-1">{combo.name}</h3>
                  <p className="text-[13px] text-text-muted mb-4">{combo.nameTa}</p>
                  <p className="text-[14px] text-text-muted/80 leading-[1.6] mb-5">{combo.desc}</p>

                  <div className="flex-1 mb-6">
                    {combo.items.map((item, j) => (
                      <div key={j} className="flex items-center gap-2.5 mb-2.5">
                        <span className="text-gold text-[14px]">✅</span>
                        <span className="text-[14px] text-text-muted">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <span className="font-display text-[36px] font-black text-gold">₹{combo.price.toLocaleString('en-IN')}</span>
                  </div>

                  <button
                    onClick={() => handleAddToEnquiry(combo)}
                    className={`w-full p-4 rounded-[14px] font-extrabold text-[15px] border-2 cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 ${
                      combo.popular
                        ? 'bg-gradient-to-br from-gold to-gold-dim text-[#342800] border-transparent hover:shadow-[0_0_30px_rgba(233,195,73,0.4)]'
                        : 'bg-transparent text-gold border-gold/30 hover:bg-gradient-to-br hover:from-gold hover:to-gold-dim hover:text-[#342800] hover:border-transparent'
                    }`}
                  >
                    🛒 Add to Enquiry
                  </button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA Section */}
        <ScrollReveal>
          <div className="bg-gradient-to-r from-maroon via-maroon-mid to-maroon rounded-[32px] p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 kolam-dots opacity-10" />
            <div className="relative">
              <h2 className="font-display text-[clamp(24px,4vw,44px)] font-black text-gold mb-4">
                Bring Home the Royal Celebration
              </h2>
              <p className="text-[16px] text-text/80 max-w-[600px] mx-auto mb-10 leading-[1.7]">
                Enquire now for bulk orders and exclusive festival discounts on Sivakasi&apos;s most prestigious collections.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="📱 Your mobile number"
                  className="bg-white/10 border border-gold/30 text-text px-6 py-3.5 rounded-[14px] text-[15px] outline-none w-[280px] placeholder:text-text-muted focus:border-gold/60 transition-colors"
                />
                <button
                  onClick={handleBulkQuote}
                  className="bg-gradient-to-br from-gold to-gold-dim text-[#342800] px-9 py-3.5 rounded-[14px] font-extrabold text-[15px] border-none cursor-pointer transition-transform duration-300 hover:scale-105"
                >
                  Get a Quote 🎆
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
