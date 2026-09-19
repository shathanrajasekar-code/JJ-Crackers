'use client';

import React, { useState, useEffect } from 'react';
import { Printer, Download, ArrowLeft, MessageCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import InvoiceView from '@/components/receipt/InvoiceView';
import { formatOrderDate } from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ReceiptDownloadPage({ params }: PageProps) {
  const { id } = React.use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (!res.ok) {
          throw new Error('Order not found or invalid link.');
        }
        const data = await res.json();
        setOrder(data);
      } catch (err: any) {
        setError(err.message || 'Failed to retrieve order details.');
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!order) return;
    setDownloading(true);
    try {
      const { generateReceipt, downloadReceipt } = await import('@/lib/pdf/receiptGenerator');
      
      const orderItems = (order.items || []).map((i: any) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        mrp: i.mrp || Math.round((i.price || 0) / 0.4),
        category: i.category || 'Fireworks'
      }));

      const itemsTotal = orderItems.reduce((sum: number, item: any) => sum + (item.price || 0) * (item.quantity || 0), 0);
      const diff = (order.total_amount || 0) - itemsTotal;
      const calculatedPacking = Math.round(itemsTotal * 0.03);
      const packingCharges = (diff >= calculatedPacking - 2 && diff <= calculatedPacking + 2) ? diff : calculatedPacking;

      const doc = await generateReceipt({
        orderNumber: order.order_number,
        date: formatOrderDate(order.created_at),
        customerName: order.customer_name,
        customerEmail: order.customer_email || '',
        customerPhone: order.customer_phone,
        customerAddress: order.customer_address || '',
        customerCity: order.customer_city || '',
        customerPincode: order.customer_pincode || '',
        customerState: order.customer_state || 'Tamil Nadu',
        customerDistrict: order.customer_district || '',
        items: orderItems,
        subtotal: order.subtotal || (itemsTotal + (order.discount_total || 0)),
        discountTotal: order.discount_total || 0,
        totalAmount: order.total_amount || (itemsTotal + packingCharges),
        packingCharges: packingCharges,
      });

      downloadReceipt(doc, order.order_number);
    } catch (err) {
      console.error('Error generating PDF receipt:', err);
      // Fallback: trigger print dialog which lets user Save as PDF directly
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EFE4C6] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-12 h-12 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#1B2440] font-bold">Retrieving order receipt...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#EFE4C6] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto font-sans">
        <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mb-6 text-rose-600 border border-rose-500/20">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-3 text-[#1B2440]">Unable to Load Receipt</h2>
        <p className="text-stone-600 mb-8 text-sm">{error || 'This receipt link seems to be invalid or has expired.'}</p>
        <Link href="/">
          <button className="px-6 py-3 rounded-full bg-[#1B2A5E] text-[#FFFBEF] text-sm font-bold flex items-center gap-2 hover:bg-[#101B42] transition-colors shadow-lg">
            <ArrowLeft size={16} /> Return to Homepage
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="receipt-page-wrapper">
      {/* Top Floating Action Bar (Hidden on Print) */}
      <div className="no-print sticky top-0 z-50 bg-[#101B42]/95 backdrop-blur-md border-b border-white/10 px-4 py-3 shadow-xl">
        <div className="max-w-[900px] mx-auto flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#FFE685] hover:text-[#FFD400] transition-colors">
            <ArrowLeft size={16} /> Back to Shop
          </Link>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all hover:scale-105 active:scale-95"
            >
              <Printer size={15} /> Print / Save as PDF
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FFD400] to-[#F5A300] text-[#101B42] text-xs font-black transition-all hover:scale-105 active:scale-95 shadow-md disabled:opacity-50"
            >
              <Download size={15} /> {downloading ? 'Preparing...' : 'Download PDF'}
            </button>

            <a
              href={`https://wa.me/917092300252?text=Hi%20JJ%20Crackers%2C%20regarding%20my%20Order%20${order.order_number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              <MessageCircle size={15} /> WhatsApp Support
            </a>
          </div>
        </div>
      </div>

      {/* Single Source of Truth: New JJ Crackers Invoice */}
      <InvoiceView order={order} />
    </div>
  );
}
