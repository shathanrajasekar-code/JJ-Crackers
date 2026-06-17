import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || supabaseUrl.includes('your_supabase')) {
      return NextResponse.json({ success: true });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert({ email, name: name || null }, { onConflict: 'email' });

    if (error) throw error;

    // Send welcome email using Resend
    const apiKey = process.env.RESEND_API_KEY;
    const senderEmail = process.env.SENDER_EMAIL || 'onboarding@resend.dev';

    if (apiKey && apiKey !== 'your_resend_api_key') {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(apiKey);

        const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to the JJ Crackers Family</title>
        </head>
        <body style="margin:0;padding:0;background-color:#FAF7F0;font-family:'Inter', Arial, sans-serif;color:#2D241E;-webkit-font-smoothing:antialiased;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#FAF7F0;padding:40px 10px;">
            <tr>
              <td align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background-color:#ffffff;border-radius:28px;overflow:hidden;box-shadow:0 12px 40px rgba(45,36,30,0.05);border:1px solid #E8E2D1;">
                  
                  <!-- Top Banner -->
                  <tr>
                    <td style="background:linear-gradient(135deg,#1A1400 0%,#2D2200 100%);padding:45px 32px;text-align:center;">
                      <h1 style="color:#D4AF37;margin:0;font-size:26px;font-weight:800;letter-spacing:3px;">JJ CRACKERS</h1>
                      <p style="color:#F4E296;margin:8px 0 0;font-size:11px;letter-spacing:4px;text-transform:uppercase;font-weight:600;">Light Up Your Legacy</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding:40px 32px;line-height:1.7;">
                      <p style="margin:0 0 20px;font-size:16px;color:#1A1400;font-weight:700;">Dear Friend, ✨</p>
                      
                      <p style="margin:0 0 20px;font-size:14px;color:#5D5046;font-weight:500;">
                        Thank you from the bottom of our hearts for joining the **JJ Crackers Family**! We are absolutely thrilled to have you with us.
                      </p>
                      
                      <p style="margin:0 0 20px;font-size:14px;color:#5D5046;font-weight:500;">
                        At JJ Crackers, we believe that celebrations are not just about lights in the sky—they are about the warmth in our hearts, the laughter shared with family, and the beautiful memories we weave together. Every sparkler, every flowerpot, and every brilliant shot we manufacture in Sivakasi is crafted with care and safety, designed to make your special moments shine even brighter.
                      </p>
                      
                      <p style="margin:0 0 20px;font-size:14px;color:#5D5046;font-weight:500;">
                        As a member of our inner circle, you will be the first to know about our custom festive assortments, exclusive early-bird discounts, and safety tips to keep your celebrations joyous and safe.
                      </p>

                      <div style="background-color:#FFFDF6;border-left:4px solid #D4AF37;padding:16px 20px;border-radius:0 12px 12px 0;margin:28px 0;font-style:italic;color:#8B735B;font-size:14px;">
                        "Life is like a cracker—full of potential, waiting to burst into brilliant colors. Let us celebrate every spark of joy, together."
                      </div>
                      
                      <p style="margin:0 0 8px;font-size:14px;color:#1A1400;font-weight:700;">With all our love and warm wishes,</p>
                      <p style="margin:0;font-size:14px;color:#A67C00;font-weight:700;">The Jegajothi Crackers Family</p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color:#FAF7F0;border-top:1px solid #E8E2D1;padding:30px;text-align:center;font-size:11px;color:#8B735B;">
                      <p style="margin:0 0 6px;font-weight:700;color:#2D241E;">📍 Jegajothi Crackers (JJ Crackers)</p>
                      <p style="margin:0 0 16px;">Sivakasi, Tamil Nadu, India</p>
                      <p style="margin:0;font-size:10px;color:#A0A090;">You are receiving this because you subscribed to updates on jjcrackersworld.com</p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
        `;

        await resend.emails.send({
          from: `JJ Crackers <${senderEmail}>`,
          to: [email],
          subject: `A warm welcome to the JJ Crackers Family! 🎇`,
          html: emailHtml,
        });
      } catch (emailErr) {
        console.error('Failed to send welcome email:', emailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
