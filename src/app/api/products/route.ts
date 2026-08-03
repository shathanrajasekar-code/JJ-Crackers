import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { products as staticProducts } from '@/lib/data/products';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '500');
    const sortBy = searchParams.get('sort') || 'default';
    const isAdmin = searchParams.get('admin') === 'true';

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    // If Supabase is not configured, use static fallback data
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your_supabase')) {
      let filtered = [...staticProducts];

      if (category && category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
      }
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(p =>
          p.name_en.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
      switch (sortBy) {
        case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
        case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
        case 'name': filtered.sort((a, b) => a.name_en.localeCompare(b.name_en)); break;
        case 'discount': filtered.sort((a, b) => (b.discount_percent || 0) - (a.discount_percent || 0)); break;
      }

      const total = filtered.length;
      const start = (page - 1) * limit;
      const paginated = filtered.slice(start, start + limit);

      return NextResponse.json({
        products: paginated,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    }

    // Supabase connected — single clean query path
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    let query = supabase
      .from('products')
      .select('id,name_en,name_ta,slug,category,price,mrp,discount_percent,badge_text,image_url,in_stock,is_featured,is_eco_friendly,sort_order', { count: 'exact' });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`name_en.ilike.%${search}%,category.ilike.%${search}%`);
    }

    switch (sortBy) {
      case 'price-low': query = query.order('price', { ascending: true }); break;
      case 'price-high': query = query.order('price', { ascending: false }); break;
      case 'name': query = query.order('name_en', { ascending: true }); break;
      case 'discount': query = query.order('discount_percent', { ascending: false }); break;
      default: query = query.order('sort_order', { ascending: true }).order('category', { ascending: true }).order('price', { ascending: true });
    }

    const start = (page - 1) * limit;
    query = query.range(start, start + limit - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    const total = count || 0;
    const responseHeaders: Record<string, string> = {};
    if (isAdmin) {
      responseHeaders['Cache-Control'] = 'no-store, max-age=0, must-revalidate';
    } else {
      // Cache at CDN for 30s, serve stale for up to 10 minutes while revalidating
      responseHeaders['Cache-Control'] = 'public, s-maxage=30, stale-while-revalidate=600';
    }

    return NextResponse.json({
      products: data || [],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }, {
      headers: responseHeaders
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({
      products: staticProducts,
      total: staticProducts.length,
      page: 1,
      limit: 500,
      totalPages: 1,
    });
  }
}

// POST — Admin: Add new product
export async function POST(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase')) {
      return NextResponse.json({ error: 'Supabase not configured. Please set SUPABASE_SERVICE_ROLE_KEY in your environment variables.' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await req.json();

    const nameEn = body.name_en || body.product_name || 'untitled';
    const cleanName = typeof nameEn === 'string' ? nameEn : 'untitled';
    const baseSlug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'product';
    const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
    const category = body.category || 'single-sound';

    const mrp = Number(body.mrp || body.original_price || 0);
    const price = Number(body.price || body.discounted_price || mrp);
    let discount_percent = 0;
    if (mrp > 0 && price < mrp) {
      discount_percent = Math.round(((mrp - price) / mrp) * 100);
    }

    const { data, error } = await supabase
      .from('products')
      .insert({
        name_en: nameEn,
        name_ta: body.name_ta || nameEn,
        slug,
        category,
        price,
        mrp,
        discount_percent,
        badge_text: discount_percent > 0 ? `🔥 ${discount_percent}% OFF` : null,
        image_url: body.image_url || null,
        in_stock: body.in_stock !== undefined ? Boolean(body.in_stock) : true,
        is_featured: body.is_featured !== undefined ? Boolean(body.is_featured || body.featured) : false,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    const errMessage = error.message || error.details || (typeof error === 'object' ? JSON.stringify(error) : String(error));
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}

// DELETE — Admin: Bulk delete products
export async function DELETE(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase')) {
      return NextResponse.json({ error: 'Supabase not configured.' }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const idsString = searchParams.get('ids');
    if (!idsString) {
      return NextResponse.json({ error: 'Missing ids parameter' }, { status: 400 });
    }

    const ids = idsString.split(',').filter(Boolean);
    if (ids.length === 0) {
      return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from('products')
      .delete()
      .in('id', ids)
      .select();

    if (error) throw error;
    return NextResponse.json({ success: true, count: data?.length || 0 });
  } catch (error: any) {
    console.error('Error deleting products:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
