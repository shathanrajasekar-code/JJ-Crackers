import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const DEFAULT_SETTINGS = {
  global_discount: '60',
  min_order_value: '2000',
  company_name: 'JEGAJOTHI CRACKERS',
  company_address: '1/406, SIVAKASI -VEMBAKOTAI MAIN ROAD, Opp to EB OFFICE,VEMBAKOTTAI.',
  mobile_number_1: '7092300252',
  mobile_number_2: '7092300252',
  whatsapp_number: '7092300252',
  email_address: 'jjcrackersworld@gmail.com',
  marquee: 'Welcome to Jegajothi Crackers Sivakasi - Direct Factory Price Quality Fireworks!',
  whatsapp_provider: 'none',
  whatsapp_business_phone_number_id: '',
  whatsapp_business_access_token: '',
  whatsapp_ultramsg_instance_id: '',
  whatsapp_ultramsg_token: '',
  whatsapp_template_name: 'order_status_update',
  whatsapp_msg_pending: 'Hello {{customer_name}}, your order {{order_number}} is received and is pending verification. We will contact you shortly to confirm!',
  whatsapp_msg_confirmed: 'Hello {{customer_name}}, your order {{order_number}} is confirmed! We are packaging your crackers now.',
  whatsapp_msg_processing: 'Hello {{customer_name}}, your order {{order_number}} is being processed at our Sivakasi factory.',
  whatsapp_msg_shipped: 'Hello {{customer_name}}, your order {{order_number}} has been shipped! Transport tracking details: {{tracking_info}}',
  whatsapp_msg_delivered: 'Hello {{customer_name}}, your order {{order_number}} has been successfully delivered. Happy and safe celebrating! 🎆',
  whatsapp_msg_cancelled: 'Hello {{customer_name}}, your order {{order_number}} has been cancelled. Please contact support if you have questions.',
};

// GET — Retrieve all settings
export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase')) {
      return NextResponse.json(DEFAULT_SETTINGS);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.from('site_settings').select('key, value');

    if (error) throw error;

    const settings: Record<string, string> = { ...DEFAULT_SETTINGS };
    if (data) {
      data.forEach((row: { key: string; value: string }) => {
        settings[row.key] = row.value;
      });
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error('Error getting settings:', error);
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}

// POST — Update settings (and update all product prices if global_discount changes)
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
    const body = await req.json();

    // Check if global_discount is changing
    let previousDiscount = '60';
    const { data: currentDiscountRow } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'global_discount')
      .single();
    if (currentDiscountRow) {
      previousDiscount = currentDiscountRow.value;
    }

    // Save settings
    const upserts = Object.entries(body).map(([key, value]) => ({
      key,
      value: String(value),
    }));

    if (upserts.length > 0) {
      const { error: upsertError } = await supabase.from('site_settings').upsert(upserts);
      if (upsertError) throw upsertError;
    }

    // Check if global_discount has changed
    const newDiscount = body.global_discount;
    if (newDiscount !== undefined && String(newDiscount) !== String(previousDiscount)) {
      const discountVal = parseInt(String(newDiscount));
      if (!isNaN(discountVal) && discountVal >= 0 && discountVal <= 100) {
        console.log(`Global discount changed from ${previousDiscount}% to ${discountVal}%. Recalculating prices...`);
        
        // Fetch all products
        const { data: products, error: fetchError } = await supabase
          .from('products')
          .select('*');
        
        if (fetchError) throw fetchError;
        
        if (products && products.length > 0) {
          // Perform bulk price updates (keep mrp constant, calculate price from mrp based on new discount)
          const updates = products.map(p => {
            const mrp = p.mrp || 0;
            const price = Math.round(mrp * (1 - discountVal / 100));
            return {
              ...p,
              price,
              discount_percent: discountVal,
              badge_text: discountVal > 0 ? `🔥 ${discountVal}% OFF` : null,
            };
          });

          // Supabase upsert on products table (replaces matching rows by id)
          for (const chunk of chunkArray(updates, 50)) {
            const { error: updateError } = await supabase.from('products').upsert(chunk);
            if (updateError) throw updateError;
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper to chunk arrays for bulk operations
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
