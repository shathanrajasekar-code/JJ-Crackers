'use client';

import React from 'react';

export interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  mrp?: number;
  category?: string;
}

export interface InvoiceOrder {
  id?: string;
  order_number: string;
  created_at?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address?: string;
  customer_city?: string;
  customer_pincode?: string;
  customer_state?: string;
  customer_district?: string;
  items: InvoiceItem[];
  subtotal?: number;
  discount_total?: number;
  total_amount: number;
  packingCharges?: number;
  status?: string;
  notes?: string;
}

interface InvoiceViewProps {
  order: InvoiceOrder;
  showActions?: boolean;
}

export default function InvoiceView({ order }: InvoiceViewProps) {
  // Normalize items
  const items = (order.items || []).map((item, idx) => {
    const qty = Number(item.quantity || 1);
    const netPrice = Number(item.price || 0);
    const mrp = item.mrp && Number(item.mrp) > netPrice 
      ? Number(item.mrp) 
      : Math.round(netPrice / 0.4);
    const actualTotal = mrp * qty;
    const netTotal = netPrice * qty;
    const discountAmt = Math.max(0, actualTotal - netTotal);

    return {
      sno: String(idx + 1).padStart(2, '0'),
      name: item.name,
      quantity: qty,
      mrp,
      actualTotal,
      netPrice,
      netTotal,
      discountAmt,
      category: item.category || 'Crackers'
    };
  });

  // Calculate totals
  const calculatedGross = items.reduce((sum, i) => sum + i.actualTotal, 0);
  const calculatedNet = items.reduce((sum, i) => sum + i.netTotal, 0);
  const calculatedDiscount = Math.max(0, calculatedGross - calculatedNet);
  
  const grossAmount = order.subtotal && order.subtotal > calculatedNet ? order.subtotal : calculatedGross;
  const discountTotal = order.discount_total && order.discount_total > 0 ? order.discount_total : calculatedDiscount;
  const netValue = grossAmount - discountTotal;

  const packing = order.packingCharges !== undefined 
    ? Number(order.packingCharges) 
    : Math.round(netValue * 0.03);

  const netPayable = order.total_amount && Number(order.total_amount) > 0
    ? Number(order.total_amount) 
    : netValue + packing;

  const avgDiscount = grossAmount > 0 
    ? Math.round((discountTotal / grossAmount) * 100) 
    : 60;

  // Format date and time
  const orderDateObj = order.created_at ? new Date(order.created_at) : new Date();
  const formattedDate = orderDateObj.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  const formattedTime = orderDateObj.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const stateVal = order.customer_state || 'Tamil Nadu';
  const districtVal = order.customer_district || 'N/A';
  const cityVal = order.customer_city || 'Sivakasi';
  const pincodeVal = order.customer_pincode || '626123';
  const addressVal = order.customer_address || '';

  const formatRs = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

  return (
    <div className="jj-invoice-root">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap');

        :root {
          --jj-midnight: #101827;
          --jj-navy-deep: #0B1220;
          --jj-navy-surface: #1E293B;
          --jj-gold: #D4A72C;
          --jj-gold-light: #F2C14E;
          --jj-gold-soft: #FDE68A;
          --jj-orange: #F97316;
          --jj-red: #C2410C;
          --jj-crimson: #991B1B;
          --jj-ink: #0F172A;
          --jj-muted: #64748B;
          --jj-light-border: #E2E8F0;
          --jj-subtle-bg: #F8F7F3;
          --jj-green: #16A34A;
        }

        .jj-invoice-root {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: var(--jj-ink);
          -webkit-font-smoothing: antialiased;
          background: #ECE9E1;
          padding: 24px 16px 48px;
          min-height: 100vh;
        }

        .jj-sheet-wrapper {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .jj-page-sheet {
          width: 100%;
          background: #FFFFFF;
          border: 1px solid rgba(16, 24, 39, 0.12);
          border-radius: 4px;
          box-shadow: 0 16px 36px rgba(16, 24, 39, 0.08), 0 2px 4px rgba(16, 24, 39, 0.04);
          overflow: hidden;
          position: relative;
        }

        .jj-page-sheet::before {
          content: "JJ";
          position: absolute;
          top: 48%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-25deg);
          font-family: 'Cinzel', serif;
          font-size: 260px;
          font-weight: 900;
          color: rgba(212, 167, 44, 0.02);
          pointer-events: none;
          z-index: 0;
        }

        .jj-sheet-inner {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          min-height: 100%;
        }

        /* HEADER */
        .jj-header-banner {
          background: linear-gradient(135deg, var(--jj-navy-deep) 0%, var(--jj-midnight) 55%, #182236 100%);
          color: #FFFFFF;
          padding: 22px 28px;
          position: relative;
          border-bottom: 3px solid var(--jj-gold);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }
        .jj-header-banner::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(circle at 95% 20%, rgba(242, 193, 78, 0.18) 0, transparent 45%),
            radial-gradient(circle at 80% 80%, rgba(249, 115, 22, 0.12) 0, transparent 50%);
          pointer-events: none;
        }

        .jj-brand-group {
          display: flex;
          align-items: center;
          gap: 18px;
          position: relative;
          z-index: 1;
        }
        .jj-logo-box {
          width: 74px;
          height: 74px;
          border-radius: 50%;
          background: #FFFFFF;
          padding: 3px;
          box-shadow: 0 0 0 3px var(--jj-gold), 0 6px 16px rgba(0,0,0,0.35);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .jj-logo-box img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: block;
          object-fit: cover;
        }
        .jj-brand-text {
          display: flex;
          flex-direction: column;
        }
        .jj-brand-name {
          font-family: 'Cinzel', serif;
          font-weight: 800;
          font-size: 26px;
          letter-spacing: 1.5px;
          color: #FFFFFF;
          line-height: 1.1;
        }
        .jj-brand-sub {
          font-size: 11.5px;
          color: var(--jj-gold-light);
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-top: 3px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .jj-brand-sub span.tamil {
          font-size: 12px;
          letter-spacing: 0.2px;
          color: #FFFFFF;
          font-weight: 600;
        }
        .jj-brand-contact {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.75);
          margin-top: 5px;
          line-height: 1.45;
        }
        .jj-brand-contact b { color: rgba(255, 255, 255, 0.95); font-weight: 600; }

        .jj-invoice-tag-group {
          text-align: right;
          position: relative;
          z-index: 1;
        }
        .jj-festive-spark-icon {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--jj-gold-light);
          margin-bottom: 2px;
        }
        .jj-festive-spark-icon svg { width: 13px; height: 13px; fill: var(--jj-gold-light); }
        .jj-invoice-title {
          font-family: 'Cinzel', serif;
          font-size: 23px;
          font-weight: 800;
          color: #FFFFFF;
          letter-spacing: 1px;
        }
        .jj-order-number-display {
          font-family: 'JetBrains Mono', monospace;
          font-size: 14.5px;
          font-weight: 700;
          color: var(--jj-gold-soft);
          margin-top: 2px;
          letter-spacing: 0.5px;
        }
        .jj-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-top: 6px;
          padding: 3px 11px;
          border-radius: 999px;
          background: rgba(22, 163, 74, 0.16);
          border: 1px solid rgba(22, 163, 74, 0.45);
          color: #4ADE80;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.6px;
        }
        .jj-status-badge .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4ADE80;
          box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.3);
        }

        .jj-spark-accent-line {
          height: 4px;
          background: linear-gradient(90deg, var(--jj-gold) 0%, var(--jj-orange) 35%, var(--jj-red) 70%, var(--jj-gold) 100%);
        }

        /* ORDER STRIP */
        .jj-order-strip {
          background: var(--jj-subtle-bg);
          border-bottom: 1px solid var(--jj-light-border);
          padding: 10px 28px;
          display: grid;
          grid-template-columns: 1.2fr 1.5fr 1fr 1.2fr;
          gap: 14px;
        }
        .jj-strip-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .jj-strip-icon {
          width: 30px;
          height: 30px;
          border-radius: 7px;
          background: #FFFFFF;
          border: 1px solid var(--jj-light-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--jj-gold);
          flex-shrink: 0;
        }
        .jj-strip-icon svg { width: 15px; height: 15px; stroke-width: 2; }
        .jj-strip-content { display: flex; flex-direction: column; }
        .jj-strip-label {
          font-size: 9.5px;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          font-weight: 700;
          color: var(--jj-muted);
        }
        .jj-strip-val {
          font-size: 12.5px;
          font-weight: 700;
          color: var(--jj-ink);
          margin-top: 1px;
        }
        .jj-strip-val.accent { color: var(--jj-crimson); }
        .jj-strip-val.confirmed { color: var(--jj-green); }

        /* BODY */
        .jj-body-content {
          padding: 18px 28px 22px;
          flex: 1;
        }

        .jj-cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          margin-bottom: 20px;
        }
        .jj-info-panel {
          background: #FFFFFF;
          border: 1px solid var(--jj-light-border);
          border-radius: 7px;
          padding: 14px 18px;
          position: relative;
          border-top: 3px solid var(--jj-gold);
          box-shadow: 0 2px 5px rgba(0,0,0,0.02);
        }
        .jj-panel-header {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: var(--jj-midnight);
          margin-bottom: 8px;
          padding-bottom: 6px;
          border-bottom: 1px dashed var(--jj-light-border);
        }
        .jj-panel-header svg { width: 14px; height: 14px; color: var(--jj-gold); }
        .jj-panel-title-name {
          font-size: 14.5px;
          font-weight: 800;
          color: var(--jj-ink);
          margin-bottom: 4px;
        }
        .jj-panel-detail-row {
          font-size: 12px;
          color: #334155;
          line-height: 1.5;
          display: flex;
          justify-content: space-between;
          margin-bottom: 2px;
        }
        .jj-panel-detail-row span.lbl { color: var(--jj-muted); font-size: 11.5px; }
        .jj-panel-detail-row span.val { font-weight: 600; color: var(--jj-ink); text-align: right; }
        .jj-hub-pill {
          margin-top: 8px;
          padding: 5px 9px;
          border-radius: 5px;
          background: rgba(249, 115, 22, 0.08);
          border: 1px solid rgba(249, 115, 22, 0.25);
          color: #C2410C;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .jj-hub-pill svg { width: 13px; height: 13px; flex-shrink: 0; }

        /* TABLE */
        .jj-table-section-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .jj-table-title-text {
          font-family: 'Cinzel', serif;
          font-size: 14px;
          font-weight: 700;
          color: var(--jj-midnight);
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .jj-table-title-text svg { width: 15px; height: 15px; fill: var(--jj-gold); }
        .jj-table-meta-note {
          font-size: 11px;
          color: var(--jj-muted);
          font-weight: 600;
        }

        table.jj-product-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid var(--jj-light-border);
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 20px;
        }
        table.jj-product-table thead th {
          background: var(--jj-midnight);
          color: var(--jj-gold-soft);
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          padding: 9px 12px;
          border-right: 1px solid rgba(255,255,255,0.08);
        }
        table.jj-product-table thead th:last-child { border-right: none; }
        table.jj-product-table thead th.center { text-align: center; }

        table.jj-product-table tbody td {
          padding: 9px 12px;
          font-size: 12.5px;
          border-bottom: 1px solid var(--jj-light-border);
          border-right: 1px solid rgba(0,0,0,0.04);
          background: #FFFFFF;
          vertical-align: middle;
        }
        table.jj-product-table tbody tr:nth-child(even) td {
          background: #FAFAF7;
        }
        table.jj-product-table tbody tr:last-child td {
          border-bottom: none;
        }
        table.jj-product-table td.center { text-align: center; font-variant-numeric: tabular-nums; }
        table.jj-product-table td.prod-col {
          font-weight: 700;
          color: var(--jj-ink);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .jj-cat-icon {
          width: 22px;
          height: 22px;
          border-radius: 4px;
          background: rgba(212, 167, 44, 0.1);
          color: var(--jj-gold);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .jj-cat-icon svg { width: 13px; height: 13px; }
        table.jj-product-table td.num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #1E293B;
        }
        table.jj-product-table td.regular-price {
          color: #475569;
          font-weight: 500;
        }
        table.jj-product-table td.disc-val {
          color: var(--jj-green);
          font-weight: 700;
        }
        table.jj-product-table td.net-val {
          color: var(--jj-crimson);
          font-weight: 800;
          font-size: 12.5px;
        }

        /* BOTTOM SUMMARY */
        .jj-bottom-summary-grid {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 18px;
          align-items: stretch;
          margin-bottom: 20px;
        }
        .jj-left-summary-box {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 14px;
        }
        .jj-savings-card {
          background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
          border: 1px solid #FCD34D;
          border-radius: 7px;
          padding: 16px 18px;
          position: relative;
          overflow: hidden;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .jj-savings-card::after {
          content: "★";
          position: absolute;
          right: 14px;
          bottom: -8px;
          font-size: 68px;
          color: rgba(245, 158, 11, 0.15);
          pointer-events: none;
        }
        .jj-savings-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #B45309;
        }
        .jj-savings-amount {
          font-family: 'Cinzel', serif;
          font-size: 28px;
          font-weight: 900;
          color: #B45309;
          margin: 4px 0 2px;
        }
        .jj-savings-tagline {
          font-size: 11.5px;
          color: #92400E;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .jj-dispatch-note-box {
          background: #FFFFFF;
          border: 1px solid var(--jj-light-border);
          border-radius: 7px;
          padding: 12px 16px;
          font-size: 11.5px;
          color: var(--jj-muted);
          line-height: 1.45;
        }
        .jj-dispatch-note-box b {
          color: var(--jj-midnight);
          display: block;
          margin-bottom: 2px;
          font-size: 12px;
        }

        .jj-bill-card {
          background: #FFFFFF;
          border: 1px solid var(--jj-light-border);
          border-radius: 7px;
          overflow: hidden;
          box-shadow: 0 3px 10px rgba(0,0,0,0.03);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .jj-bill-rows {
          padding: 12px 18px;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .jj-bill-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12.5px;
          color: #475569;
        }
        .jj-bill-row span.lbl { font-weight: 500; }
        .jj-bill-row span.val {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          color: var(--jj-ink);
        }
        .jj-bill-row.discount-row { color: var(--jj-green); }
        .jj-bill-row.discount-row span.val { color: var(--jj-green); font-weight: 800; }

        .jj-total-payable-banner {
          background: linear-gradient(135deg, var(--jj-navy-deep) 0%, var(--jj-midnight) 70%, #1E293B 100%);
          border-top: 2px solid var(--jj-gold);
          color: #FFFFFF;
          padding: 14px 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          overflow: hidden;
        }
        .jj-tp-label-group { display: flex; flex-direction: column; }
        .jj-tp-title {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          color: var(--jj-gold-light);
        }
        .jj-tp-sub {
          font-size: 9.5px;
          color: rgba(255, 255, 255, 0.65);
          margin-top: 1px;
        }
        .jj-tp-amount {
          font-family: 'Cinzel', serif;
          font-size: 24px;
          font-weight: 900;
          color: #FFFFFF;
          letter-spacing: 0.5px;
          text-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }

        .jj-thankyou-band {
          background: var(--jj-subtle-bg);
          border: 1px dashed rgba(212, 167, 44, 0.4);
          border-radius: 6px;
          padding: 9px 16px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .jj-thankyou-band svg { width: 17px; height: 17px; fill: var(--jj-gold); }
        .jj-thankyou-text {
          font-size: 12px;
          font-weight: 700;
          color: var(--jj-midnight);
          letter-spacing: 0.4px;
        }
        .jj-thankyou-sub {
          font-size: 11px;
          color: var(--jj-muted);
          font-style: italic;
        }

        .jj-sheet-footer {
          background: var(--jj-navy-deep);
          color: rgba(255, 255, 255, 0.7);
          padding: 12px 28px;
          border-top: 2px solid var(--jj-gold);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
        }
        .jj-sheet-footer b { color: var(--jj-gold-light); font-weight: 700; }
        .jj-sheet-footer span.page-num {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 600;
          color: #FFFFFF;
          background: rgba(255,255,255,0.1);
          padding: 2px 8px;
          border-radius: 4px;
        }

        /* PAGE 2 */
        .jj-page2-header {
          background: linear-gradient(135deg, var(--jj-navy-deep) 0%, var(--jj-midnight) 70%, #1E293B 100%);
          color: #FFFFFF;
          padding: 18px 28px;
          border-bottom: 3px solid var(--jj-gold);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .jj-page2-title-group h2 {
          font-family: 'Cinzel', serif;
          font-size: 19px;
          font-weight: 800;
          color: #FFFFFF;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .jj-page2-title-group h2 svg { width: 18px; height: 18px; fill: var(--jj-gold); }
        .jj-page2-title-group p {
          font-size: 11px;
          color: var(--jj-gold-light);
          margin-top: 2px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .jj-safety-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 20px;
        }
        .jj-safety-card {
          background: #FFFFFF;
          border: 1px solid var(--jj-light-border);
          border-radius: 7px;
          padding: 14px 13px;
          position: relative;
          border-top: 3px solid var(--jj-gold);
          box-shadow: 0 2px 5px rgba(0,0,0,0.02);
          display: flex;
          flex-direction: column;
        }
        .jj-safety-num-badge {
          position: absolute;
          top: 10px;
          right: 12px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 800;
          color: rgba(212, 167, 44, 0.4);
        }
        .jj-safety-card-icon {
          width: 34px;
          height: 34px;
          border-radius: 7px;
          background: rgba(212, 167, 44, 0.1);
          color: var(--jj-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 9px;
        }
        .jj-safety-card-icon svg { width: 17px; height: 17px; stroke-width: 2; }
        .jj-safety-card h4 {
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--jj-midnight);
          margin-bottom: 5px;
        }
        .jj-safety-card p.en {
          font-size: 11px;
          color: #475569;
          line-height: 1.4;
          margin-bottom: 3px;
        }
        .jj-safety-card p.ta {
          font-size: 10px;
          color: #64748B;
          line-height: 1.35;
        }

        .jj-notice-panel {
          background: var(--jj-subtle-bg);
          border: 1px solid var(--jj-light-border);
          border-left: 4px solid var(--jj-orange);
          border-radius: 6px;
          padding: 14px 18px;
          margin-bottom: 20px;
        }
        .jj-notice-panel-header {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 11.5px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: var(--jj-red);
          margin-bottom: 8px;
        }
        .jj-notice-panel-header svg { width: 15px; height: 15px; }
        .jj-notice-list {
          list-style: none;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px 18px;
        }
        .jj-notice-list li {
          font-size: 11.5px;
          color: #334155;
          line-height: 1.45;
          position: relative;
          padding-left: 13px;
        }
        .jj-notice-list li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: var(--jj-orange);
          font-weight: bold;
          font-size: 13px;
        }
        .jj-notice-list li span.ta {
          display: block;
          font-size: 10px;
          color: #64748B;
        }

        @media print {
          .jj-invoice-root { background: #FFFFFF !important; padding: 0 !important; }
          .jj-sheet-wrapper { max-width: 100% !important; gap: 0 !important; }
          .jj-page-sheet {
            border: none !important;
            box-shadow: none !important;
            page-break-after: always;
            break-after: page;
          }
          .jj-page-sheet:last-child {
            page-break-after: avoid;
            break-after: avoid;
          }
        }

        @media (max-width: 640px) {
          .jj-header-banner { flex-direction: column; align-items: flex-start; }
          .jj-invoice-tag-group { text-align: left; margin-top: 10px; }
          .jj-order-strip { grid-template-columns: 1fr 1fr; }
          .jj-cards-grid { grid-template-columns: 1fr; }
          .jj-bottom-summary-grid { grid-template-columns: 1fr; }
          .jj-safety-grid { grid-template-columns: 1fr; }
          .jj-notice-list { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="jj-sheet-wrapper" id="jj-invoice-container">
        
        {/* PAGE 1 */}
        <div className="jj-page-sheet" id="jj-invoice-page-1">
          <div className="jj-sheet-inner">
            
            {/* HEADER */}
            <div className="jj-header-banner">
              <div className="jj-brand-group">
                <div className="jj-logo-box">
                  <img src="/logo/logo.png" alt="JJ Crackers Logo" crossOrigin="anonymous" />
                </div>
                <div className="jj-brand-text">
                  <div className="jj-brand-name">JJ CRACKERS</div>
                  <div className="jj-brand-sub">
                    <span>JEGAJOTHI CRACKERS</span>
                    <span>·</span>
                    <span className="tamil">ஜெகஜோதி பட்டாசுகள்</span>
                  </div>
                  <div className="jj-brand-contact">
                    1/406, Sivakasi-Vembakottai Main Road, Opp. EB Office, Vembakottai, Tamil Nadu<br />
                    Phone: <b>+91 70923 00252</b> &nbsp;|&nbsp; Email: <b>jjcrackersworld@gmail.com</b>
                  </div>
                </div>
              </div>

              <div className="jj-invoice-tag-group">
                <div className="jj-festive-spark-icon">
                  <svg viewBox="0 0 24 24"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/></svg>
                  PREMIUM SIVAKASI FIREWORKS
                </div>
                <div className="jj-invoice-title">ORDER INVOICE</div>
                <div className="jj-order-number-display">#{order.order_number}</div>
                <div>
                  <span className="jj-status-badge"><span className="dot"></span> {order.status || 'CONFIRMED'}</span>
                </div>
              </div>
            </div>

            <div className="jj-spark-accent-line"></div>

            {/* SUMMARY STRIP */}
            <div className="jj-order-strip">
              <div className="jj-strip-item">
                <div className="jj-strip-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                </div>
                <div className="jj-strip-content">
                  <span className="jj-strip-label">Order Ref</span>
                  <span className="jj-strip-val">{order.order_number}</span>
                </div>
              </div>

              <div className="jj-strip-item">
                <div className="jj-strip-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <div className="jj-strip-content">
                  <span className="jj-strip-label">Order Date &amp; Time</span>
                  <span className="jj-strip-val">{formattedDate}, {formattedTime}</span>
                </div>
              </div>

              <div className="jj-strip-item">
                <div className="jj-strip-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <div className="jj-strip-content">
                  <span className="jj-strip-label">Order Status</span>
                  <span className="jj-strip-val confirmed">{order.status || 'CONFIRMED'}</span>
                </div>
              </div>

              <div className="jj-strip-item">
                <div className="jj-strip-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div className="jj-strip-content">
                  <span className="jj-strip-label">Destination</span>
                  <span className="jj-strip-val accent">{cityVal.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* BODY */}
            <div className="jj-body-content">
              
              {/* Cards */}
              <div className="jj-cards-grid">
                <div className="jj-info-panel">
                  <div className="jj-panel-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    BILL TO (CUSTOMER INFORMATION)
                  </div>
                  <div className="jj-panel-title-name">{order.customer_name}</div>
                  <div className="jj-panel-detail-row"><span className="lbl">Phone</span><span className="val">{order.customer_phone}</span></div>
                  {order.customer_email && <div className="jj-panel-detail-row"><span className="lbl">Email</span><span className="val">{order.customer_email}</span></div>}
                  {addressVal && <div className="jj-panel-detail-row"><span className="lbl">Address</span><span className="val">{addressVal}</span></div>}
                  <div className="jj-panel-detail-row"><span className="lbl">City / PIN</span><span className="val">{cityVal} - {pincodeVal}</span></div>
                </div>

                <div className="jj-info-panel">
                  <div className="jj-panel-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                    DELIVERY / TRANSPORT LOGISTICS
                  </div>
                  <div className="jj-panel-detail-row"><span className="lbl">State</span><span className="val">{stateVal}</span></div>
                  <div className="jj-panel-detail-row"><span className="lbl">District</span><span className="val">{districtVal}</span></div>
                  <div className="jj-panel-detail-row"><span className="lbl">Destination Hub</span><span className="val">{cityVal} City Central</span></div>
                  <div className="jj-panel-detail-row"><span className="lbl">Postal Code</span><span className="val">{pincodeVal}</span></div>
                  <div className="jj-hub-pill">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    Pickup: Nearest Transport Office Hub
                  </div>
                </div>
              </div>

              {/* TABLE */}
              <div className="jj-table-section-title">
                <div className="jj-table-title-text">
                  <svg viewBox="0 0 24 24"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/></svg>
                  ORDERED FIREWORKS ITEMS
                </div>
                <div className="jj-table-meta-note">Prices include all local taxes &amp; festival discounts</div>
              </div>

              <table className="jj-product-table">
                <thead>
                  <tr>
                    <th className="center" style={{ width: '44px' }}>S.No</th>
                    <th>PRODUCT DESCRIPTION</th>
                    <th className="center" style={{ width: '50px' }}>QTY</th>
                    <th className="center" style={{ width: '105px' }}>ACTUAL PRICE</th>
                    <th className="center" style={{ width: '110px' }}>ACTUAL TOTAL</th>
                    <th className="center" style={{ width: '110px' }}>DISCOUNT</th>
                    <th className="center" style={{ width: '115px' }}>NET TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.sno}>
                      <td className="center" style={{ color: '#64748B', fontWeight: 600 }}>{item.sno}</td>
                      <td className="prod-col">
                        <span className="jj-cat-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        </span>
                        {item.name}
                      </td>
                      <td className="center" style={{ fontWeight: 700 }}>{item.quantity}</td>
                      <td className="center num regular-price">{formatRs(item.mrp)}</td>
                      <td className="center num regular-price">{formatRs(item.actualTotal)}</td>
                      <td className="center num disc-val">{formatRs(item.discountAmt)}</td>
                      <td className="center num net-val">{formatRs(item.netTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* SAVINGS & TOTALS */}
              <div className="jj-bottom-summary-grid">
                <div className="jj-left-summary-box">
                  <div className="jj-savings-card">
                    <div className="jj-savings-header">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      YOU SAVE ON THIS FESTIVE ORDER
                    </div>
                    <div className="jj-savings-amount">{formatRs(discountTotal)}</div>
                    <div className="jj-savings-tagline">
                      <span>🔥 {avgDiscount}% DIRECT SIVAKASI FACTORY OFFER APPLIED</span>
                    </div>
                  </div>

                  <div className="jj-dispatch-note-box">
                    <b>DIRECT SIVAKASI FACTORY DISPATCH</b>
                    All fireworks are manufactured in Sivakasi under strict PESO quality guidelines. Carefully packed in moisture-resistant cartons for safe transport delivery.
                  </div>
                </div>

                <div className="jj-bill-card">
                  <div className="jj-bill-rows">
                    <div className="jj-bill-row">
                      <span className="lbl">Gross Amount (Actual MRP Total)</span>
                      <span className="val">{formatRs(grossAmount)}</span>
                    </div>
                    <div className="jj-bill-row discount-row">
                      <span className="lbl">Festival Discount ({avgDiscount}% OFF)</span>
                      <span className="val">-{formatRs(discountTotal)}</span>
                    </div>
                    <div className="jj-bill-row">
                      <span className="lbl">Net Product Value</span>
                      <span className="val">{formatRs(netValue)}</span>
                    </div>
                    <div className="jj-bill-row">
                      <span className="lbl">Packing &amp; Forwarding (3%)</span>
                      <span className="val">{formatRs(packing)}</span>
                    </div>
                  </div>

                  <div className="jj-total-payable-banner">
                    <div className="jj-tp-label-group">
                      <span className="jj-tp-title">TOTAL PAYABLE AMOUNT</span>
                      <span className="jj-tp-sub">Inclusive of taxes &amp; packaging</span>
                    </div>
                    <div className="jj-tp-amount">{formatRs(netPayable)}</div>
                  </div>
                </div>
              </div>

              {/* THANK YOU */}
              <div className="jj-thankyou-band">
                <svg viewBox="0 0 24 24"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/></svg>
                <span className="jj-thankyou-text">THANK YOU FOR CHOOSING JJ CRACKERS!</span>
                <span className="jj-thankyou-sub">"Celebrate the joy from JJ Crackers."</span>
              </div>

            </div>

            {/* FOOTER */}
            <div className="jj-sheet-footer">
              <div><b>JJ CRACKERS</b> · Licensed Under Explosives Act, 1884 · Sivakasi Direct Factory Outlet</div>
              <div>Page <span className="page-num">1 of 2</span></div>
            </div>

          </div>
        </div>

        {/* PAGE 2 */}
        <div className="jj-page-sheet" id="jj-invoice-page-2">
          <div className="jj-sheet-inner">

            <div className="jj-page2-header">
              <div className="jj-page2-title-group">
                <h2>
                  <svg viewBox="0 0 24 24"><path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z"/></svg>
                  FIREWORKS SAFETY &amp; CELEBRATION GUIDE
                </h2>
                <p>Celebrate beautifully. Celebrate responsibly. Follow Sivakasi standard safety protocols.</p>
              </div>
              <div>
                <span className="jj-status-badge" style={{ color: '#FDE68A', borderColor: 'rgba(253,230,138,0.4)', background: 'rgba(253,230,138,0.1)' }}>
                  SAFETY FIRST
                </span>
              </div>
            </div>

            <div className="jj-spark-accent-line"></div>

            <div className="jj-body-content">
              
              <div className="jj-safety-grid">
                <div className="jj-safety-card">
                  <span className="jj-safety-num-badge">01</span>
                  <div className="jj-safety-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M3 9h18"/></svg>
                  </div>
                  <h4>STORE SAFELY</h4>
                  <p className="en">Store fireworks in a cool, dry, ventilated area away from heat sources.</p>
                  <p className="ta">பட்டாசுகளை குளிர்ந்த, உலர்ந்த மற்றும் பாதுகாப்பான இடத்தில் வைக்கவும்.</p>
                </div>

                <div className="jj-safety-card">
                  <span className="jj-safety-num-badge">02</span>
                  <div className="jj-safety-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
                  </div>
                  <h4>KEEP A SAFE DISTANCE</h4>
                  <p className="en">Maintain at least 5 meters distance after lighting aerial items and ground chakkars.</p>
                  <p className="ta">பட்டாசு பற்றவைத்த பிறகு பாதுகாப்பான தூரத்திற்கு செல்லவும்.</p>
                </div>

                <div className="jj-safety-card">
                  <span className="jj-safety-num-badge">03</span>
                  <div className="jj-safety-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  </div>
                  <h4>USE PROPER LIGHTING</h4>
                  <p className="en">Always use an incense stick (agarbatti) or sparkler to ignite. Never use open flame.</p>
                  <p className="ta">பற்றவைக்க ஊதுபத்தியை பயன்படுத்தவும்; திறந்த சுடரை தவிர்க்கவும்.</p>
                </div>

                <div className="jj-safety-card">
                  <span className="jj-safety-num-badge">04</span>
                  <div className="jj-safety-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                  </div>
                  <h4>KEEP WATER NEARBY</h4>
                  <p className="en">Keep a bucket of clean water or sand readily available for emergency use.</p>
                  <p className="ta">அவசர காலத்திற்கு அருகில் ஒரு வாலி தண்ணீரை எப்போதும் வைத்திருக்கவும்.</p>
                </div>

                <div className="jj-safety-card">
                  <span className="jj-safety-num-badge">05</span>
                  <div className="jj-safety-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <h4>ADULT SUPERVISION</h4>
                  <p className="en">Children must light fireworks only under continuous adult guidance and care.</p>
                  <p className="ta">குழந்தைகள் பட்டாசுகளை பெரியவர்களின் மேற்பார்வையில் மட்டுமே வெடிக்க வேண்டும்.</p>
                </div>

                <div className="jj-safety-card">
                  <span className="jj-safety-num-badge">06</span>
                  <div className="jj-safety-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
                  </div>
                  <h4>RESPONSIBLE CELEBRATION</h4>
                  <p className="en">Dispose of spent fireworks in water buckets before discarding. Respect your neighbors.</p>
                  <p className="ta">பாதுகாப்பு விதிகளை பின்பற்றி பிறருக்கு இடையூறின்றி மகிழ்ச்சியுடன் கொண்டாடவும்.</p>
                </div>
              </div>

              <div className="jj-notice-panel">
                <div className="jj-notice-panel-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  IMPORTANT CUSTOMER NOTICE &amp; DISPATCH TERMS (விதிகளும் நிபந்தனைகளும்)
                </div>
                <ul className="jj-notice-list">
                  <li>
                    <b>Booking Cancellation:</b> Goods once booked cannot be cancelled or returned under any circumstances.
                    <span className="ta">பதிவு செய்யப்பட்ட ஆர்டர்கள் எக்காரணம் கொண்டும் ரத்து செய்யப்பட மாட்டாது.</span>
                  </li>
                  <li>
                    <b>Transport Service:</b> Delivery is subject to regional transport partner service and truck availability.
                    <span className="ta">பொருட்கள் போக்குவரத்து சேவை கிடைக்கும் தன்மையைப் பொறுத்து விநியோகம் செய்யப்படும்.</span>
                  </li>
                  <li>
                    <b>Transport Charges:</b> Quoted prices include local taxes; freight &amp; transport hub handling charges are payable at hub.
                    <span className="ta">போக்குவரத்து மைய கட்டணம் வாடிக்கையாளரால் நேரடியாக செலுத்தப்பட வேண்டும்.</span>
                  </li>
                  <li>
                    <b>Parcel Verification:</b> Customers must verify physical box count and seals at the transport delivery hub before taking delivery.
                    <span className="ta">போக்குவரத்து மையத்தில் பார்சல்களைப் பெறும்போது பெட்டிகளின் எண்ணிக்கையை சரிபார்க்கவும்.</span>
                  </li>
                </ul>
              </div>

              <div style={{ background: '#FFFFFF', border: '1px solid var(--jj-light-border)', borderRadius: '7px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: 'Cinzel, serif', fontSize: '15.5px', fontWeight: 800, color: 'var(--jj-midnight)' }}>JJ CRACKERS · JEGAJOTHI CRACKERS</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--jj-muted)', marginTop: '2px' }}>
                    Premium Sivakasi Fireworks Factory Outlet · Sivakasi-Vembakottai Main Road, Vembakottai, Tamil Nadu
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--jj-crimson)' }}>Phone: +91 70923 00252</div>
                  <div style={{ fontSize: '11px', color: 'var(--jj-muted)' }}>Email: jjcrackersworld@gmail.com</div>
                </div>
              </div>

            </div>

            <div className="jj-sheet-footer">
              <div><b>JJ CRACKERS</b> · "Celebrate the joy. Celebrate responsibly."</div>
              <div>Page <span className="page-num">2 of 2</span></div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
