import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

function generateOrderNumber(): string {
  const now = new Date();
  const dateStr = now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0');
  const seq = Math.floor(Math.random() * 9000) + 1000;
  return `JJ-${dateStr}-${seq}`;
}

export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || supabaseUrl.includes('your_supabase')) {
      return NextResponse.json([]);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const customerName = (body.customer_name || '').trim();
    const customerPhone = (body.customer_phone || '').replace(/\D/g, '');
    const customerAddress = (body.customer_address || '').trim();

    if (!customerName) {
      return NextResponse.json({ error: 'Customer Name is required' }, { status: 400 });
    }
    if (!customerPhone || customerPhone.length !== 10) {
      return NextResponse.json({ error: 'A valid 10-digit Phone Number is required' }, { status: 400 });
    }
    if (!customerAddress || customerAddress.length < 5) {
      return NextResponse.json({ error: 'Full Delivery Address is required' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || supabaseUrl.includes('your_supabase')) {
      // Return mock order for demo
      const orderNumber = generateOrderNumber();
      return NextResponse.json({
        id: crypto.randomUUID(),
        order_number: orderNumber,
        ...body,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: customerAddress,
        customer_email: (body.customer_email || '').trim(),
        customer_city: body.customer_city || null,
        customer_pincode: body.customer_pincode || null,
        customer_state: body.customer_state || null,
        customer_district: body.customer_district || null,
        status: 'confirmed',
        payment_status: 'pending',
        created_at: new Date().toISOString(),
      }, { status: 201 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const orderNumber = generateOrderNumber();

    const { data, error } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: customerName,
        customer_email: (body.customer_email || '').trim(),
        customer_phone: customerPhone,
        customer_address: customerAddress,
        customer_city: body.customer_city || null,
        customer_pincode: body.customer_pincode || null,
        customer_state: body.customer_state || null,
        customer_district: body.customer_district || null,
        items: body.items,
        subtotal: body.subtotal || 0,
        discount_total: body.discount_total || 0,
        total_amount: body.total_amount,
        status: 'confirmed',
        payment_method: body.payment_method || 'bank_transfer',
        payment_status: 'pending',
        notes: body.notes || null,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
}
