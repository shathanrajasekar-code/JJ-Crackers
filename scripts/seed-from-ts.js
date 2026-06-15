const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

// --- Config ---
const SUPABASE_URL = 'https://gllzlcgykefdmqhcfxjr.supabase.co';
const SUPABASE_KEY = 'sb_publishable_m8kOsJiJ_Yx80wQgg92mnA_lX5i1FRS';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  console.log('🌌 Syncing Supabase products from src/lib/data/products.ts...');
  
  // Read products from TS file
  const productsFilePath = path.join(__dirname, '..', 'src/lib/data/products.ts');
  const fileContent = fs.readFileSync(productsFilePath, 'utf8');
  
  const arrayStart = fileContent.indexOf('export const products: Product[] = [');
  if (arrayStart === -1) {
    console.error('❌ Could not find products array start in products.ts');
    process.exit(1);
  }
  
  const arrayContentStr = fileContent.substring(arrayStart + 'export const products: Product[] = '.length);
  // Remove trailing ';' and whitespace to make it valid JSON or evaluatable JS
  const cleanArrayStr = arrayContentStr.trim().replace(/;$/, '');
  
  // Safely evaluate or parse
  let staticProducts;
  try {
    staticProducts = eval(cleanArrayStr);
  } catch (e) {
    console.error('❌ Failed to parse products array:', e.message);
    process.exit(1);
  }
  
  console.log(`   Loaded ${staticProducts.length} products from products.ts`);

  // Clear existing products
  console.log('🗑️  Clearing existing products in Supabase...');
  const { error: delError } = await supabase
    .from('products')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  
  if (delError) {
    console.error('❌ Could not clear existing products:', delError.message);
    process.exit(1);
  }
  console.log('   ✅ Cleared existing products.');

  // Map to Supabase schema
  const mapped = staticProducts.map((p, index) => ({
    name_en: p.name_en,
    name_ta: p.name_ta || p.name_en,
    slug: p.slug || p.name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + index,
    category: p.category,
    price: p.price,
    mrp: p.mrp,
    discount_percent: p.discount_percent || 0,
    badge_text: p.badge_text || null,
    image_url: p.image_url || null,
    in_stock: p.in_stock !== undefined ? p.in_stock : true,
    is_featured: p.is_featured || false,
    is_eco_friendly: false,
    sort_order: index,
  }));

  // Insert in batches
  console.log('📤 Inserting products in batches of 25...');
  const BATCH_SIZE = 25;
  let totalInserted = 0;
  
  for (let i = 0; i < mapped.length; i += BATCH_SIZE) {
    const batch = mapped.slice(i, i + BATCH_SIZE);
    const { data, error } = await supabase.from('products').insert(batch).select('id');
    
    if (error) {
      console.error(`   ❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`, error.message);
    } else {
      totalInserted += data.length;
      console.log(`   ✅ Inserted ${totalInserted}/${mapped.length} products`);
    }
  }

  console.log(`\n🎉 Success! Synchronized ${totalInserted} products with image URLs.`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
