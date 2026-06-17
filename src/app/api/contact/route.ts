import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Name, email, subject, and message are required' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || supabaseUrl.includes('your_supabase')) {
      // Demo mode — return success without DB
      return NextResponse.json({
        id: crypto.randomUUID(),
        name, email, phone, subject, message,
        is_read: false,
        created_at: new Date().toISOString(),
      }, { status: 201 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from('contact_messages')
      .insert({ name, email, phone: phone || null, subject, message })
      .select()
      .single();

    if (error) throw error;

    // Dispatch email notification using Resend
    const apiKey = process.env.RESEND_API_KEY;
    const senderEmail = process.env.SENDER_EMAIL || 'onboarding@resend.dev';

    if (apiKey && apiKey !== 'your_resend_api_key') {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(apiKey);

        // 1. Send confirmation to the client
        await resend.emails.send({
          from: `JJ Crackers <${senderEmail}>`,
          to: [email],
          subject: `We received your message — JJ Crackers`,
          html: `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
              <h2 style="color: #b8860b;">Welcome to JJ Crackers!</h2>
              <p>Hello <strong>${name}</strong>,</p>
              <p>Thank you for reaching out to us. We have received your message regarding "<strong>${subject}</strong>".</p>
              <p>Our team will review your query and respond back to you within 24 hours.</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #777;">This is an automated confirmation. Please do not reply directly to this email.</p>
            </div>
          `
        });

        // 2. Send notification to the admin
        const adminEmail = process.env.ADMIN_EMAIL || 'jjcrackersworld@gmail.com';
        await resend.emails.send({
          from: `JJ Crackers Alerts <${senderEmail}>`,
          to: [adminEmail],
          subject: `New Contact Message: ${subject} | JJ Crackers`,
          html: `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
              <h2 style="color: #d9534f;">New Contact Inquiry</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p style="margin-top: 20px;"><strong>Message:</strong></p>
              <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #b8860b; font-style: italic;">
                ${message.replace(/\n/g, '<br/>')}
              </div>
            </div>
          `
        });
      } catch (emailErr) {
        console.error('Failed to send contact emails:', emailErr);
      }
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Error saving contact message:', error);
    return NextResponse.json({ error: error.message || 'Failed to send message' }, { status: 500 });
  }
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
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json([], { status: 500 });
  }
}
