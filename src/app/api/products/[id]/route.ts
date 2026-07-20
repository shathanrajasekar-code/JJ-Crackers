import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

// GET single product
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || supabaseUrl.includes('your_supabase')) {
      return NextResponse.json({ error: 'Not configured' }, { status: 404 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
}

// PATCH — Update product
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const { id } = await params;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || supabaseUrl.includes('your_supabase')) {
      return NextResponse.json({ error: 'Not configured' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await req.json();

    // Product image is no longer required.

    const updateData: Record<string, any> = {};
    if (body.name_en !== undefined) updateData.name_en = body.name_en;
    if (body.name_ta !== undefined) updateData.name_ta = body.name_ta;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.price !== undefined) updateData.price = Number(body.price);
    if (body.mrp !== undefined) updateData.mrp = Number(body.mrp);
    if (body.image_url !== undefined) updateData.image_url = body.image_url;
    if (body.in_stock !== undefined) updateData.in_stock = Boolean(body.in_stock);
    if (body.is_featured !== undefined) updateData.is_featured = Boolean(body.is_featured);

    // Recalculate discount
    if (body.mrp !== undefined || body.price !== undefined) {
      const mrp = Number(body.mrp !== undefined ? body.mrp : updateData.mrp || 0);
      const price = Number(body.price !== undefined ? body.price : updateData.price || 0);
      if (mrp > 0 && price < mrp) {
        updateData.discount_percent = Math.round(((mrp - price) / mrp) * 100);
        updateData.badge_text = `🔥 ${updateData.discount_percent}% OFF`;
      } else {
        updateData.discount_percent = 0;
        updateData.badge_text = null;
      }
    }

    const { data, error } = await supabase.from('products').update(updateData).eq('id', id).select().single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error updating product:', error);
    const errMessage = error.message || error.details || (typeof error === 'object' ? JSON.stringify(error) : String(error));
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}

// DELETE — Delete product
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const { id } = await params;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || supabaseUrl.includes('your_supabase')) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 400 });
    }
    if (!supabaseKey) {
      return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY not set. Admin operations require the service role key.' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase delete error:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Product not found or already deleted' }, { status: 404 });
    }

    return NextResponse.json({ success: true, deleted: data[0] });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete product' }, { status: 500 });
  }
}
