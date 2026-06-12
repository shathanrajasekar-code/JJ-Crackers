import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || supabaseUrl.includes('your_supabase')) {
      return NextResponse.json({ error_logs: [], analytics_events: [] });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch error logs
    const { data: errorLogs, error: errError } = await supabase
      .from('error_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (errError) throw errError;

    // Fetch analytics events
    const { data: analyticsEvents, error: analError } = await supabase
      .from('analytics_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (analError) throw analError;

    return NextResponse.json({
      error_logs: errorLogs || [],
      analytics_events: analyticsEvents || []
    });
  } catch (error: any) {
    console.error('Error fetching admin tracking stats:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch tracking data' }, { status: 500 });
  }
}
