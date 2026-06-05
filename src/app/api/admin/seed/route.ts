import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as xlsx from 'xlsx';

export const dynamic = 'force-dynamic';

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

function getCategorySlug(categoryName: string) {
  const cat = categoryName.toLowerCase();
  if (cat.includes('sparkler')) return 'sparklers';
  if (cat.includes('flower') || cat.includes('pot')) return 'flowerpots';
  if (cat.includes('rocket')) return 'rockets';
  if (cat.includes('chakkar')) return 'chakkars';
  if (cat.includes('aerial') || cat.includes('shot')) return 'aerial';
  if (cat.includes('gift') || cat.includes('box')) return 'giftbox';
  return 'general';
}

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseUrl || !supabaseServiceKey || supabaseUrl.includes('your_supabase')) {
      return NextResponse.json({ error: 'Supabase credentials are not configured in .env.local' }, { status: 400 });
    }

    // Initialize Supabase admin client (bypass RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Parse Excel
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json<any>(sheet);

    // Map rows to Supabase schema
    const products = rows.map((row) => {
      const name = row['Product Name']?.toString().trim() || 'Unknown Product';
      const categoryRaw = row['Product Category']?.toString().trim() || 'General';
      const mrp = parseInt(row['Original\nPrice (₹)']) || 0;
      const price = parseInt(row['Discount ed Price (₹)']) || mrp;
      
      let discount_percent = 0;
      if (mrp > 0 && price < mrp) {
        discount_percent = Math.round(((mrp - price) / mrp) * 100);
      }

      return {
        name_en: name,
        name_ta: name,
        slug: generateSlug(name) + '-' + Math.random().toString(36).substring(2, 6),
        category: getCategorySlug(categoryRaw),
        price,
        mrp,
        discount_percent,
        badge_text: discount_percent > 50 ? `${discount_percent}% OFF` : null,
        image_url: null,
        in_stock: true,
        is_featured: discount_percent > 60,
      };
    });

    const { data, error } = await supabase.from('products').insert(products).select();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, count: data?.length || 0 });

  } catch (error: any) {
    console.error('Seed Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
