/**
 * JJ CRACKERS — Combo Packs Seed Script
 * 
 * This script inserts the initial 3 premium combo packs into the Supabase database.
 * 
 * RUN: node supabase/seed-combos.js
 */

const { createClient } = require('@supabase/supabase-js');

// --- Config ---
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gllzlcgykefdmqhcfxjr.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_publishable_m8kOsJiJ_Yx80wQgg92mnA_lX5i1FRS'; // Note: using publishable key for now since it has anon access and RLS allows insert

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const combos = [
  {
    combo_name: "Children Pack",
    total_items: 37,
    original_price: 7500,
    offer_price: 3000,
    combo_type: "Special Brown Box",
    description: "Low-smoke, low-noise, maximum visual delight. Perfect for the little ones.",
    products: [
      "2 3/4 KURUVI", "GROUND CHAKKAR BIG (10 PCS)", "GROUND CHAKKAR SPECIAL", "FLOWER POT BIG", 
      "FLOWER POT COLOR KOTI", "SELFIE STICK", "1 1/2 TWINKLING STAR", "4 TWINKLING STAR", 
      "STRIPPED BIJILI - 100 PCS", "POGO WHITE & GOLD", "PHOTO FLASH", "BUTTERFLY", "BAMBARAM", 
      "SNAKE TABLET", "CHIT PUT BIG - KRISHNA", "TIN BEER", "MONEY BANK", "SIREN", "HELICOPTER", 
      "COLOUR RAIN", "PEACOCK FEATHER", "ANGRY BIRD - RED", "GOLDEN GLOBE", "MAGIC PEACOCK", "TWIX", 
      "LOTUS", "1 CHOTTA", "10 CM COLOUR", "10 CM RED", "15 CM ELECTRIC", "15 CM GREEN", "30 CM ELECTRIC", 
      "30 CM COLOUR", "POKE MAN", "HYDRO GREEN", "3 1/2 LAKSHMI", "NAYAGARA FALLS"
    ],
    featured: true
  },
  {
    combo_name: "Family Pack",
    total_items: 38,
    original_price: 10000,
    offer_price: 4000,
    combo_type: "Special Brown Box",
    description: "The perfect balance for a memorable evening. A curated mix of floor wonders and sky-high bursts.",
    products: [
      "4 LAKSHMI DELUXE", "BHAKUBALI CATEGORY", "GROUND CHAKKAR BIG (10 PCS)", "GROUND CHAKKAR DELUXE", 
      "FLOWER POT ASHOKA", "FLOWER POT COLOR KOTI", "CLASSIC BOMB", "NAYAGARA FALLS", "SELFIE STICK", 
      "1 1/2 TWINKLING STAR", "4 TWINKLING STAR", "STRIPPED BIJILI - 100 PCS", "1000 WALA", "RED SUN", 
      "POGO WHITE", "PHOTO FLASH", "BAMBARAM", "PUB-G GUN", "SIREN", "HELICOPTER", "COLOUR RAIN", 
      "PEACOCK FEATHER", "ANGRY BIRD - GREEN", "GOLDEN GLOBE", "MAGIC PEACOCK", "FOG / SMOKE (5 PCS)", 
      "H2O (WHITE FUNCTION FREE FIRE)", "TWIX", "LOTUS", "15 SHOTS - MULTICOLOUR", "30 SHOTS - MULTICOLOUR", 
      "7 ELECTRIC SPARKLER", "10 GREEN", "15 CM ELECTRIC", "30 CM ELECTRIC", "30 CM COLOUR", "SUPER DLX", "ROLL CAP"
    ],
    featured: true
  },
  {
    combo_name: "Youngster Pack",
    total_items: 23,
    original_price: 12500,
    offer_price: 5000,
    combo_type: "Special Brown Box",
    description: "Command the sky with Sivakasi's elite collection. Professional-grade multi-shots.",
    products: [
      "60 SHOTS - MULTI COLOURS", "5000 WALA", "2 ROCK STAR - 3 PCS", "3 1/2 NAYAGARA FALLS", 
      "3 1/2 XXX SEVEN", "3 1/2 KING FISHER", "3 1/2 FANCY PIPE", "12 SHOTS", "1000 WALA", 
      "15 SHOTS - MULTICOLORS", "4 LAKSHMI DELUXE", "LION KING CATEGORY", "BHAKUBALI CATEGORY", 
      "JALLIKATTU CATEGORY", "2 SOUND ROCKET", "WHISTLING ROCKET", "CLASSIC BOMB", "ZURASSIC BOMB", 
      "DTS", "PAPER BOMB 1/4 KG", "PAPER BOMB 1/2 KG", "1 1/2 TWINKLING STAR", "4 TWINKLING STAR"
    ],
    featured: true
  }
];

async function main() {
  console.log('🎆 JJ Crackers Combo Seeder');
  console.log('================================\n');

  console.log('🗑️  Clearing existing combos...');
  const { error: delError } = await supabase.from('combo_packs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (delError) {
    console.log('   ❌ Error clearing combos:', delError.message);
  } else {
    console.log('   ✅ Cleared\n');
  }

  console.log('📤 Inserting combos into Supabase...');
  const { data, error } = await supabase.from('combo_packs').insert(combos).select('id, combo_name');

  if (error) {
    console.log(`   ❌ Error inserting combos: ${error.message}`);
  } else {
    console.log(`   ✅ Inserted ${data.length} combo packs successfully!\n`);
    data.forEach(c => console.log(`      - ${c.combo_name}`));
  }

  console.log('\n================================');
  console.log('🎉 Done!');
}

main().catch(console.error);
