import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { products as staticProducts } from '@/lib/data/products';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '200');
    const sortBy = searchParams.get('sort') || 'default';
    const isAdmin = searchParams.get('admin') === 'true';

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    // If Supabase is not configured, use static fallback data
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your_supabase')) {
      let filtered = [...staticProducts];

      // Category filter
      if (category && category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
      }

      // Search filter
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(p =>
          p.name_en.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }

      // Sort
      switch (sortBy) {
        case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
        case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
        case 'name': filtered.sort((a, b) => a.name_en.localeCompare(b.name_en)); break;
        case 'discount': filtered.sort((a, b) => (b.discount_percent || 0) - (a.discount_percent || 0)); break;
      }

      // Pagination or Per-category Limit
      let paginated = [];
      let total = 0;
      if (isAdmin) {
        // Admin gets ALL products
        total = filtered.length;
        const start = (page - 1) * limit;
        paginated = filtered.slice(start, start + limit);
      } else if (!category || category === 'all') {
        // Public: Group and limit to 10 per category
        const grouped: { [key: string]: any[] } = {};
        const result: any[] = [];
        for (const p of filtered) {
          const cat = p.category || 'other';
          if (!grouped[cat]) grouped[cat] = [];
          if (grouped[cat].length < 10) {
            grouped[cat].push(p);
            result.push(p);
          }
        }
        paginated = result;
        total = result.length;
      } else {
        total = filtered.length;
        const start = (page - 1) * limit;
        paginated = filtered.slice(start, start + limit);
      }

      return NextResponse.json({
        products: paginated,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    }

    // Supabase connected
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    if (isAdmin || (category && category !== 'all')) {
      // Admin or specific category: return all with pagination
      let query = supabase
        .from('products')
        .select('*', { count: 'exact' });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      // Search filter
      if (search) {
        query = query.or(`name_en.ilike.%${search}%,category.ilike.%${search}%`);
      }

      // Sort
      switch (sortBy) {
        case 'price-low': query = query.order('price', { ascending: true }); break;
        case 'price-high': query = query.order('price', { ascending: false }); break;
        case 'name': query = query.order('name_en', { ascending: true }); break;
        case 'discount': query = query.order('discount_percent', { ascending: false }); break;
        default: query = query.order('category', { ascending: true }).order('price', { ascending: true });
      }

      // Pagination
      const start = (page - 1) * limit;
      query = query.range(start, start + limit - 1);

      const { data, error, count } = await query;
      if (error) throw error;

      const total = count || 0;
      return NextResponse.json({
        products: data || [],
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    }

    if (!category || category === 'all') {
      // Public 'all' view: group by category, limit 10 per category
      let query = supabase
        .from('products')
        .select('*');

      // Search filter
      if (search) {
        query = query.or(`name_en.ilike.%${search}%,category.ilike.%${search}%`);
      }

      // Sort
      switch (sortBy) {
        case 'price-low': query = query.order('price', { ascending: true }); break;
        case 'price-high': query = query.order('price', { ascending: false }); break;
        case 'name': query = query.order('name_en', { ascending: true }); break;
        case 'discount': query = query.order('discount_percent', { ascending: false }); break;
        default: query = query.order('category', { ascending: true }).order('price', { ascending: true });
      }

      const { data, error } = await query;
      if (error) throw error;

      const grouped: { [key: string]: any[] } = {};
      const result: any[] = [];
      const productsList = data || [];

      for (const p of productsList) {
        const cat = p.category || 'other';
        if (!grouped[cat]) grouped[cat] = [];
        if (grouped[cat].length < 10) {
          grouped[cat].push(p);
          result.push(p);
        }
      }

      return NextResponse.json({
        products: result,
        total: result.length,
        page: 1,
        limit: result.length,
        totalPages: 1,
      });
    }

    // Supabase connected & specific category filtered
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' });

    query = query.eq('category', category);

    // Search filter
    if (search) {
      query = query.or(`name_en.ilike.%${search}%,category.ilike.%${search}%`);
    }

    // Sort
    switch (sortBy) {
      case 'price-low': query = query.order('price', { ascending: true }); break;
      case 'price-high': query = query.order('price', { ascending: false }); break;
      case 'name': query = query.order('name_en', { ascending: true }); break;
      case 'discount': query = query.order('discount_percent', { ascending: false }); break;
      default: query = query.order('category', { ascending: true }).order('price', { ascending: true });
    }

    // Pagination
    const start = (page - 1) * limit;
    query = query.range(start, start + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    const total = count || 0;
    return NextResponse.json({
      products: data || [],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fallback to static data on any error
    return NextResponse.json({
      products: staticProducts,
      total: staticProducts.length,
      page: 1,
      limit: 200,
      totalPages: 1,
    });
  }
}

// POST — Admin: Add new product
export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || supabaseUrl.includes('your_supabase')) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await req.json();

    const slug = body.name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 6);
    const mrp = body.mrp || body.original_price || 0;
    const price = body.price || body.discounted_price || mrp;
    let discount_percent = 0;
    if (mrp > 0 && price < mrp) {
      discount_percent = Math.round(((mrp - price) / mrp) * 100);
    }

    const { data, error } = await supabase
      .from('products')
      .insert({
        name_en: body.name_en || body.product_name,
        name_ta: body.name_ta || body.name_en || body.product_name || '',
        slug,
        category: body.category,
        price,
        mrp,
        discount_percent,
        badge_text: discount_percent > 0 ? `🔥 ${discount_percent}% OFF` : null,
        image_url: body.image_url || null,
        in_stock: body.in_stock !== undefined ? body.in_stock : true,
        is_featured: body.is_featured || body.featured || false,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
