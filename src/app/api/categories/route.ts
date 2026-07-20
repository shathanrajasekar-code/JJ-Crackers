import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

// The definitive 20 categories for JJ Crackers
const DEFAULT_CATEGORIES = [
  { id: 'single-sound', label: 'Single Sound Crackers', emoji: '💥', sort_order: 1 },
  { id: 'ground-chakkars', label: 'Ground Chakkars', emoji: '🌀', sort_order: 2 },
  { id: 'flowerpots', label: 'Flower Pots', emoji: '🌸', sort_order: 3 },
  { id: 'bijili', label: 'Bijili', emoji: '⚡', sort_order: 4 },
  { id: 'thunder-paper-bomb', label: 'Thunder Paper Bomb', emoji: '💣', sort_order: 5 },
  { id: 'thunder-sound-bomb', label: 'Thunder Sound Bomb', emoji: '🔊', sort_order: 6 },
  { id: 'twinkling-star', label: 'Twinkling Star', emoji: '🌟', sort_order: 7 },
  { id: 'sky-jet', label: 'Sky Jet', emoji: '🚀', sort_order: 8 },
  { id: 'pencil-fountains', label: 'Pencil Fountains', emoji: '✏️', sort_order: 9 },
  { id: 'red-chain', label: 'Red Chain Crackers', emoji: '🔗', sort_order: 10 },
  { id: 'nano-fountains', label: 'Nano Fountains', emoji: '⛲', sort_order: 11 },
  { id: 'joy-fountains', label: 'Joy Fountains', emoji: '🎆', sort_order: 12 },
  { id: 'pearl-fountains', label: 'Pearl Fountains', emoji: '💎', sort_order: 13 },
  { id: 'amazing-fountains', label: 'Amazing Fountains', emoji: '✨', sort_order: 14 },
  { id: 'royal-fountains', label: 'Royal Fountains', emoji: '👑', sort_order: 15 },
  { id: 'fancy-novelties', label: 'Fancy Novelties', emoji: '🎭', sort_order: 16 },
  { id: 'multishots', label: 'Multi Shots', emoji: '🎇', sort_order: 17 },
  { id: 'sky-expo-multishots', label: 'Sky Expo Multi Shots (Premium)', emoji: '🏆', sort_order: 18 },
  { id: 'sparklers', label: 'Sparklers', emoji: '✨', sort_order: 19 },
  { id: 'match-box', label: 'Match Box', emoji: '📦', sort_order: 20 },
];

// GET — List categories
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get('admin') === 'true';

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase')) {
      return NextResponse.json(DEFAULT_CATEGORIES);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from('categories')
      .select('id,label,emoji,sort_order')
      .order('sort_order', { ascending: true });

    if (error) throw error;

    const responseHeaders: Record<string, string> = {};
    if (isAdmin) {
      responseHeaders['Cache-Control'] = 'no-store, max-age=0, must-revalidate';
    } else {
      responseHeaders['Cache-Control'] = 'public, s-maxage=30, stale-while-revalidate=300';
    }

    return NextResponse.json(data && data.length > 0 ? data : DEFAULT_CATEGORIES, {
      headers: responseHeaders
    });
  } catch (error: any) {
    console.error('Error getting categories:', error);
    return NextResponse.json(DEFAULT_CATEGORIES);
  }
}

// POST — Add new category
export async function POST(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase')) {
      return NextResponse.json({ error: 'Supabase not configured. Please set SUPABASE_SERVICE_ROLE_KEY in environment.' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await req.json();

    const label = body.label || 'New Category';
    const cleanLabel = typeof label === 'string' ? label : 'New Category';
    const baseId = body.id || cleanLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const id = baseId || 'cat-' + Math.random().toString(36).substring(2, 6);

    const { data, error } = await supabase
      .from('categories')
      .insert({
        id,
        label,
        emoji: body.emoji || '🎆',
        sort_order: Number(body.sort_order || 0),
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error);
    const errMessage = error.message || error.details || (typeof error === 'object' ? JSON.stringify(error) : String(error));
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}

// PUT — Update category
export async function PUT(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase')) {
      return NextResponse.json({ error: 'Supabase not configured. Please set SUPABASE_SERVICE_ROLE_KEY in environment.' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing category ID' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('categories')
      .update({
        label: updateData.label,
        emoji: updateData.emoji,
        sort_order: Number(updateData.sort_order || 0),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error updating category:', error);
    const errMessage = error.message || error.details || (typeof error === 'object' ? JSON.stringify(error) : String(error));
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}

// DELETE — Delete category
export async function DELETE(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase')) {
      return NextResponse.json({ error: 'Supabase not configured. Please set SUPABASE_SERVICE_ROLE_KEY in environment.' }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing category ID' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
