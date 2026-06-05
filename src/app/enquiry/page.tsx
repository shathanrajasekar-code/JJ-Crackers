'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEnquiryStore } from '@/lib/store/enquiryStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, PackageOpen, Sparkles, ShoppingCart, CheckCircle2, Mail, Phone, MapPin, User, FileText, Download, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { buildEnquiryMessage, openWhatsApp } from '@/lib/whatsapp';

export default function EnquiryPage() {
  const { items, removeItem, updateQuantity, getTotal, getSavings, clearCart } = useEnquiryStore();
  const [step, setStep] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '', address: '', city: '', pincode: '', state: '', district: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'skipped' | 'failed'>('idle');
  const [emailErrorMessage, setEmailErrorMessage] = useState<string | null>(null);
  const [smsStatus, setSmsStatus] = useState<'idle' | 'sending' | 'sent' | 'skipped' | 'failed'>('idle');
  const [smsErrorMessage, setSmsErrorMessage] = useState<string | null>(null);
  const [whatsappStatus, setWhatsappStatus] = useState<'idle' | 'sending' | 'sent' | 'skipped' | 'failed'>('idle');
  const [whatsappErrorMessage, setWhatsappErrorMessage] = useState<string | null>(null);

  // Monitor order total - if it drops below 2000, force return to Step 1
  useEffect(() => {
    if (getTotal() < 2000 && step > 1 && step < 4) {
      setStep(1);
    }
  }, [items, getTotal, step]);

  const goToStep = (nextStep: number) => {
    setSubmitError(null);
    setStep(nextStep);
  };

  const handlePlaceOrder = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    setSubmitError(null);
    setEmailStatus('idle');
    setEmailErrorMessage(null);
    setSmsStatus('idle');
    setSmsErrorMessage(null);
    setWhatsappStatus('idle');
    setWhatsappErrorMessage(null);
    
    try {
      const orderItems = items.map(item => ({
        name: item.product.name_en, quantity: item.quantity,
        price: item.product.price, mrp: item.product.mrp,
        category: item.product.category,
      }));
      
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerInfo.name, customer_email: customerInfo.email,
          customer_phone: customerInfo.phone, customer_address: customerInfo.address,
          customer_city: customerInfo.city, customer_pincode: customerInfo.pincode,
          customer_state: customerInfo.state, customer_district: customerInfo.district,
          items: orderItems, subtotal: getTotal() + getSavings(),
          discount_total: getSavings(), total_amount: getTotal(),
          payment_method: 'bank_transfer',
        }),
      });
      
      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        throw new Error('Failed to parse server response. The server might be unreachable.');
      }
      
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to place order. Please try again.');
      }
      
      setOrderResult(data);
      setStep(4);
      setEmailStatus('sending');

      // 1. Generate PDF & Prepare Base64
      let pdfBase64Data = null;
      try {
        const { generateReceipt, downloadReceipt } = await import('@/lib/pdf/receiptGenerator');
        const doc = await generateReceipt({
          orderNumber: data.order_number,
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
          customerName: customerInfo.name, customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone, customerAddress: customerInfo.address,
          customerCity: customerInfo.city, customerPincode: customerInfo.pincode,
          customerState: customerInfo.state, customerDistrict: customerInfo.district,
          items: orderItems, subtotal: getTotal() + getSavings(),
          discountTotal: getSavings(), totalAmount: getTotal(),
        });
        
        // Convert to data URI and parse raw base64 data for attachment
        const dataUri = doc.output('datauristring');
        pdfBase64Data = dataUri.split(',')[1];
        
        // Auto-download to client device
        downloadReceipt(doc, data.order_number);
      } catch (pdfErr: any) {
        console.error('PDF generation error:', pdfErr);
        try {
          const { logError } = await import('@/lib/tracking');
          await logError('PDFGenerationError', pdfErr.message || String(pdfErr), pdfErr.stack, { orderNumber: data.order_number });
        } catch (trackErr) {}
      }

      // 2. Dispatch Email (with Base64 PDF attachment)
      fetch('/api/send-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: customerInfo.email, orderNumber: data.order_number,
          customerName: customerInfo.name, items: orderItems,
          totalAmount: getTotal(), subtotal: getTotal() + getSavings(),
          discountTotal: getSavings(),
          pdfBase64: pdfBase64Data,
        }),
      })
      .then(async (emailRes) => {
        const emailData = await emailRes.json();
        if (emailRes.ok) {
          if (emailData.skipped) {
            setEmailStatus('skipped');
          } else {
            setEmailStatus('sent');
          }
        } else {
          setEmailStatus('failed');
          setEmailErrorMessage(emailData.error || 'Mail delivery failed.');
        }
      })
      .catch(err => {
        console.error('Email receipt dispatch error:', err);
        setEmailStatus('failed');
        setEmailErrorMessage(err instanceof Error ? err.message : String(err));
      });

      // 3. Dispatch SMS Confirmation
      setSmsStatus('sending');
      fetch('/api/notify-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: customerInfo.phone,
          orderNumber: data.order_number,
          amount: getTotal(),
          customerName: customerInfo.name
        }),
      })
      .then(async (smsRes) => {
        const smsData = await smsRes.json();
        if (smsRes.ok) {
          if (smsData.status === 'skipped') {
            setSmsStatus('skipped');
          } else {
            setSmsStatus('sent');
          }
        } else {
          setSmsStatus('failed');
          setSmsErrorMessage(smsData.error || 'SMS delivery failed.');
        }
      })
      .catch(err => {
        console.error('SMS dispatch error:', err);
        setSmsStatus('failed');
        setSmsErrorMessage(err instanceof Error ? err.message : String(err));
      });

      // 4. Dispatch WhatsApp Receipt Document
      setWhatsappStatus('sending');
      fetch('/api/notify-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: customerInfo.phone,
          orderNumber: data.order_number,
          customerName: customerInfo.name,
          pdfBase64: pdfBase64Data
        }),
      })
      .then(async (waRes) => {
        const waData = await waRes.json();
        if (waRes.ok) {
          if (waData.status === 'skipped') {
            setWhatsappStatus('skipped');
          } else {
            setWhatsappStatus('sent');
          }
        } else {
          setWhatsappStatus('failed');
          setWhatsappErrorMessage(waData.error || 'WhatsApp delivery failed.');
        }
      })
      .catch(err => {
        console.error('WhatsApp dispatch error:', err);
        setWhatsappStatus('failed');
        setWhatsappErrorMessage(err instanceof Error ? err.message : String(err));
      });

      // 5. Track order placement analytics event
      try {
        const { trackEvent } = await import('@/lib/tracking');
        await trackEvent('order_placed', 'checkout', { orderNumber: data.order_number, totalAmount: getTotal() });
      } catch (trackErr) {}

      clearCart();
    } catch (error: any) {
      console.error('Order error:', error instanceof Error ? error.message : String(error));
      setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred while placing your order. Please try again.');
      
      // Log order creation failure
      try {
        const { logError } = await import('@/lib/tracking');
        await logError('OrderPlacementError', error.message || String(error), error.stack, { customerEmail: customerInfo.email });
      } catch (trackErr) {}
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadReceipt = async () => {
    if (!orderResult) return;
    const orderItems = items.length > 0 ? items.map(i => ({ name: i.product.name_en, quantity: i.quantity, price: i.product.price, mrp: i.product.mrp })) : (orderResult.items || []);
    const { generateReceipt, downloadReceipt } = await import('@/lib/pdf/receiptGenerator');
    const doc = await generateReceipt({
      orderNumber: orderResult.order_number, date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      customerName: orderResult.customer_name || customerInfo.name, customerEmail: orderResult.customer_email || customerInfo.email,
      customerPhone: orderResult.customer_phone || customerInfo.phone, 
      customerAddress: orderResult.customer_address || customerInfo.address,
      customerCity: orderResult.customer_city || customerInfo.city,
      customerPincode: orderResult.customer_pincode || customerInfo.pincode,
      customerState: orderResult.customer_state || customerInfo.state,
      customerDistrict: orderResult.customer_district || customerInfo.district,
      items: orderItems,
      subtotal: orderResult.subtotal || orderResult.total_amount, discountTotal: orderResult.discount_total || 0,
      totalAmount: orderResult.total_amount,
    });
    downloadReceipt(doc, orderResult.order_number);
  };

  // Step 4: Success
  if (step === 4 && orderResult) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.4 }}
          className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
          <CheckCircle2 size={48} className="text-emerald-500" />
        </motion.div>
        
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-3xl font-bold font-display mb-2">Order Placed! 🎆</motion.h2>
        
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-6 w-full mb-6 mt-4">
          <div className="text-sm text-[var(--text-muted)] mb-1">Order Number</div>
          <div className="text-2xl font-bold text-[var(--color-gold)] font-display mb-3">{orderResult.order_number}</div>
          <div className="text-sm text-[var(--text-muted)]">Total: <span className="font-bold text-[var(--text)]">₹{orderResult.total_amount?.toLocaleString('en-IN')}</span></div>
        </motion.div>

        {/* Dynamic Email Delivery Status Banner */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="w-full mb-8">
          {emailStatus === 'sending' && (
            <div className="flex items-center justify-center gap-3 p-4 bg-[var(--surface-high)] border border-[var(--border)] rounded-2xl text-sm text-[var(--text-muted)]">
              <div className="w-4 h-4 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />
              Emailing confirmation receipt...
            </div>
          )}
          {emailStatus === 'sent' && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-sm text-emerald-400 text-left flex gap-3">
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              <div>
                <strong className="block text-emerald-300">Receipt Emailed!</strong>
                Your PDF invoice receipt has been sent to <strong>{customerInfo.email || orderResult.customer_email}</strong>.
              </div>
            </div>
          )}
          {emailStatus === 'skipped' && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-300 text-left space-y-2">
              <div className="flex gap-2.5">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-amber-400" />
                <div>
                  <strong className="block text-amber-400 text-sm">Email Status: Sandbox Mode</strong>
                  The confirmation email was skipped because the Resend API Key is not configured in `.env.local`.
                </div>
              </div>
              <div className="pt-2 border-t border-amber-500/10 text-[10px] text-[var(--text-muted)] space-y-1">
                <span className="font-bold text-amber-400/80 block">NEXT STEPS FOR ADMIN / DEVELOPER:</span>
                <div>1. Get a key at <a href="https://resend.com" target="_blank" className="underline hover:text-amber-400">resend.com</a>.</div>
                <div>2. Set <code className="bg-black/30 px-1 py-0.5 rounded text-amber-300 font-mono">RESEND_API_KEY=your_key</code> in <code className="bg-black/30 px-1 py-0.5 rounded font-mono">.env.local</code>.</div>
              </div>
            </div>
          )}
          {emailStatus === 'failed' && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-sm text-rose-300 text-left flex gap-3">
              <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-450" />
              <div>
                <strong className="block text-rose-400">Email Delivery Interrupted</strong>
                We registered your order but could not send the receipt email.
                {emailErrorMessage && <p className="mt-1 text-xs opacity-80 font-mono">Reason: {emailErrorMessage}</p>}
                <p className="mt-2 text-xs text-rose-450/80">Please click the button below to download your PDF receipt manually.</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Dynamic SMS Confirmation Status Banner */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="w-full mb-4">
          {smsStatus === 'sending' && (
            <div className="flex items-center justify-center gap-3 p-4 bg-[var(--surface-high)] border border-[var(--border)] rounded-2xl text-sm text-[var(--text-muted)]">
              <div className="w-4 h-4 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />
              Sending SMS confirmation...
            </div>
          )}
          {smsStatus === 'sent' && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-sm text-emerald-400 text-left flex gap-3">
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              <div>
                <strong className="block text-emerald-300">SMS Confirmation Sent!</strong>
                A text confirmation has been dispatched to <strong>{customerInfo.phone || orderResult.customer_phone}</strong>.
              </div>
            </div>
          )}
          {smsStatus === 'skipped' && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-300 text-left space-y-2">
              <div className="flex gap-2.5">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-amber-400" />
                <div>
                  <strong className="block text-amber-400 text-sm">SMS Notification: Config Required</strong>
                  Automated SMS dispatch was skipped because no SMS provider is enabled in `.env.local`.
                </div>
              </div>
              <div className="pt-2 border-t border-amber-500/10 text-[10px] text-[var(--text-muted)] space-y-1">
                <span className="font-bold text-amber-400/80 block">NEXT STEPS FOR ADMIN / DEVELOPER:</span>
                <div>1. Select a provider by setting <code className="bg-black/30 px-1 py-0.5 rounded text-amber-300 font-mono">SMS_PROVIDER=fast2sms</code> (or <code className="bg-black/30 px-1 py-0.5 rounded text-amber-300 font-mono">twilio</code>) in <code className="bg-black/30 px-1 py-0.5 rounded font-mono">.env.local</code>.</div>
                <div>2. Register on Fast2SMS and paste your <code className="bg-black/30 px-1 py-0.5 rounded text-amber-300 font-mono">FAST2SMS_API_KEY</code>.</div>
              </div>
            </div>
          )}
          {smsStatus === 'failed' && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-sm text-rose-300 text-left flex gap-3">
              <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-450" />
              <div>
                <strong className="block text-rose-400">SMS Delivery Interrupted</strong>
                We registered your order but could not send the SMS confirmation.
                {smsErrorMessage && <p className="mt-1 text-xs opacity-80 font-mono">Reason: {smsErrorMessage}</p>}
              </div>
            </div>
          )}
        </motion.div>

        {/* Dynamic WhatsApp Receipt Status Banner */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="w-full mb-8">
          {whatsappStatus === 'sending' && (
            <div className="flex items-center justify-center gap-3 p-4 bg-[var(--surface-high)] border border-[var(--border)] rounded-2xl text-sm text-[var(--text-muted)]">
              <div className="w-4 h-4 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />
              Delivering PDF receipt to WhatsApp...
            </div>
          )}
          {whatsappStatus === 'sent' && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-sm text-emerald-400 text-left flex gap-3">
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              <div>
                <strong className="block text-emerald-300">WhatsApp Receipt Delivered!</strong>
                The order receipt has been sent to <strong>{customerInfo.phone || orderResult.customer_phone}</strong>.
              </div>
            </div>
          )}
          {whatsappStatus === 'skipped' && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-300 text-left space-y-2">
              <div className="flex gap-2.5">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-amber-400" />
                <div>
                  <strong className="block text-amber-400 text-sm">WhatsApp Receipt: Config Required</strong>
                  Automated WhatsApp delivery was skipped because no WhatsApp provider is enabled in `.env.local`.
                </div>
              </div>
              <div className="pt-2 border-t border-amber-500/10 text-[10px] text-[var(--text-muted)] space-y-1">
                <span className="font-bold text-amber-400/80 block">NEXT STEPS FOR ADMIN / DEVELOPER:</span>
                <div>1. Enable a provider by setting <code className="bg-black/30 px-1 py-0.5 rounded text-amber-300 font-mono">WHATSAPP_PROVIDER=ultramsg</code> (or <code className="bg-black/30 px-1 py-0.5 rounded text-amber-300 font-mono">whatsapp_business</code>) in <code className="bg-black/30 px-1 py-0.5 rounded font-mono">.env.local</code>.</div>
                <div>2. Register on UltraMsg, link your phone, and paste your credentials.</div>
              </div>
            </div>
          )}
          {whatsappStatus === 'failed' && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-sm text-rose-300 text-left flex gap-3">
              <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-450" />
              <div>
                <strong className="block text-rose-450">WhatsApp Delivery Interrupted</strong>
                We registered your order but could not send the WhatsApp receipt.
                {whatsappErrorMessage && <p className="mt-1 text-xs opacity-80 font-mono">Reason: {whatsappErrorMessage}</p>}
              </div>
            </div>
          )}
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3">
          <motion.button onClick={handleDownloadReceipt} whileHover={{ scale: 1.05 }} className="px-6 py-3 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] font-bold text-sm flex items-center gap-2 hover:border-[var(--color-gold)]">
            <Download size={16} /> Download Receipt
          </motion.button>
          
          <motion.button 
            onClick={() => {
              const orderItems = items.length > 0 ? items : (orderResult.items || []).map((i: any) => ({
                product: { name_en: i.name, price: i.price, mrp: i.mrp, category: i.category },
                quantity: i.quantity
              }));
              const msg = buildEnquiryMessage(
                orderItems,
                orderResult.customer_name || customerInfo.name,
                orderResult.customer_city || customerInfo.city
              );
              const fullMsg = `📋 *Order Ref:* ${orderResult.order_number}\n\n${msg}`;
              openWhatsApp(fullMsg);
            }} 
            whileHover={{ scale: 1.05 }} 
            className="px-6 py-3 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center gap-2 hover:bg-emerald-700 shadow-lg"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="shrink-0">
              <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.76.459 3.48 1.332 5l-1.42 5.19 5.308-1.393c1.472.803 3.125 1.226 4.768 1.226 5.506 0 9.988-4.482 9.988-9.988 0-2.66-1.036-5.16-2.918-7.042A9.925 9.925 0 0 0 12.012 2zm5.82 14.28c-.254.71-1.476 1.39-2.007 1.455-.477.06-1.1.28-3.213-.593-2.706-1.114-4.436-3.886-4.57-4.067-.137-.18-1.085-1.44-1.085-2.75 0-1.31.685-1.954.93-2.22.253-.267.553-.332.738-.332.185 0 .37.005.53.01.173.007.408-.067.637.492.235.57.802 1.954.872 2.094.07.14.116.305.023.49-.092.187-.138.305-.277.468-.138.163-.292.365-.417.49-.138.14-.282.292-.12.57.162.277.72 1.185 1.54 1.914.823.73 1.517.954 1.73 1.062.213.11.338.093.463-.05.125-.143.53-.618.673-.83.143-.21.287-.176.48-.105.195.07 1.237.583 1.45.69.213.106.356.16.408.25.053.09.053.52-.2.1.23z"/>
            </svg>
            Confirm on WhatsApp
          </motion.button>

          <Link href="/products">
            <motion.button whileHover={{ scale: 1.05 }} className="px-6 py-3 rounded-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] text-[#1a1400] font-bold text-sm flex items-center gap-2 shadow-lg">
              Continue Shopping <ArrowRight size={16} />
            </motion.button>
          </Link>
        </div>

        {/* Free Mobile Sharing (WhatsApp & SMS) */}
        <div className="mt-8 pt-6 border-t border-[var(--border)] text-left w-full">
          <h4 className="text-sm font-bold text-[var(--color-gold)] mb-3 uppercase tracking-wider flex items-center gap-2">
            📢 Share Order Details to Customer (100% Free)
          </h4>
          <p className="text-xs text-[var(--text-muted)] mb-4">
            Instantly send the order summary, invoice details, and bank transfer instructions to the customer's phone number using native apps. No API or gateway costs.
          </p>
          <div className="flex flex-wrap gap-3">
            {/* WhatsApp Share to Customer */}
            <motion.button 
              onClick={() => {
                const phone = orderResult?.customer_phone || customerInfo.phone || '';
                const cleanPhone = phone.replace(/[^0-9]/g, '');
                // Prefix 91 if it is a 10 digit Indian number
                const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
                
                const receiptLink = `${window.location.origin}/receipt/${orderResult?.id || ''}`;
                const message = `🎆 *JJ CRACKERS — ORDER CONFIRMED* 🎆\n` +
                  `----------------------------------\n` +
                  `*Order Ref:* ${orderResult?.order_number || 'N/A'}\n` +
                  `*Customer Name:* ${orderResult?.customer_name || customerInfo.name}\n` +
                  `*Total Amount:* ₹${((orderResult?.total_amount || getTotal())).toLocaleString('en-IN')}\n\n` +
                  `📄 *Download Receipt PDF:* ${receiptLink}\n\n` +
                  `🏦 *PAYMENT DETAILS (BANK TRANSFER):*\n` +
                  `• *Name:* Muthuganesa pandian C\n` +
                  `• *Bank:* City Union Bank\n` +
                  `• *A/C:* 500101012011879\n` +
                  `• *IFSC:* CIUB0000162\n` +
                  `• *GPay/PhonePe:* 7092300252\n\n` +
                  `*Action Required:* Please transfer the total amount and send the payment screenshot to support (+91 70923 00252) to confirm dispatch. Thank you! 🎆`;

                const url = targetPhone 
                  ? `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(message)}`
                  : `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
                window.open(url, '_blank', 'noopener,noreferrer');
              }} 
              whileHover={{ scale: 1.02 }}
              className="px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-450 font-bold text-xs flex items-center gap-2 hover:bg-emerald-500/20 transition-colors"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" className="shrink-0 text-emerald-400">
                <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.76.459 3.48 1.332 5l-1.42 5.19 5.308-1.393c1.472.803 3.125 1.226 4.768 1.226 5.506 0 9.988-4.482 9.988-9.988 0-2.66-1.036-5.16-2.918-7.042A9.925 9.925 0 0 0 12.012 2zm5.82 14.28c-.254.71-1.476 1.39-2.007 1.455-.477.06-1.1.28-3.213-.593-2.706-1.114-4.436-3.886-4.57-4.067-.137-.18-1.085-1.44-1.085-2.75 0-1.31.685-1.954.93-2.22.253-.267.553-.332.738-.332.185 0 .37.005.53.01.173.007.408-.067.637.492.235.57.802 1.954.872 2.094.07.14.116.305.023.49-.092.187-.138.305-.277.468-.138.163-.292.365-.417.49-.138.14-.282.292-.12.57.162.277.72 1.185 1.54 1.914.823.73 1.517.954 1.73 1.062.213.11.338.093.463-.05.125-.143.53-.618.673-.83.143-.21.287-.176.48-.105.195.07 1.237.583 1.45.69.213.106.356.16.408.25.053.09.053.52-.2.1.23z"/>
              </svg>
              WhatsApp to Customer
            </motion.button>

            {/* SMS Share to Customer */}
            <motion.button 
              onClick={() => {
                const phone = orderResult?.customer_phone || customerInfo.phone || '';
                const cleanPhone = phone.replace(/[^0-9]/g, '');
                
                const receiptLink = `${window.location.origin}/receipt/${orderResult?.id || ''}`;
                const message = `🎆 JJ CRACKERS ORDER CONFIRMED! 🎆\n` +
                  `Order Ref: ${orderResult?.order_number || 'N/A'}\n` +
                  `Total: Rs. ${((orderResult?.total_amount || getTotal())).toLocaleString('en-IN')}\n\n` +
                  `Download Receipt PDF: ${receiptLink}\n\n` +
                  `🏦 BANK TRANSFER:\n` +
                  `Name: Muthuganesa pandian C\n` +
                  `Bank: City Union Bank\n` +
                  `A/C: 500101012011879\n` +
                  `IFSC: CIUB0000162\n` +
                  `GPay/PhonePe: 7092300252\n\n` +
                  `Please transfer amount & share screenshot to support. Thank you!`;

                const url = `sms:${cleanPhone}?body=${encodeURIComponent(message)}`;
                window.location.href = url;
              }} 
              whileHover={{ scale: 1.02 }}
              className="px-5 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold text-xs flex items-center gap-2 hover:bg-blue-500/20 transition-colors"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-blue-400">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              SMS to Customer
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0 && step < 4) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-28 h-28 bg-[var(--surface-high)] rounded-full flex items-center justify-center mb-6 text-[var(--color-gold)] border border-[var(--border)]">
          <PackageOpen size={56} />
        </motion.div>
        <h2 className="text-3xl font-bold font-display mb-4">Your Cart is Empty</h2>
        <p className="text-[var(--text-muted)] max-w-md mb-8">Explore our premium collection and add products to your cart!</p>
        <Link href="/products"><motion.button whileHover={{ scale: 1.05 }} className="px-8 py-3 rounded-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] text-[#1a1400] font-bold flex items-center gap-2 shadow-lg">Browse Products <ArrowRight size={16} /></motion.button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      {/* Progress Bar */}
      <div className="flex items-center justify-center gap-2 mb-12">
        {['Review Cart', 'Your Details', 'Confirm Order'].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step > i + 1 ? 'bg-emerald-500 text-white' : step === i + 1 ? 'bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] text-[#1a1400]' : 'bg-[var(--surface-high)] text-[var(--text-muted)] border border-[var(--border)]'}`}>
              {step > i + 1 ? <CheckCircle2 size={14} /> : i + 1}
            </div>
            <span className={`text-xs font-bold hidden sm:inline ${step === i + 1 ? 'text-[var(--color-gold)]' : 'text-[var(--text-muted)]'}`}>{label}</span>
            {i < 2 && <div className={`w-12 h-px ${step > i + 1 ? 'bg-emerald-500' : 'bg-[var(--border)]'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Cart Review */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-2 mb-8">
            <Sparkles size={16} className="text-[var(--color-gold)]" />
            <h1 className="text-3xl font-bold font-display">Review Your Cart</h1>
          </div>
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="w-full lg:flex-1 glass-card rounded-2xl overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-[var(--border)] bg-[var(--surface-high)] font-bold text-[10px] text-[var(--text-muted)] uppercase tracking-[0.15em]">
                <div className="col-span-5">Product</div><div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div><div className="col-span-2 text-right">Total</div>
                <div className="col-span-1 text-center">Remove</div>
              </div>
              <div className="divide-y divide-[var(--border)]">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div key={item.product.id} exit={{ opacity: 0, x: -100, height: 0 }} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center">
                      <div className="col-span-1 md:col-span-5 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-[var(--surface-high)] overflow-hidden flex-shrink-0 border border-[var(--border)] flex items-center justify-center">
                          {item.product.image_url ? <img src={item.product.image_url} alt="" className="w-full h-full object-cover" /> : <span className="text-lg opacity-30">🎇</span>}
                        </div>
                        <div><div className="text-[10px] text-[var(--color-gold)] font-bold uppercase tracking-[0.15em]">{item.product.category}</div><h3 className="font-bold text-sm">{item.product.name_en}</h3></div>
                      </div>
                      <div className="col-span-1 md:col-span-2 text-center"><span className="font-bold text-sm">₹{item.product.price}</span><br/><span className="text-[10px] text-[var(--text-muted)] line-through">₹{item.product.mrp}</span></div>
                      <div className="col-span-1 md:col-span-2 flex justify-center">
                        <div className="flex items-center bg-[var(--surface-high)] rounded-lg border border-[var(--border)] overflow-hidden h-8">
                          <button onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))} className="w-7 flex justify-center items-center h-full hover:bg-[var(--surface-highest)]"><Minus size={12} /></button>
                          <div className="w-7 text-center text-xs font-bold border-x border-[var(--border)] h-full flex items-center justify-center">{item.quantity}</div>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 flex justify-center items-center h-full hover:bg-[var(--surface-highest)]"><Plus size={12} /></button>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 text-right"><span className="font-bold text-lg text-[var(--color-gold)]">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span></div>
                      <div className="col-span-1 flex justify-end md:justify-center"><button onClick={() => removeItem(item.product.id)} className="p-2 text-rose-400 hover:bg-rose-400/10 rounded-lg"><Trash2 size={16} /></button></div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
            <div className="w-full lg:w-[380px] sticky top-28">
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold font-display mb-5 border-b border-[var(--border)] pb-3 flex items-center gap-2"><ShoppingCart size={16} className="text-[var(--color-gold)]" /> Order Summary</h3>
                <div className="space-y-3 mb-5 text-sm">
                  <div className="flex justify-between"><span className="text-[var(--text-muted)]">Subtotal ({items.length} items)</span><span className="font-bold">₹{(getTotal() + getSavings()).toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between text-emerald-500 font-bold"><span>Discount</span><span>- ₹{getSavings().toLocaleString('en-IN')}</span></div>
                </div>
                <div className="flex justify-between items-end border-t border-[var(--border)] pt-4 mb-6">
                  <span className="font-bold">Total</span><span className="text-2xl font-bold text-[var(--color-gold)]">₹{getTotal().toLocaleString('en-IN')}</span>
                </div>

                {getTotal() < 2000 && (
                  <div className="flex items-start gap-2.5 text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 mb-5 text-xs text-left">
                    <AlertCircle size={15} className="shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Minimum Order Required</span>
                      <p className="mt-0.5 text-rose-300/80">Minimum order amount is ₹2,000. Please add ₹{(2000 - getTotal()).toLocaleString('en-IN')} more to proceed.</p>
                    </div>
                  </div>
                )}

                <motion.button 
                  onClick={() => getTotal() >= 2000 && goToStep(2)} 
                  disabled={getTotal() < 2000}
                  whileHover={getTotal() >= 2000 ? { scale: 1.02 } : {}} 
                  whileTap={getTotal() >= 2000 ? { scale: 0.98 } : {}}
                  className="w-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] text-[#1a1400] font-bold rounded-xl py-3.5 text-sm shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  Proceed to Details <ArrowRight size={16} />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 2: Customer Details */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl mx-auto">
          <button onClick={() => goToStep(1)} className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--color-gold)] mb-6"><ArrowLeft size={16} /> Back to Cart</button>
          <h1 className="text-3xl font-bold font-display mb-8">Your Details</h1>
          <form onSubmit={(e) => { e.preventDefault(); goToStep(3); }} className="glass-card rounded-2xl p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div><label className="block text-xs font-bold text-[var(--text-muted)] mb-2 uppercase tracking-wider">Full Name *</label>
                <input required value={customerInfo.name} onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} className="w-full bg-[var(--surface-high)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--color-gold)] focus:outline-none transition-all" placeholder="Your Full Name" /></div>
              <div><label className="block text-xs font-bold text-[var(--text-muted)] mb-2 uppercase tracking-wider">Mobile Number *</label>
                <input required type="tel" value={customerInfo.phone} onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})} className="w-full bg-[var(--surface-high)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--color-gold)] focus:outline-none transition-all" placeholder="+91 XXXXX XXXXX" /></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div><label className="block text-xs font-bold text-[var(--text-muted)] mb-2 uppercase tracking-wider">Email Address <span className="text-[var(--text-muted)]/60">(Optional)</span></label>
                <input type="email" value={customerInfo.email} onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})} className="w-full bg-[var(--surface-high)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--color-gold)] focus:outline-none transition-all" placeholder="you@email.com" /></div>
              <div><label className="block text-xs font-bold text-[var(--text-muted)] mb-2 uppercase tracking-wider">State *</label>
                <select required value={customerInfo.state} onChange={(e) => setCustomerInfo({...customerInfo, state: e.target.value})} className="w-full bg-[var(--surface-high)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--color-gold)] focus:outline-none transition-all appearance-none cursor-pointer">
                  <option value="">Select State</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Puducherry">Puducherry</option>
                </select></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div><label className="block text-xs font-bold text-[var(--text-muted)] mb-2 uppercase tracking-wider">District *</label>
                <input required value={customerInfo.district} onChange={(e) => setCustomerInfo({...customerInfo, district: e.target.value})} className="w-full bg-[var(--surface-high)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--color-gold)] focus:outline-none transition-all" placeholder="e.g. Theni, Madurai" /></div>
              <div><label className="block text-xs font-bold text-[var(--text-muted)] mb-2 uppercase tracking-wider">City / Town *</label>
                <input required value={customerInfo.city} onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})} className="w-full bg-[var(--surface-high)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--color-gold)] focus:outline-none transition-all" placeholder="Your City" /></div>
            </div>
            <div><label className="block text-xs font-bold text-[var(--text-muted)] mb-2 uppercase tracking-wider">Full Delivery Address *</label>
              <textarea required rows={3} value={customerInfo.address} onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})} className="w-full bg-[var(--surface-high)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--color-gold)] focus:outline-none transition-all resize-none" placeholder="House No, Street, Area, Landmark" /></div>
            <div className="w-1/3"><label className="block text-xs font-bold text-[var(--text-muted)] mb-2 uppercase tracking-wider">Pincode *</label>
              <input required value={customerInfo.pincode} onChange={(e) => setCustomerInfo({...customerInfo, pincode: e.target.value})} className="w-full bg-[var(--surface-high)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--color-gold)] focus:outline-none transition-all" placeholder="625515" /></div>
            <motion.button type="submit" whileHover={{ scale: 1.02 }} className="w-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] text-[#1a1400] font-bold rounded-xl py-3.5 text-sm shadow-lg flex items-center justify-center gap-2">
              Review Order <ArrowRight size={16} />
            </motion.button>
          </form>
        </motion.div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl mx-auto">
          <button onClick={() => goToStep(2)} className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--color-gold)] mb-6"><ArrowLeft size={16} /> Edit Details</button>
          <h1 className="text-3xl font-bold font-display mb-8">Confirm Your Order</h1>
          
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column: Customer Details */}
                <div>
                  <h3 className="font-bold text-sm text-[var(--color-gold)] uppercase tracking-wider mb-4">Customer Details</h3>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-center gap-2"><User size={14} className="text-[var(--color-gold)]" /> <span className="font-bold">{customerInfo.name}</span></div>
                    <div className="flex items-center gap-2"><Phone size={14} className="text-[var(--color-gold)]" /> {customerInfo.phone}</div>
                    {customerInfo.email && <div className="flex items-center gap-2"><Mail size={14} className="text-[var(--color-gold)]" /> {customerInfo.email}</div>}
                    <div className="flex items-start gap-2 text-[var(--text-muted)] text-xs pt-1">
                      <MapPin size={14} className="text-[var(--color-gold)] shrink-0 mt-0.5" />
                      <span>{[customerInfo.address, customerInfo.city, customerInfo.pincode].filter(Boolean).join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Place of Supply & Transport */}
                <div className="border-t md:border-t-0 md:border-l border-[var(--border)] pt-4 md:pt-0 md:pl-6">
                  <h3 className="font-bold text-sm text-[var(--color-gold)] uppercase tracking-wider mb-4">Place of Supply & Transport</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-[var(--text-muted)]">State:</span><span className="font-bold">{customerInfo.state}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--text-muted)]">District:</span><span className="font-bold">{customerInfo.district}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--text-muted)]">Destination:</span><span>{customerInfo.city}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--text-muted)]">Postal Code:</span><span>{customerInfo.pincode}</span></div>
                    <div className="pt-2 border-t border-[var(--border)] mt-2 text-xs text-[var(--color-gold)] font-bold">
                      📦 Pickup: Nearest Transport Office Hub
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-bold text-sm text-[var(--color-gold)] uppercase tracking-wider mb-4">Order Items ({items.length})</h3>
              {items.map(item => (
                <div key={item.product.id} className="flex justify-between items-center py-2 border-b border-[var(--border)]/50 last:border-0 text-sm">
                  <span>{item.quantity}x {item.product.name_en}</span>
                  <span className="font-bold">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-2">
                <div className="flex justify-between text-sm"><span className="text-[var(--text-muted)]">Subtotal</span><span>₹{(getTotal() + getSavings()).toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between text-sm text-emerald-500"><span>Discount</span><span>-₹{getSavings().toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between text-xl font-bold pt-2 border-t border-[var(--border)]"><span>Total</span><span className="text-[var(--color-gold)]">₹{getTotal().toLocaleString('en-IN')}</span></div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 border-[var(--color-gold)]/30 bg-[var(--color-gold)]/5">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-[var(--color-gold)] shrink-0 mt-0.5" />
                <div><p className="font-bold text-sm text-[var(--text)] mb-1">Please verify all details before confirming</p>
                  <p className="text-xs text-[var(--text-muted)]">Once confirmed, a PDF order receipt will be auto-downloaded.{customerInfo.email ? ` An email confirmation will be sent to ${customerInfo.email}.` : ''}</p></div>
              </div>
            </div>

            {submitError && (
              <div className="flex items-start gap-3 text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 text-left">
                <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-450" />
                <div>
                  <span className="font-bold text-sm">Order Submission Failed</span>
                  <p className="text-xs text-rose-300/80 mt-1">{submitError}</p>
                </div>
              </div>
            )}

            <motion.button onClick={() => setShowConfirmModal(true)} disabled={isSubmitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] text-[#1a1400] font-bold rounded-xl py-4 text-lg shadow-lg flex items-center justify-center gap-3 disabled:opacity-50">
              {isSubmitting ? 'Placing Order...' : <><CheckCircle2 size={20} /> Confirm & Place Order</>}
            </motion.button>
          </div>

          {/* Confirmation Modal */}
          <AnimatePresence>
            {showConfirmModal && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setShowConfirmModal(false)} />
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-md bg-[var(--bg)] rounded-3xl p-8 border border-[var(--border)] shadow-2xl">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-[var(--color-gold)]/10 flex items-center justify-center mx-auto mb-4">
                      <FileText size={28} className="text-[var(--color-gold)]" />
                    </div>
                    <h3 className="text-xl font-bold font-display mb-2">Confirm Order?</h3>
                    <p className="text-sm text-[var(--text-muted)] mb-6">You are about to place an order for <strong className="text-[var(--color-gold)]">₹{getTotal().toLocaleString('en-IN')}</strong>. This action will generate your receipt.</p>
                    <div className="flex gap-3">
                      <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 rounded-xl border border-[var(--border)] text-[var(--text)] font-bold text-sm hover:bg-[var(--surface-high)]">Cancel</button>
                      <motion.button onClick={handlePlaceOrder} whileTap={{ scale: 0.95 }} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] text-[#1a1400] font-bold text-sm shadow-lg">
                        Yes, Place Order
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

