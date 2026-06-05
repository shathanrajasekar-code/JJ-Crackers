import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

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

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase')) {
      return NextResponse.json({ error: 'Supabase credentials not configured.' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });

    // Check if table exists
    const { error: checkError } = await supabase.from('combo_packs').select('id').limit(1);
    if (checkError) {
      return NextResponse.json({ 
        error: `Database error: ${checkError.message}. Did you run the SQL schema in the Supabase dashboard?` 
      }, { status: 400 });
    }

    // Insert combos
    const { data, error } = await supabase.from('combo_packs').insert(combos).select('id');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      totalInserted: data?.length || 0,
      totalAttempted: combos.length,
    });
  } catch (error: any) {
    console.error('Bulk combo seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
