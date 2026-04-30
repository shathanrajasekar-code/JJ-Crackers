import { readFileSync, writeFileSync } from 'fs';
import pkg from 'xlsx';
const { readFile, utils } = pkg;
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const wb = readFile(join(root, 'Book1.xlsx'));
const ws = wb.Sheets[wb.SheetNames[0]];
const rows = utils.sheet_to_json(ws, { header: 1 }).slice(1);

const catMap = {
  'SINGLE SOUND CRACKERS': 'single-sound',
  'GROUND CHAKKARS': 'chakkars',
  'FLOWER POTS': 'flowerpots',
  'SKY JET': 'rockets',
  'THUNDER SOUND BOMB': 'bombs',
  'THUNDER - PAPER BOMB': 'bombs',
  'SUPER SONIC- PENCIL': 'novelties',
  'TWINKLING STAR': 'sparklers',
  'BIJILI CRACKERS': 'bijili',
  'RED CHAIN CRACKERS': 'chain',
  'AMAZING FOUNTAIN': 'fountains',
  'NANO FOUNTAINS': 'fountains',
  'JOY FOUNTAINS': 'fountains',
  'MEGA FOUNTAINS': 'fountains',
  'PEARL FOUNTAINS': 'fountains',
  'FANCY NOVELTIES': 'novelties',
  'FABULOUS MULTI SHOTS': 'multishots',
  'SKY EXPO-MULTI SHOTS': 'multishots',
  'WONDERFUL SPARKLERS': 'sparklers',
  'MATCHES': 'novelties',
  'ROLL CAP': 'novelties',
  'GIFT BOXES': 'giftbox',
  'SPECIAL PACK (BROWN)': 'giftbox',
};

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const products = rows.map((r, i) => {
  const cat = (r[1] || '').replace(/\n/g, ' ').trim();
  const name = (r[2] || '').replace(/\n/g, ' ').trim();
  const mrp = Number(r[3]) || 0;
  const price = Number(r[4]) || 0;
  const disc = mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const category = catMap[cat] || 'other';
  const badge = disc >= 60 ? `🔥 ${disc}% OFF` : disc >= 50 ? `${disc}% OFF` : null;
  return {
    id: String(i + 1),
    name_en: name,
    name_ta: name,
    slug: `${slugify(name)}-${i + 1}`,
    category,
    price,
    mrp,
    discount_percent: disc,
    badge_text: badge,
    image_url: null,
    in_stock: true,
    is_featured: i < 6,
    excel_category: cat,
  };
});

const out = `export interface Product {
  id: string;
  name_en: string;
  name_ta: string;
  slug: string;
  category: string;
  price: number;
  mrp: number;
  discount_percent: number;
  badge_text: string | null;
  image_url: string | null;
  in_stock: boolean;
  is_featured: boolean;
  excel_category?: string;
}

export const ALL_CATEGORIES = [
  { key: 'all', label: 'All Products' },
  { key: 'sparklers', label: '✨ Sparklers' },
  { key: 'single-sound', label: '💥 Single Sound' },
  { key: 'chakkars', label: '🌀 Chakkars' },
  { key: 'flowerpots', label: '🌸 Flower Pots' },
  { key: 'rockets', label: '🚀 Rockets' },
  { key: 'bombs', label: '💣 Bombs' },
  { key: 'bijili', label: '⚡ Bijili' },
  { key: 'chain', label: '🔗 Chain Crackers' },
  { key: 'fountains', label: '⛲ Fountains' },
  { key: 'novelties', label: '🎭 Novelties' },
  { key: 'multishots', label: '🎆 Multi Shots' },
  { key: 'giftbox', label: '🎁 Gift Boxes' },
];

export const products: Product[] = ${JSON.stringify(products, null, 2)};
`;

writeFileSync(join(root, 'src/lib/data/products.ts'), out);
console.log(`Written ${products.length} products to src/lib/data/products.ts`);
