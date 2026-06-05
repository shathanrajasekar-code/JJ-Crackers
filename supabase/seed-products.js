/**
 * JJ CRACKERS — Product Seed Script
 * 
 * This script reads Book1.xlsx and pushes all 137 products into Supabase.
 * 
 * BEFORE RUNNING:
 * 1. Go to https://supabase.com/dashboard → Your Project → SQL Editor
 * 2. Paste and run supabase/schema.sql to create tables
 * 3. Then run: node supabase/seed-products.js
 */

const { createClient } = require('@supabase/supabase-js');
const xlsx = require('xlsx');
const path = require('path');

// --- Config ---
const SUPABASE_URL = 'https://gllzlcgykefdmqhcfxjr.supabase.co';
const SUPABASE_KEY = 'sb_publishable_m8kOsJiJ_Yx80wQgg92mnA_lX5i1FRS';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Category Mapping ---
function getCategorySlug(rawCategory) {
  const cat = rawCategory.replace(/\n/g, ' ').toLowerCase().trim();
  if (cat.includes('single sound')) return 'single-sound';
  if (cat.includes('sparkler') || cat.includes('twinkling')) return 'sparklers';
  if (cat.includes('flower') || cat.includes('pot')) return 'flowerpots';
  if (cat.includes('rocket') || cat.includes('sky jet')) return 'rockets';
  if (cat.includes('chakkar') || cat.includes('wheel')) return 'chakkars';
  if (cat.includes('bijili')) return 'bijili';
  if (cat.includes('chain') || cat.includes('wala')) return 'chain';
  if (cat.includes('bomb') || cat.includes('paper bomb') || cat.includes('thunder')) return 'bombs';
  if (cat.includes('fountain') || cat.includes('nano') || cat.includes('amazing') || cat.includes('snake') || cat.includes('pogo')) return 'fountains';
  if (cat.includes('pencil') || cat.includes('sonic') || cat.includes('selfie') || cat.includes('novelty')) return 'novelties';
  if (cat.includes('shot') || cat.includes('multi') || cat.includes('aerial')) return 'multishots';
  if (cat.includes('gift') || cat.includes('box') || cat.includes('pack') || cat.includes('combo')) return 'giftbox';
  return 'general';
}

function generateSlug(name, index) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + (index + 1);
}

async function main() {
  console.log('🎆 JJ Crackers Product Seeder');
  console.log('================================\n');

  // Test connection
  console.log('📡 Testing Supabase connection...');
  const { error: connError } = await supabase.from('products').select('id').limit(1);
  if (connError) {
    console.log('❌ Connection failed:', connError.message);
    console.log('\n⚠️  You need to create the products table first!');
    console.log('   1. Go to: https://supabase.com/dashboard');
    console.log('   2. Open SQL Editor');
    console.log('   3. Paste and run supabase/schema.sql');
    process.exit(1);
  }
  console.log('✅ Connected to Supabase!\n');

  // Read Excel
  const xlsxPath = path.join(__dirname, '..', 'Book1.xlsx');
  console.log('📊 Reading Book1.xlsx...');
  const workbook = xlsx.readFile(xlsxPath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet);
  console.log(`   Found ${rows.length} products\n`);

  // Map to schema
  const products = rows.map((row, index) => {
    const name = (row['Product Name'] || '').toString().trim();
    const rawCategory = (row['Product Category'] || '').toString().trim();
    const mrp = parseInt(row['Original\nPrice (₹)']) || 0;
    const price = parseInt(row['Discount ed Price (₹)']) || mrp;
    const discount_percent = mrp > 0 && price < mrp ? Math.round(((mrp - price) / mrp) * 100) : 0;

    return {
      name_en: name,
      name_ta: name,
      slug: generateSlug(name, index),
      category: getCategorySlug(rawCategory),
      price,
      mrp,
      discount_percent,
      badge_text: discount_percent > 0 ? `🔥 ${discount_percent}% OFF` : null,
      image_url: null,
      in_stock: true,
      is_featured: discount_percent >= 60 && price <= 50,
      is_eco_friendly: false,
      sort_order: index,
    };
  });

  // Show category breakdown
  const catCounts = {};
  products.forEach(p => { catCounts[p.category] = (catCounts[p.category] || 0) + 1; });
  console.log('📦 Category Breakdown:');
  Object.entries(catCounts).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`   ${cat.padEnd(15)} → ${count} products`);
  });
  console.log('');

  // Clear existing products
  console.log('🗑️  Clearing existing products...');
  const { error: delError } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (delError) {
    console.log('   Warning: Could not clear existing products:', delError.message);
  } else {
    console.log('   ✅ Cleared\n');
  }

  // Insert in batches
  console.log('📤 Inserting products into Supabase...');
  const BATCH_SIZE = 25;
  let totalInserted = 0;
  let totalErrors = 0;

  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);
    const { data, error } = await supabase.from('products').insert(batch).select('id');

    if (error) {
      console.log(`   ❌ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${error.message}`);
      totalErrors += batch.length;
    } else {
      totalInserted += data.length;
      const pct = Math.round((totalInserted / products.length) * 100);
      process.stdout.write(`   ✅ ${totalInserted}/${products.length} (${pct}%)\r`);
    }
  }

  console.log('\n');
  console.log('================================');
  console.log(`🎉 Done! Inserted ${totalInserted} products`);
  if (totalErrors > 0) console.log(`⚠️  ${totalErrors} failed`);
  console.log('\n🌐 Your products page should now show all products!');
  console.log('   Run: npm run dev');
  console.log('   Visit: http://localhost:3000/products');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
