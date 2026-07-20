import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

// The definitive 20 categories
const NEW_CATEGORIES = [
  { id: 'single-sound', label: 'Single Sound Crackers', emoji: '💥', sort_order: 1 },
  { id: 'ground-chakkars', label: 'Ground Chakkars', emoji: '🌀', sort_order: 2 },
  { id: 'flowerpots', label: 'Flower Pots', emoji: '🌸', sort_order: 3 },
  { id: 'bijili', label: 'Bijili', emoji: '⚡', sort_order: 4 },
  { id: 'thunder-paper-bomb', label: 'Thunder Paper Bomb', emoji: '💣', sort_order: 5 },
  { id: 'thunder-sound-bomb', label: 'Thunder Sound Bomb', emoji: '🔊', sort_order: 6 },
  { id: 'twinkling-star', label: 'Twinkling Star', emoji: '🌟', sort_order: 7 },
  { id: 'sky-jet', label: 'Sky Jet', emoji: '🚀', sort_order: 8 },
  { id: 'pencil-fountains', label: 'Pencil Fountains', emoji: '✏️', sort_order: 9 },
  { id: 'red-chain', label: 'Red Chain Crackers', emoji: '🔗', sort_order: 10 },
  { id: 'nano-fountains', label: 'Nano Fountains', emoji: '⛲', sort_order: 11 },
  { id: 'joy-fountains', label: 'Joy Fountains', emoji: '🎆', sort_order: 12 },
  { id: 'pearl-fountains', label: 'Pearl Fountains', emoji: '💎', sort_order: 13 },
  { id: 'amazing-fountains', label: 'Amazing Fountains', emoji: '✨', sort_order: 14 },
  { id: 'royal-fountains', label: 'Royal Fountains', emoji: '👑', sort_order: 15 },
  { id: 'fancy-novelties', label: 'Fancy Novelties', emoji: '🎭', sort_order: 16 },
  { id: 'multishots', label: 'Multi Shots', emoji: '🎇', sort_order: 17 },
  { id: 'sky-expo-multishots', label: 'Sky Expo Multi Shots (Premium)', emoji: '🏆', sort_order: 18 },
  { id: 'sparklers', label: 'Sparklers', emoji: '✨', sort_order: 19 },
  { id: 'match-box', label: 'Match Box', emoji: '📦', sort_order: 20 },
];

// Map old category IDs to new ones
const CATEGORY_REMAP: Record<string, string> = {
  'chakkars': 'ground-chakkars',
  'bombs': 'thunder-sound-bomb',
  'rockets': 'sky-jet',
  'chain': 'red-chain',
  'fountains': 'nano-fountains',
  'novelties': 'fancy-novelties',
  'giftbox': 'match-box',
};

// POST — Full Supabase cleanup
export async function POST(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase')) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const report: string[] = [];
    const validCategoryIds = NEW_CATEGORIES.map(c => c.id);

    // ═══════════════════════════════════════════
    // 1. CLEANUP: Remove duplicate combo packs
    // ═══════════════════════════════════════════
    const { data: allCombos } = await supabase
      .from('combo_packs')
      .select('id,combo_name,created_at')
      .order('created_at', { ascending: false });

    if (allCombos && allCombos.length > 0) {
      const seen = new Map<string, string>();
      const duplicateIds: string[] = [];

      for (const combo of allCombos) {
        const normalizedName = (combo.combo_name || '').toLowerCase().trim();
        if (seen.has(normalizedName)) {
          duplicateIds.push(combo.id);
        } else {
          seen.set(normalizedName, combo.id);
        }
      }

      if (duplicateIds.length > 0) {
        const { error } = await supabase
          .from('combo_packs')
          .delete()
          .in('id', duplicateIds);
        if (!error) {
          report.push(`✅ Removed ${duplicateIds.length} duplicate combo packs`);
        } else {
          report.push(`⚠️ Failed to remove duplicate combos: ${error.message}`);
        }
      } else {
        report.push('✅ No duplicate combo packs found');
      }
    }

    // ═══════════════════════════════════════════
    // 2. CLEANUP: Seed/update categories table
    // ═══════════════════════════════════════════
    // First delete all old categories
    const { error: delCatErr } = await supabase
      .from('categories')
      .delete()
      .neq('id', '___never_match___'); // delete all rows

    if (delCatErr) {
      report.push(`⚠️ Failed to clear old categories: ${delCatErr.message}`);
    }

    // Insert the 20 new categories
    const { data: insertedCats, error: insertCatErr } = await supabase
      .from('categories')
      .upsert(NEW_CATEGORIES, { onConflict: 'id' })
      .select();

    if (insertCatErr) {
      report.push(`⚠️ Failed to seed categories: ${insertCatErr.message}`);
    } else {
      report.push(`✅ Seeded ${insertedCats?.length || 0} categories`);
    }

    // ═══════════════════════════════════════════
    // 3. CLEANUP: Remap old product categories
    // ═══════════════════════════════════════════
    let remappedCount = 0;
    for (const [oldCat, newCat] of Object.entries(CATEGORY_REMAP)) {
      const { data: updatedProducts, error: updateErr } = await supabase
        .from('products')
        .update({ category: newCat })
        .eq('category', oldCat)
        .select('id');

      if (!updateErr && updatedProducts) {
        remappedCount += updatedProducts.length;
      }
    }
    if (remappedCount > 0) {
      report.push(`✅ Remapped ${remappedCount} products from old categories to new ones`);
    } else {
      report.push('✅ No products needed category remapping');
    }

    // ═══════════════════════════════════════════
    // 4. CLEANUP: Flag products with invalid categories
    // ═══════════════════════════════════════════
    const { data: allProducts } = await supabase
      .from('products')
      .select('id,name_en,category');

    if (allProducts) {
      const invalidProducts = allProducts.filter(p => !validCategoryIds.includes(p.category));
      if (invalidProducts.length > 0) {
        report.push(`⚠️ ${invalidProducts.length} products have categories not in the new 20-category list:`);
        invalidProducts.slice(0, 10).forEach(p => {
          report.push(`   - "${p.name_en}" has category "${p.category}"`);
        });
        if (invalidProducts.length > 10) {
          report.push(`   ... and ${invalidProducts.length - 10} more`);
        }
      } else {
        report.push('✅ All products have valid categories');
      }
    }

    // ═══════════════════════════════════════════
    // 5. CLEANUP: Remove products with no name
    // ═══════════════════════════════════════════
    const { data: noNameProducts, error: noNameErr } = await supabase
      .from('products')
      .delete()
      .or('name_en.is.null,name_en.eq.')
      .select('id');

    if (!noNameErr && noNameProducts && noNameProducts.length > 0) {
      report.push(`✅ Removed ${noNameProducts.length} products with no name`);
    }

    // ═══════════════════════════════════════════
    // 5.5 CLEANUP: Remove all newsletter subscribers
    // ═══════════════════════════════════════════
    const { data: newsletterDeleted, error: newsletterErr } = await supabase
      .from('newsletter_subscribers')
      .delete()
      .neq('email', '___never_match___')
      .select('id');

    if (!newsletterErr && newsletterDeleted) {
      report.push(`✅ Cleared ${newsletterDeleted.length} subscriber records from newsletter table`);
    } else if (newsletterErr) {
      report.push(`⚠️ Failed to clear newsletter table: ${newsletterErr.message}`);
    }

    // ═══════════════════════════════════════════
    // 6. STATS
    // ═══════════════════════════════════════════
    const { count: productCount } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true });

    const { count: comboCount } = await supabase
      .from('combo_packs')
      .select('id', { count: 'exact', head: true });

    const { count: categoryCount } = await supabase
      .from('categories')
      .select('id', { count: 'exact', head: true });

    report.push('');
    report.push(`📊 Final counts: ${productCount || 0} products, ${comboCount || 0} combos, ${categoryCount || 0} categories`);

    return NextResponse.json({
      success: true,
      report,
      stats: {
        products: productCount || 0,
        combos: comboCount || 0,
        categories: categoryCount || 0,
      }
    });
  } catch (error: any) {
    console.error('Cleanup error:', error);
    return NextResponse.json({
      error: error.message || 'Cleanup failed',
    }, { status: 500 });
  }
}
