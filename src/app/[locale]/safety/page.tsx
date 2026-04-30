'use client';

import { useTranslations } from 'next-intl';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { Shield, Flame, Droplet, Eye, Package, Leaf } from 'lucide-react';

const safetyTips = [
  {
    key: 'children',
    icon: Shield,
    emoji: '👦',
    title: 'Children Safety First',
    points: [
      'Never allow children under 12 to handle crackers alone',
      'Keep a responsible adult present at all times',
      'Keep children away from lit crackers by at least 5 meters',
      'Never let children point crackers at other people',
    ],
  },
  {
    key: 'lighting',
    icon: Flame,
    emoji: '🔥',
    title: 'Lighting Instructions',
    points: [
      'Use an agarbatti (incense stick) or sparkler to light',
      'Never use a match or hand directly to light',
      'Light one cracker at a time — never bundles',
      'Stand back immediately after lighting',
    ],
  },
  {
    key: 'water',
    icon: Droplet,
    emoji: '🪣',
    title: 'Keep Water Ready',
    points: [
      'Always keep a bucket of water or fire extinguisher nearby',
      'Have a first aid kit ready at all times',
      'Douse used crackers in water before disposal',
      'Never try to relight a dud cracker',
    ],
  },
  {
    key: 'protection',
    icon: Eye,
    emoji: '👁️',
    title: 'Eye & Ear Protection',
    points: [
      'Wear safety glasses near aerial crackers',
      'Use ear protection for children near loud crackers',
      'Never lean over crackers while lighting',
      'Never look directly into a flower pot while it\'s burning',
    ],
  },
  {
    key: 'storage',
    icon: Package,
    emoji: '📦',
    title: 'Storage Guidelines',
    points: [
      'Store crackers in a cool, dry place away from sunlight',
      'Keep away from electricity, open flames, and heat',
      'Never store near petroleum or flammable materials',
      'Keep out of reach of children when in storage',
    ],
  },
  {
    key: 'eco',
    icon: Leaf,
    emoji: '🌿',
    title: 'Eco-Conscious Celebration',
    points: [
      'Choose green crackers from our eco-friendly range',
      'Follow local government timing guidelines',
      'Dispose of waste responsibly after celebrations',
      'Prefer low-smoke options in residential areas',
    ],
  },
];

export default function SafetyPage() {
  return (
    <section className="min-h-screen bg-bg">
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-14">
            <div className="text-[48px] mb-4">🛡️</div>
            <h1 className="font-display text-[clamp(28px,5vw,56px)] font-black text-gold">
              பாதுகாப்பு வழிகாட்டுதல்கள்
            </h1>
            <p className="text-[18px] text-text-muted mt-3">
              Safety Guidelines for a Joyful & Safe Celebration
            </p>
          </div>
        </ScrollReveal>

        {/* Safety Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-14">
          {safetyTips.map((tip, i) => (
            <ScrollReveal key={tip.key} delay={i * 0.08}>
              <div className="glass rounded-[20px] p-8 h-full border-l-4 border-l-gold">
                <div className="text-[36px] mb-4">{tip.emoji}</div>
                <h3 className="font-display text-[22px] font-extrabold text-gold mb-3">{tip.title}</h3>
                <ul className="text-text-muted text-[14px] leading-[2] pl-5 list-disc">
                  {tip.points.map((point, j) => (
                    <li key={j}>{point}</li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Emergency Contacts */}
        <ScrollReveal>
          <div className="bg-gradient-to-r from-maroon via-maroon-mid to-maroon rounded-[24px] p-10 text-center">
            <h3 className="font-display text-[24px] font-extrabold text-gold mb-6">🚨 Emergency Contacts</h3>
            <div className="flex justify-center flex-wrap gap-8 mb-6">
              <div>
                <div className="text-[28px] font-black text-gold">108</div>
                <div className="text-[13px] text-text-muted">Ambulance</div>
              </div>
              <div>
                <div className="text-[28px] font-black text-gold">101</div>
                <div className="text-[13px] text-text-muted">Fire Service</div>
              </div>
              <div>
                <div className="text-[28px] font-black text-gold">100</div>
                <div className="text-[13px] text-text-muted">Police</div>
              </div>
              <div>
                <div className="text-[20px] font-extrabold text-gold">+91 70923 00252</div>
                <div className="text-[13px] text-text-muted">Jegajothi Support</div>
              </div>
            </div>
            <p className="text-text/70 text-[14px] leading-[1.6] max-w-[500px] mx-auto">
              In case of any cracker-related emergency, please act quickly and call the appropriate services immediately.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
