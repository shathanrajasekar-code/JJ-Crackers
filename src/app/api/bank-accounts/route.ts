import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const DEFAULT_ACCOUNTS = [
  {
    bank_name: 'City union bank',
    branch: 'SATTUR',
    holder_name: 'Muthuganesa pandian C',
    account_number: '500101012011879',
    ifsc_code: 'CIUB0000162',
    gpay_number: '7092300252',
    phonepe_number: '',
  }
];

// GET — List bank accounts
export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase')) {
      return NextResponse.json(DEFAULT_ACCOUNTS);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from('bank_accounts')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error('Error getting bank accounts:', error);
    return NextResponse.json(DEFAULT_ACCOUNTS);
  }
}

// POST — Add new bank account
export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase')) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await req.json();

    const { data, error } = await supabase
      .from('bank_accounts')
      .insert({
        bank_name: body.bank_name,
        branch: body.branch,
        holder_name: body.holder_name,
        account_number: body.account_number,
        ifsc_code: body.ifsc_code,
        gpay_number: body.gpay_number || null,
        phonepe_number: body.phonepe_number || null,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Error creating bank account:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT — Update existing bank account
export async function PUT(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase')) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing account ID' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('bank_accounts')
      .update({
        bank_name: updateData.bank_name,
        branch: updateData.branch,
        holder_name: updateData.holder_name,
        account_number: updateData.account_number,
        ifsc_code: updateData.ifsc_code,
        gpay_number: updateData.gpay_number || null,
        phonepe_number: updateData.phonepe_number || null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error updating bank account:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE — Delete bank account
export async function DELETE(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase')) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing account ID' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase.from('bank_accounts').delete().eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting bank account:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
