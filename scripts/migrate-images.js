const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// --- Helper to load environment variables ---
function loadEnv() {
  const envPath = path.join(__dirname, '../.env.local');
  if (!fs.existsSync(envPath)) {
    console.log('⚠️  .env.local not found. Using default environment variables.');
    return {};
  }
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/(^["']|["']$)/g, '');
      if (key && !key.startsWith('#')) {
        env[key] = val;
      }
    }
  });
  return env;
}

const env = loadEnv();
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL || 'https://gllzlcgykefdmqhcfxjr.supabase.co';
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_m8kOsJiJ_Yx80wQgg92mnA_lX5i1FRS';

// Source folder containing migration output
const SOURCE_DIR = 'C:\\Users\\ragul\\cracker-migration\\Migration_Output\\Products';
// Target public folder inside our project
const TARGET_DIR = path.join(__dirname, '../public/products');

// --- String Cleaning for Matching ---
function cleanString(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ''); // remove all special characters and spaces
}

function normalize(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ') // replace special chars with spaces
    .replace(/\s+/g, ' ')       // collapse multiple spaces
    .trim();
}

// --- Recursive directory scanning ---
function getFoldersRecursive(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  let hasImages = false;
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(file)) {
      hasImages = true;
    }
  });

  if (hasImages) {
    // This is a product folder (leaf node)
    const category = path.basename(path.dirname(dir));
    const folderName = path.basename(dir);
    results.push({
      name: folderName,
      category: category,
      fullPath: dir,
      files: list.filter(f => fs.statSync(path.join(dir, f)).isFile())
    });
  } else {
    // Go deeper
    list.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        results = results.concat(getFoldersRecursive(filePath));
      }
    });
  }
  
  return results;
}

// --- Main execution ---
async function main() {
  const dryRun = process.argv.includes('--dry-run');
  console.log('⚙️  Product Images Migration Tool');
  console.log(`📂 Source Directory: ${SOURCE_DIR}`);
  console.log(`📂 Target Directory: ${TARGET_DIR}`);
  console.log(`Mode: ${dryRun ? '🔍 DRY RUN (No changes will be written)' : '🚀 LIVE RUN (Will write files and database)'}`);
  console.log('--------------------------------------------\n');

  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`❌ Source directory does not exist: ${SOURCE_DIR}`);
    process.exit(1);
  }

  // Create target directory if live
  if (!dryRun && !fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  // 1. Scan source folders
  console.log('🔍 Scanning source folders...');
  const folders = getFoldersRecursive(SOURCE_DIR);
  console.log(`   Found ${folders.length} product folders in migration source.\n`);

  // 2. Read products from src/lib/data/products.ts
  console.log('📖 Reading static products from data/products.ts...');
  const productsFilePath = path.join(__dirname, '../src/lib/data/products.ts');
  const productsFileContent = fs.readFileSync(productsFilePath, 'utf8');
  
  const arrayStart = productsFileContent.indexOf('export const products: Product[] = [');
  if (arrayStart === -1) {
    console.error('❌ Could not find products array start in products.ts');
    process.exit(1);
  }
  
  const header = productsFileContent.substring(0, arrayStart + 'export const products: Product[] = '.length);
  const arrayContentStr = productsFileContent.substring(arrayStart + 'export const products: Product[] = '.length);
  
  // Safely parse array using eval
  const products = eval(arrayContentStr);
  console.log(`   Parsed ${products.length} products successfully.\n`);

  // 3. Match products to folders
  console.log('🧠 Matching products to source folders...');
  const matches = [];
  const unmatched = [];

  products.forEach(product => {
    const cleanProduct = cleanString(product.name_en);
    // Remove trailing number index from slug (e.g. "-1", "-12" etc.)
    const cleanSlug = cleanString(product.slug.replace(/-\d+$/, ''));

    let bestMatch = null;
    let matchMethod = '';
    let highestScore = 0;

    // A. Clean Exact Match
    for (const folder of folders) {
      const cleanFolder = cleanString(folder.name);
      if (cleanProduct === cleanFolder || cleanSlug === cleanFolder) {
        bestMatch = folder;
        matchMethod = 'exact';
        break;
      }
    }

    // B. Substring Contains Match
    if (!bestMatch) {
      for (const folder of folders) {
        const cleanFolder = cleanString(folder.name);
        if (cleanProduct.includes(cleanFolder) || cleanFolder.includes(cleanProduct) ||
            cleanSlug.includes(cleanFolder) || cleanFolder.includes(cleanSlug)) {
          bestMatch = folder;
          matchMethod = 'contains';
          break;
        }
      }
    }

    // C. Token Overlap Match
    if (!bestMatch) {
      const productTokens = normalize(product.name_en).split(' ');
      for (const folder of folders) {
        const folderTokens = normalize(folder.name).split(' ');
        let common = 0;
        for (const token of productTokens) {
          if (folderTokens.includes(token)) common++;
        }
        const score = common / Math.max(productTokens.length, folderTokens.length);
        if (score > highestScore && score >= 0.5) {
          highestScore = score;
          bestMatch = folder;
          matchMethod = `similarity (${Math.round(score * 100)}%)`;
        }
      }
    }

    if (bestMatch) {
      matches.push({ product, folder: bestMatch, method: matchMethod });
    } else {
      unmatched.push(product);
    }
  });

  console.log(`✅ Matched: ${matches.length} / ${products.length} products.`);
  if (unmatched.length > 0) {
    console.log(`⚠️  Unmatched products (${unmatched.length}):`);
    unmatched.forEach(p => console.log(`   - [${p.category}] ${p.name_en} (slug: ${p.slug})`));
  }
  console.log('');

  // 4. Migrate images and update objects
  console.log('⚡ Migrating images...');
  const dbUpdates = [];

  for (const match of matches) {
    const { product, folder, method } = match;
    
    // Choose enhanced if available, otherwise original, otherwise first image
    let selectedFile = folder.files.find(f => f.startsWith('enhanced.'));
    if (!selectedFile) {
      selectedFile = folder.files.find(f => f.startsWith('original.'));
    }
    if (!selectedFile) {
      selectedFile = folder.files.find(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
    }

    if (!selectedFile) {
      console.log(`   ❌ No valid image file found in folder: ${folder.fullPath}`);
      continue;
    }

    const sourcePath = path.join(folder.fullPath, selectedFile);
    const ext = path.extname(selectedFile);
    const targetFileName = `${product.slug}${ext}`;
    const targetPath = path.join(TARGET_DIR, targetFileName);
    const relativeUrl = `/products/${targetFileName}`;

    console.log(`   [${method}] ${product.name_en} -> ${relativeUrl}`);

    if (!dryRun) {
      // Copy the file
      fs.copyFileSync(sourcePath, targetPath);
      // Update local product object
      product.image_url = relativeUrl;
      // Add to db updates queue
      dbUpdates.push({ slug: product.slug, image_url: relativeUrl });
    }
  }

  if (dryRun) {
    console.log('\n🔍 Dry run completed. No files copied, no database updates made.');
    return;
  }

  // 5. Save updated products back to products.ts
  console.log('\n💾 Writing updated products back to src/lib/data/products.ts...');
  const updatedArrayStr = JSON.stringify(products, null, 2);
  // Re-append the trailing ';' to form valid TS syntax
  const updatedFileContent = header + updatedArrayStr + ';\n';
  fs.writeFileSync(productsFilePath, updatedFileContent, 'utf8');
  console.log('   ✅ Static file updated.');

  // 6. Connect and update Supabase
  console.log('\n📡 Connecting to Supabase...');
  console.log(`   URL: ${SUPABASE_URL}`);
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  console.log(`📤 Pushing ${dbUpdates.length} image_url updates to Supabase products table...`);
  let successCount = 0;
  for (const update of dbUpdates) {
    const { data, error } = await supabase
      .from('products')
      .update({ image_url: update.image_url })
      .eq('slug', update.slug);

    if (error) {
      console.log(`   ❌ Failed to update ${update.slug}: ${error.message}`);
    } else {
      successCount++;
    }
  }
  console.log(`🎉 Supabase database update completed. Successfully updated ${successCount} / ${dbUpdates.length} rows.`);
}

main().catch(err => {
  console.error('Fatal error during migration:', err);
  process.exit(1);
});
