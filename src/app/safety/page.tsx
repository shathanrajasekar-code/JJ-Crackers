'use client';

import { motion } from 'framer-motion';
import { Phone, AlertTriangle } from 'lucide-react';

const safetyTips = [
  { key: 'children', emoji: '👦', title: 'Children Safety', color: 'hover:border-blue-500/40',
    points: ['Never allow children under 12 to handle crackers alone', 'Keep a responsible adult present', 'Maintain 5+ meters safe distance', 'Never point crackers at others'] },
  { key: 'lighting', emoji: '🔥', title: 'Lighting Tips', color: 'hover:border-orange-500/40',
    points: ['Use incense sticks to light crackers', 'Never use matches directly', 'Light one at a time', 'Retreat after lighting the fuse'] },
  { key: 'water', emoji: '🪣', title: 'Keep Water Ready', color: 'hover:border-cyan-500/40',
    points: ['Keep buckets of water nearby', 'Douse used crackers before disposal', 'Keep first aid kit handy', 'Never relight a dud cracker'] },
  { key: 'protection', emoji: '👓', title: 'Physical Protection', color: 'hover:border-purple-500/40',
    points: ['Wear protective eyewear', 'Use earplugs for loud crackers', 'Never lean over while lighting', 'Protect eyes from sparks'] },
  { key: 'storage', emoji: '📦', title: 'Safe Storage', color: 'hover:border-amber-500/40',
    points: ['Store in cool, dry areas', 'Keep away from heat & flames', 'Store in original packaging', 'Keep from pets & children'] },
  { key: 'eco', emoji: '🌿', title: 'Eco-Conscious', color: 'hover:border-emerald-500/40',
    points: ['Choose Green Cracker range', 'Follow timing restrictions', 'Dispose waste in bins', 'Be mindful of neighbors'] },
];

export default function SafetyPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <div className="text-center mb-20 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/5 text-rose-500 text-xs font-bold mb-6 tracking-[0.2em] uppercase">
          <AlertTriangle size={12} /> Safety Guidelines
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
          A Celebration <br /><span className="text-gradient-gold text-glow">Without Risks</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-lg text-[var(--text-muted)]">
          Your joy is our priority, but safety is our responsibility.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
        {safetyTips.map((tip, i) => (
          <motion.div key={tip.key} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            className={`glass-card rounded-3xl p-7 transition-all ${tip.color}`}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-[var(--surface-high)] flex items-center justify-center text-2xl border border-[var(--border)]">{tip.emoji}</div>
              <div><h3 className="text-lg font-bold font-display">{tip.title}</h3><div className="h-0.5 w-8 bg-[var(--color-gold)] rounded-full mt-1" /></div>
            </div>
            <ul className="space-y-3">
              {tip.points.map((p, j) => (
                <li key={j} className="flex gap-3 text-sm text-[var(--text-muted)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] mt-2 shrink-0" />{p}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="glass-card rounded-3xl p-12 md:p-16 bg-rose-500/5 border-rose-500/20">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold font-display mb-10 flex items-center justify-center gap-3">
            <Phone className="text-rose-500" /> Emergency Hotlines
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[{ num: '108', label: 'Ambulance' }, { num: '101', label: 'Fire Service' }, { num: '100', label: 'Police' }, { num: '70923 00252', label: 'JJ Support' }].map((c, i) => (
              <a key={i} href={`tel:${c.num.replace(/\s/g, '')}`} className="flex flex-col items-center group">
                <div className="text-3xl font-black mb-1 group-hover:text-[var(--color-gold)] transition-colors">{c.num}</div>
                <div className="text-xs uppercase tracking-[0.15em] text-[var(--text-muted)] font-bold">{c.label}</div>
              </a>
            ))}
          </div>
          <p className="mt-12 text-[var(--text-muted)] text-sm max-w-xl mx-auto italic">Stay calm and call the appropriate service immediately in case of emergency.</p>
        </div>
      </motion.div>
    </div>
  );
}
