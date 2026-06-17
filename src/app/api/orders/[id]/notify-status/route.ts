import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/admin-auth';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    const { id } = await params;
    const body = await req.json();
    const { status, trackingInfo, sendWhatsApp, sendEmail, customMessage } = body;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase')) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Fetch settings
    const { data: settingsData, error: settingsError } = await supabase
      .from('site_settings')
      .select('key, value');

    const settings: Record<string, string> = {};
    if (settingsData) {
      settingsData.forEach(row => {
        settings[row.key] = row.value;
      });
    }

    const customerName = order.customer_name;
    const orderNumber = order.order_number;
    const customerPhone = order.customer_phone;
    const customerEmail = order.customer_email;
    const cleanStatus = status || order.status;

    let whatsappResult: any = null;
    let emailResult: any = null;

    // ─── 1. WHATSAPP DISPATCH ───
    if (sendWhatsApp && customerPhone) {
      const provider = settings.whatsapp_provider || process.env.WHATSAPP_PROVIDER || 'none';
      let cleanPhone = customerPhone.replace(/[^0-9]/g, '');
      if (cleanPhone.length === 10) {
        cleanPhone = `91${cleanPhone}`;
      }

      if (provider === 'ultramsg') {
        const instanceId = settings.whatsapp_ultramsg_instance_id || process.env.ULTRAMSG_INSTANCE_ID;
        const token = settings.whatsapp_ultramsg_token || process.env.ULTRAMSG_TOKEN;

        if (!instanceId || !token) {
          whatsappResult = { error: 'UltraMsg credentials not configured in settings' };
        } else {
          try {
            const chatUrl = `https://api.ultramsg.com/${instanceId}/messages/chat`;
            const chatRes = await fetch(chatUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: new URLSearchParams({
                token,
                to: cleanPhone,
                body: customMessage || `Order status updated to ${cleanStatus}`
              }).toString()
            });

            const chatData = await chatRes.json();
            if (chatRes.ok && !chatData.error) {
              whatsappResult = { success: true, provider: 'ultramsg', id: chatData.id };
            } else {
              whatsappResult = { error: chatData.error || 'UltraMsg request failed' };
            }
          } catch (waErr: any) {
            whatsappResult = { error: waErr.message || 'UltraMsg connection error' };
          }
        }
      } else if (provider === 'whatsapp_business') {
        const phoneId = settings.whatsapp_business_phone_number_id || process.env.WHATSAPP_BUSINESS_PHONE_NUMBER_ID;
        const token = settings.whatsapp_business_access_token || process.env.WHATSAPP_BUSINESS_ACCESS_TOKEN;
        const templateName = settings.whatsapp_template_name || 'order_status_update';

        if (!phoneId || !token) {
          whatsappResult = { error: 'Meta WhatsApp credentials not configured' };
        } else {
          try {
            const sendUrl = `https://graph.facebook.com/v18.0/${phoneId}/messages`;
            
            // Standard parameters sent to Meta template: Customer Name, Order Number, Status, Tracking/Shipping Info
            const messagePayload = {
              messaging_product: 'whatsapp',
              to: cleanPhone,
              type: 'template',
              template: {
                name: templateName,
                language: {
                  code: 'en_US'
                },
                components: [
                  {
                    type: 'body',
                    parameters: [
                      { type: 'text', text: customerName || 'Customer' },
                      { type: 'text', text: orderNumber },
                      { type: 'text', text: cleanStatus.toUpperCase() },
                      { type: 'text', text: trackingInfo || 'N/A' }
                    ]
                  }
                ]
              }
            };

            const sendRes = await fetch(sendUrl, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(messagePayload)
            });

            const sendData = await sendRes.json();
            if (sendRes.ok && !sendData.error) {
              whatsappResult = { success: true, provider: 'whatsapp_business', message_id: sendData.messages?.[0]?.id };
            } else {
              whatsappResult = { error: sendData.error?.message || 'Meta Cloud API rejected the template dispatch' };
            }
          } catch (waErr: any) {
            whatsappResult = { error: waErr.message || 'Meta API connection error' };
          }
        }
      } else {
        whatsappResult = { skipped: true, message: 'Provider set to none' };
      }
    }

    // ─── 2. EMAIL DISPATCH ───
    if (sendEmail && customerEmail) {
      const apiKey = process.env.RESEND_API_KEY;
      const senderEmail = process.env.SENDER_EMAIL || 'onboarding@resend.dev';

      if (!apiKey || apiKey === 'your_resend_api_key') {
        emailResult = { error: 'Resend API key not configured on server' };
      } else {
        try {
          const resend = new Resend(apiKey);
          const statusColors: Record<string, string> = {
            pending: '#F59E0B',
            confirmed: '#10B981',
            processing: '#3B82F6',
            shipped: '#8B5CF6',
            delivered: '#10B981',
            cancelled: '#EF4444',
          };
          const badgeColor = statusColors[cleanStatus] || '#A0A090';

          const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Order Update — ${orderNumber}</title>
          </head>
          <body style="margin:0;padding:0;background-color:#FAF7F0;font-family:'Inter', Arial, sans-serif;color:#2D241E;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#FAF7F0;padding:20px 10px;">
              <tr>
                <td align="center">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background-color:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.05);border:1px solid #E8E2D1;">
                    <tr>
                      <td style="background:linear-gradient(135deg,#1A1400 0%,#2D2200 100%);padding:30px 24px;text-align:center;">
                        <h1 style="color:#D4AF37;margin:0;font-size:24px;font-weight:800;letter-spacing:2px;">JJ CRACKERS</h1>
                        <p style="color:#F4E296;margin:4px 0 0;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-weight:600;">Premium Sivakasi Fireworks</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:40px 32px;">
                        <div style="text-align:center;margin-bottom:30px;">
                          <span style="background-color:${badgeColor}15;color:${badgeColor};padding:8px 20px;border-radius:100px;font-size:12px;font-weight:800;letter-spacing:1px;text-transform:uppercase;border:1px solid ${badgeColor}40;display:inline-block;">
                            Order ${cleanStatus.toUpperCase()} 🎆
                          </span>
                        </div>
                        <h2 style="margin:0 0 16px;font-size:20px;font-weight:800;color:#1A1400;">Hello ${customerName},</h2>
                        <p style="margin:0 0 24px;font-size:14px;color:#5D5046;line-height:1.6;font-weight:500;">
                          ${customMessage ? customMessage.replace(/\n/g, '<br />') : `We would like to inform you that your order status has been updated to <strong>${cleanStatus.toUpperCase()}</strong>.`}
                        </p>
                        ${trackingInfo ? `
                        <div style="background-color:#FAF7F0;border:1px solid #E8E2D1;border-radius:16px;padding:20px;margin-bottom:30px;">
                          <h4 style="margin:0 0 8px;font-size:12px;font-weight:800;color:#A67C00;text-transform:uppercase;letter-spacing:0.5px;">📦 Dispatch / Tracking Information</h4>
                          <p style="margin:0;font-size:13px;color:#2D241E;line-height:1.5;font-weight:bold;">${trackingInfo}</p>
                        </div>
                        ` : ''}
                        <div style="background-color:#FAF7F0;border:1px solid #E8E2D1;border-radius:16px;padding:20px;margin-bottom:30px;font-size:13px;color:#5D5046;">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td style="padding-bottom:5px;"><strong>Order Number:</strong></td>
                              <td align="right" style="color:#A67C00;font-weight:bold;font-family:monospace;">${orderNumber}</td>
                            </tr>
                            <tr>
                              <td><strong>Total Value:</strong></td>
                              <td align="right" style="color:#1A1400;font-weight:bold;">₹${order.total_amount?.toLocaleString('en-IN')}</td>
                            </tr>
                          </table>
                        </div>
                        <p style="margin:0;font-size:13px;color:#8B735B;line-height:1.5;text-align:center;">
                          If you have any questions, please feel free to reach out to us at our support line: +91 70923 00252.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color:#FAF7F0;border-top:1px solid #E8E2D1;padding:24px;text-align:center;font-size:11px;color:#8B735B;">
                        <p style="margin:0 0 6px;font-weight:700;color:#2D241E;">Jegajothi Crackers (JJ Crackers)</p>
                        <p style="margin:0;">Sivakasi, Tamil Nadu</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
          `;

          const { data, error } = await resend.emails.send({
            from: `JJ Crackers <${senderEmail}>`,
            to: [customerEmail],
            subject: `Order Update — ${orderNumber} [${cleanStatus.toUpperCase()}] | JJ Crackers`,
            html: emailHtml,
          });

          if (error) throw error;
          emailResult = { success: true, emailId: data?.id };
        } catch (emailErr: any) {
          emailResult = { error: emailErr.message || 'Resend failed to send email' };
        }
      }
    }

    return NextResponse.json({
      success: true,
      whatsapp: whatsappResult,
      email: emailResult
    });
  } catch (error: any) {
    console.error('Error in status notification handler:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
