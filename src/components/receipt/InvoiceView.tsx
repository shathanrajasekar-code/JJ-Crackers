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
    // If mrp is missing or lower than price, assume standard festival 60% discount mrp = price / 0.4
    const mrp = item.mrp && Number(item.mrp) > netPrice 
      ? Number(item.mrp) 
      : Math.round(netPrice / 0.4);
    const actualTotal = mrp * qty;
    const netTotal = netPrice * qty;
    const discountAmt = Math.max(0, actualTotal - netTotal);
    const offPct = mrp > 0 ? Math.round(((mrp - netPrice) / mrp) * 100) : 60;

    return {
      sno: idx + 1,
      name: item.name,
      quantity: qty,
      mrp,
      actualTotal,
      netPrice,
      netTotal,
      discountAmt,
      offPct: offPct > 0 ? offPct : 60
    };
  });

  // Calculate totals
  const calculatedGross = items.reduce((sum, i) => sum + i.actualTotal, 0);
  const calculatedNet = items.reduce((sum, i) => sum + i.netTotal, 0);
  const calculatedDiscount = calculatedGross - calculatedNet;
  
  // Packing charges 3%
  const packing = order.packingCharges !== undefined 
    ? Number(order.packingCharges) 
    : Math.round(calculatedNet * 0.03);

  const netPayable = order.total_amount 
    ? Number(order.total_amount) 
    : calculatedNet + packing;

  // Average discount percentage
  const avgDiscount = calculatedGross > 0 
    ? Math.round((calculatedDiscount / calculatedGross) * 100) 
    : 60;

  // Format date and time
  const orderDateObj = order.created_at ? new Date(order.created_at) : new Date();
  const formattedDate = orderDateObj.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
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

  return (
    <div className="jj-invoice-root">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;0,9..144,800;1,9..144,500&family=Manrope:wght@400;500;600;700;800&display=swap');

        :root {
          --jj-navy: #1B2A5E;
          --jj-navy-deep: #101B42;
          --jj-red: #C8102E;
          --jj-red-deep: #8C0B20;
          --jj-maroon: #7B2D26;
          --jj-yellow: #FFD400;
          --jj-yellow-soft: #FFE685;
          --jj-marigold: #F5A300;
          --jj-ink: #1B2440;
          --jj-cream: #FFFBEF;
          --jj-sand: #FCEFCB;
          --jj-green: #2F7A45;
          --jj-line: rgba(27,36,64,0.14);
        }

        .jj-invoice-root {
          font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: var(--jj-ink);
          -webkit-font-smoothing: antialiased;
          background: #EFE4C6;
          padding: 24px 16px 48px;
          min-height: 100vh;
        }

        .jj-sheet {
          max-width: 900px;
          margin: 0 auto;
          background: var(--jj-cream);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 50px rgba(16,27,66,0.22), 0 2px 0 rgba(255,255,255,0.6) inset;
          border: 1px solid rgba(27,36,64,0.08);
        }

        /* HEADER */
        .jj-header {
          position: relative;
          background: linear-gradient(135deg, var(--jj-navy-deep) 0%, var(--jj-navy) 60%, #22326B 100%);
          color: var(--jj-cream);
          padding: 30px 40px 26px;
          overflow: hidden;
        }
        .jj-header::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle at 92% 12%, rgba(255,212,0,0.28) 0, transparent 40%),
            radial-gradient(circle at 82% 78%, rgba(200,16,46,0.30) 0, transparent 42%);
          pointer-events: none;
        }
        .jj-header-row {
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }
        .jj-brand {
          display: flex;
          align-items: center;
          gap: 18px;
        }
        .jj-logo-frame {
          width: 78px;
          height: 78px;
          border-radius: 50%;
          background: #fff;
          padding: 4px;
          box-shadow: 0 0 0 4px var(--jj-yellow), 0 8px 18px rgba(0,0,0,0.30);
          flex-shrink: 0;
        }
        .jj-logo-frame img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: block;
          object-fit: cover;
        }
        .jj-brand-name {
          font-family: 'Fraunces', serif;
          font-weight: 800;
          font-size: 29px;
          letter-spacing: 0.4px;
          line-height: 1.05;
          text-transform: uppercase;
        }
        .jj-brand-sub {
          font-size: 12px;
          color: var(--jj-yellow-soft);
          margin-top: 5px;
          font-weight: 700;
          letter-spacing: 0.3px;
        }
        .jj-brand-addr {
          font-size: 11.3px;
          color: rgba(255,251,239,0.78);
          margin-top: 8px;
          line-height: 1.5;
          max-width: 340px;
        }

        .jj-receipt-tag {
          text-align: right;
          position: relative;
        }
        .jj-receipt-tag .jj-kicker {
          font-size: 11px;
          color: var(--jj-yellow-soft);
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .jj-receipt-tag .jj-title {
          font-family: 'Fraunces', serif;
          font-size: 23px;
          font-weight: 700;
          margin-top: 3px;
          letter-spacing: 0.5px;
        }
        .jj-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 10px;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.35);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.4px;
          color: var(--jj-cream);
        }
        .jj-status-pill .jj-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #7CE38B;
          box-shadow: 0 0 0 3px rgba(124,227,139,0.25);
        }

        .jj-spark-strip {
          position: relative;
          height: 14px;
          background: repeating-linear-gradient(90deg, var(--jj-yellow) 0 10px, var(--jj-red) 10px 20px);
        }

        /* DIYA ROW */
        .jj-diya-row {
          display: flex;
          justify-content: center;
          gap: 26px;
          background: var(--jj-sand);
          padding: 10px 10px 4px;
        }
        .jj-diya-row svg {
          width: 32px;
          height: 32px;
        }

        /* META STRIP */
        .jj-meta-strip {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          background: var(--jj-sand);
          padding: 12px 40px 16px;
          gap: 20px;
          border-bottom: 1px dashed rgba(27,36,64,0.25);
        }
        .jj-meta-item {
          flex: 1 1 0;
          min-width: 120px;
        }
        .jj-meta-item .jj-label {
          font-size: 11px;
          color: #8A6A1E;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }
        .jj-meta-item .jj-value {
          font-size: 14.5px;
          font-weight: 700;
          color: var(--jj-ink);
          margin-top: 2px;
        }
        .jj-meta-item .jj-value.jj-accent {
          color: var(--jj-red);
        }
        .jj-meta-item .jj-value.jj-pct {
          color: var(--jj-green);
        }

        /* BODY */
        .jj-body {
          padding: 30px 40px 8px;
        }

        .jj-garland {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-bottom: 26px;
        }
        .jj-garland svg {
          width: 26px;
          height: 26px;
        }

        .jj-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 28px;
        }
        .jj-info-card {
          background: #FFFFFF;
          border: 1px solid var(--jj-line);
          border-radius: 14px;
          padding: 18px 20px;
          position: relative;
        }
        .jj-info-card::before {
          content: "";
          position: absolute;
          left: 0;
          top: 14px;
          bottom: 14px;
          width: 4px;
          background: var(--jj-yellow);
          border-radius: 0 4px 4px 0;
        }
        .jj-info-card h3 {
          font-family: 'Fraunces', serif;
          font-size: 13.5px;
          margin: 0 0 10px;
          color: var(--jj-red);
          text-transform: uppercase;
          letter-spacing: 0.6px;
          font-weight: 600;
        }
        .jj-info-card .jj-name {
          font-weight: 800;
          font-size: 15.5px;
          margin-bottom: 4px;
          color: var(--jj-ink);
        }
        .jj-info-card p {
          margin: 2px 0;
          font-size: 13.5px;
          color: #3C4260;
          line-height: 1.55;
        }
        .jj-info-card .jj-kv {
          display: flex;
          justify-content: space-between;
          font-size: 13.5px;
          padding: 3px 0;
          color: #3C4260;
        }
        .jj-info-card .jj-kv b {
          color: var(--jj-ink);
          font-weight: 700;
        }
        .jj-hub-note {
          margin-top: 10px;
          padding: 7px 10px;
          border-radius: 8px;
          background: rgba(200,16,46,0.08);
          color: var(--jj-red);
          font-size: 12px;
          font-weight: 700;
          display: inline-block;
        }

        /* TABLE */
        .jj-section-label {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 15px;
          color: var(--jj-ink);
          margin: 4px 0 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .jj-section-label svg {
          width: 16px;
          height: 16px;
        }

        table.jj-items {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--jj-line);
          margin-bottom: 8px;
        }
        table.jj-items thead th {
          background: var(--jj-navy-deep);
          color: var(--jj-yellow-soft);
          font-size: 11.2px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 12px 12px;
          text-align: left;
          font-weight: 700;
        }
        table.jj-items thead th.num {
          text-align: right;
        }
        table.jj-items tbody td {
          padding: 12px 12px;
          font-size: 13.4px;
          border-bottom: 1px solid var(--jj-line);
          background: #fff;
        }
        table.jj-items tbody tr:nth-child(even) td {
          background: #FBF6E4;
        }
        table.jj-items tbody tr:last-child td {
          border-bottom: none;
        }
        table.jj-items td.num {
          text-align: right;
          font-variant-numeric: tabular-nums;
        }
        table.jj-items td.strike {
          color: #9AA0B4;
          text-decoration: line-through;
          font-size: 12.6px;
        }
        table.jj-items td.discount {
          color: var(--jj-green);
          font-weight: 700;
        }
        table.jj-items td.pct {
          text-align: right;
        }
        table.jj-items td.pct .chip {
          display: inline-block;
          background: rgba(200,16,46,0.10);
          color: var(--jj-red);
          font-weight: 800;
          font-size: 12px;
          padding: 3px 9px;
          border-radius: 999px;
        }
        table.jj-items td.net {
          font-weight: 800;
          color: var(--jj-red);
        }
        table.jj-items td.snum {
          color: #8A8FA6;
          font-size: 12.5px;
        }
        table.jj-items td.prod {
          font-weight: 700;
        }

        /* TOTALS */
        .jj-totals-wrap {
          display: flex;
          justify-content: flex-end;
          margin: 18px 0 30px;
        }
        .jj-totals {
          width: 340px;
          background: #fff;
          border: 1px solid var(--jj-line);
          border-radius: 14px;
          padding: 16px 20px;
          position: relative;
        }
        .jj-totals .row {
          display: flex;
          justify-content: space-between;
          font-size: 13.5px;
          padding: 5px 0;
          color: #3C4260;
        }
        .jj-totals .row.discount {
          color: var(--jj-green);
          font-weight: 700;
        }
        .jj-totals .row.discount .pct-tag {
          background: var(--jj-green);
          color: #fff;
          font-size: 10.5px;
          font-weight: 800;
          padding: 1px 7px;
          border-radius: 999px;
          margin-left: 6px;
        }
        .jj-totals hr {
          border: none;
          border-top: 1px dashed var(--jj-line);
          margin: 8px 0;
        }
        .jj-totals .net-payable {
          margin-top: 10px;
          padding: 14px 16px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--jj-red) 0%, var(--jj-red-deep) 100%);
          color: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 8px 18px rgba(200,16,46,0.30);
        }
        .net-payable .lbl {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--jj-yellow-soft);
        }
        .net-payable .amt {
          font-family: 'Fraunces', serif;
          font-size: 22px;
          font-weight: 700;
        }

        .jj-thanks {
          text-align: center;
          padding: 6px 0 26px;
        }
        .jj-thanks .burst {
          margin: 0 auto 10px;
          width: 46px;
          height: 46px;
        }
        .jj-thanks h4 {
          font-family: 'Fraunces', serif;
          font-size: 20px;
          margin: 0;
          color: var(--jj-red);
        }
        .jj-thanks p {
          margin: 6px 0 0;
          font-size: 13px;
          color: #6B6350;
          font-style: italic;
        }

        .jj-garland-divider {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2px;
          padding: 0 40px 24px;
        }
        .jj-garland-divider svg {
          width: 24px;
          height: 24px;
          margin: 0 -3px;
        }

        /* PANELS */
        .jj-panels {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          padding: 0 40px 30px;
        }
        .jj-panel {
          background: var(--jj-sand);
          border-radius: 12px;
          padding: 18px 20px;
          border: 1px solid rgba(27,36,64,0.08);
        }
        .jj-panel.safety {
          background: #FDE7E1;
        }
        .jj-panel h4 {
          font-family: 'Fraunces', serif;
          font-size: 13.5px;
          margin: 0 0 12px;
          color: var(--jj-red);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .jj-panel h4 svg {
          width: 15px;
          height: 15px;
        }
        .jj-panel ol {
          margin: 0;
          padding-left: 18px;
        }
        .jj-panel li {
          font-size: 12.2px;
          line-height: 1.65;
          color: #3C4260;
          margin-bottom: 9px;
        }
        .jj-panel li .ta {
          display: block;
          font-size: 11.2px;
          color: #7A7460;
          margin-top: 1px;
        }

        .jj-footer {
          background: var(--jj-navy-deep);
          color: rgba(255,251,239,0.82);
          padding: 20px 40px;
          text-align: center;
          font-size: 12px;
        }
        .jj-footer b {
          color: var(--jj-yellow-soft);
          letter-spacing: 0.6px;
          font-weight: 800;
          font-size: 13.5px;
        }
        .jj-footer .tag {
          margin-top: 4px;
          font-size: 11.3px;
          color: rgba(255,251,239,0.55);
        }

        @media (max-width: 620px) {
          .jj-invoice-root {
            padding: 8px 4px 32px;
          }
          .jj-header {
            padding: 24px 20px 22px;
          }
          .jj-header-row {
            flex-direction: column;
            align-items: flex-start;
          }
          .jj-receipt-tag {
            text-align: left;
          }
          .jj-meta-strip {
            padding: 12px 20px 16px;
            gap: 16px;
          }
          .jj-body {
            padding: 22px 16px 8px;
          }
          .jj-two-col {
            grid-template-columns: 1fr;
          }
          .jj-panels {
            grid-template-columns: 1fr;
            padding: 0 16px 24px;
          }
          .jj-totals {
            width: 100%;
          }
          .jj-garland-divider {
            padding: 0 16px 20px;
            flex-wrap: wrap;
          }
          .jj-footer {
            padding: 18px 16px;
          }
          table.jj-items thead th, table.jj-items tbody td {
            padding: 9px 6px;
            font-size: 11.8px;
          }
          .jj-diya-row {
            gap: 14px;
          }
        }

        @media print {
          body {
            background: #fff !important;
            padding: 0 !important;
          }
          .jj-invoice-root {
            background: #fff !important;
            padding: 0 !important;
            min-height: auto !important;
          }
          .no-print {
            display: none !important;
          }
          .jj-sheet {
            box-shadow: none !important;
            border-radius: 0 !important;
            max-width: 100% !important;
            border: none !important;
          }
          table.jj-items thead {
            display: table-header-group;
          }
          tr {
            page-break-inside: avoid;
          }
        }
      `}</style>

      <div className="jj-sheet" id="jj-invoice-sheet">
        {/* HEADER */}
        <div className="jj-header">
          <div className="jj-header-row">
            <div className="jj-brand">
              <div className="jj-logo-frame">
                <img
                  src="/logo/logo.png"
                  alt="JJ Crackers"
                  onError={(e) => {
                    // Fallback to favicon or text if image is missing
                    (e.target as HTMLImageElement).src = '/favicon.ico';
                  }}
                />
              </div>
              <div>
                <div className="jj-brand-name">JJ Crackers</div>
                <div className="jj-brand-sub">ஜெகஜோதி பட்டாசுகள் · PREMIUM SIVAKASI FIREWORKS</div>
                <div className="jj-brand-addr">
                  1/406, Sivakasi–Vembakottai Main Road, Opp. EB Office, Vembakottai, Tamil Nadu &nbsp;·&nbsp; +91 70923 00252
                </div>
              </div>
            </div>
            <div className="jj-receipt-tag">
              <div className="jj-kicker">Order Receipt</div>
              <div className="jj-title">{order.order_number}</div>
              <div className="jj-status-pill">
                <span className="jj-dot"></span> {order.status ? (order.status.charAt(0).toUpperCase() + order.status.slice(1)) : 'Confirmed'}
              </div>
            </div>
          </div>
        </div>

        <div className="jj-spark-strip"></div>

        {/* DIYAS */}
        <div className="jj-diya-row">
          <svg viewBox="0 0 40 40">
            <path d="M4 26c0 6 7 10 16 10s16-4 16-10c0-3-4-4-8-4H12c-4 0-8 1-8 4Z" fill="#C8102E"/>
            <path d="M20 22c-2-4-1-8 2-11-1 4 1 6 2 8 1 2 0 4-2 5-1-1-2-1-2-2Z" fill="#F5A300"/>
            <ellipse cx="20" cy="26" rx="14" ry="3.5" fill="#FFD400"/>
          </svg>
          <svg viewBox="0 0 40 40">
            <path d="M4 26c0 6 7 10 16 10s16-4 16-10c0-3-4-4-8-4H12c-4 0-8 1-8 4Z" fill="#C8102E"/>
            <path d="M20 21c-2.5-4.5-1-9 2.5-12.5-1 4.5 1.5 7 2.5 9.5 1 2.5 0 4.5-2.5 5.5-1-1-1.5-1.5-2.5-2.5Z" fill="#F5A300"/>
            <ellipse cx="20" cy="26" rx="14" ry="3.5" fill="#FFD400"/>
          </svg>
          <svg viewBox="0 0 40 40">
            <path d="M4 26c0 6 7 10 16 10s16-4 16-10c0-3-4-4-8-4H12c-4 0-8 1-8 4Z" fill="#C8102E"/>
            <path d="M20 22c-2-4-1-8 2-11-1 4 1 6 2 8 1 2 0 4-2 5-1-1-2-1-2-2Z" fill="#F5A300"/>
            <ellipse cx="20" cy="26" rx="14" ry="3.5" fill="#FFD400"/>
          </svg>
        </div>

        {/* META STRIP */}
        <div className="jj-meta-strip">
          <div className="jj-meta-item">
            <div className="jj-label">Order Date</div>
            <div className="jj-value">{formattedDate}</div>
          </div>
          <div className="jj-meta-item">
            <div className="jj-label">Order Time</div>
            <div className="jj-value">{formattedTime}</div>
          </div>
          <div className="jj-meta-item">
            <div className="jj-label">Customer</div>
            <div className="jj-value jj-accent">{order.customer_name}</div>
          </div>
          <div className="jj-meta-item">
            <div className="jj-label">Contact</div>
            <div className="jj-value">+91 {order.customer_phone.replace(/^(\+91|91)/, '')}</div>
          </div>
          <div className="jj-meta-item">
            <div className="jj-label">Discount Applied</div>
            <div className="jj-value jj-pct">{avgDiscount}% OFF</div>
          </div>
        </div>

        <div className="jj-body">
          {/* FLOWER GARLAND */}
          <div className="jj-garland">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <svg key={i} viewBox="0 0 24 24">
                <g fill="#F5A300">
                  <circle cx="12" cy="5" r="3.6"/>
                  <circle cx="12" cy="19" r="3.6"/>
                  <circle cx="5" cy="12" r="3.6"/>
                  <circle cx="19" cy="12" r="3.6"/>
                  <circle cx="7.2" cy="7.2" r="3.6"/>
                  <circle cx="16.8" cy="16.8" r="3.6"/>
                  <circle cx="7.2" cy="16.8" r="3.6"/>
                  <circle cx="16.8" cy="7.2" r="3.6"/>
                </g>
                <circle cx="12" cy="12" r="3.4" fill="#C8102E"/>
              </svg>
            ))}
          </div>

          {/* TWO COLUMNS: CUSTOMER + TRANSPORT */}
          <div className="jj-two-col">
            <div className="jj-info-card">
              <h3>Customer Details</h3>
              <div className="jj-name">{order.customer_name}</div>
              <p>{order.customer_address || 'Address on file'}</p>
              <p>{cityVal}{districtVal !== 'N/A' && districtVal !== cityVal ? `, ${districtVal}` : ''}, {pincodeVal}</p>
              <p>Phone: {order.customer_phone}</p>
              {order.customer_email && <p>Email: {order.customer_email}</p>}
            </div>

            <div className="jj-info-card">
              <h3>Place of Supply &amp; Transport</h3>
              <div className="jj-kv"><span>State</span><b>{stateVal}</b></div>
              <div className="jj-kv"><span>District</span><b>{districtVal}</b></div>
              <div className="jj-kv"><span>Destination</span><b>{cityVal}</b></div>
              <div className="jj-kv"><span>Postal Code</span><b>{pincodeVal}</b></div>
              <span className="jj-hub-note">📍 Pickup: Nearest Transport Office Hub</span>
            </div>
          </div>

          {/* ORDER ITEMS TABLE */}
          <div className="jj-section-label">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2v6M12 2l3 3M12 2 9 5M4 14l3-8 3 8M15 14l3-8 3 8M2 21c1-4 4-6 10-6s9 2 10 6" stroke="#C8102E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Order Items
          </div>

          <table className="jj-items">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Product Description</th>
                <th className="num">Qty</th>
                <th className="num">Actual Price</th>
                <th className="num">Actual Total</th>
                <th className="num">Off %</th>
                <th className="num">Discount</th>
                <th className="num">Net Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.sno}>
                  <td className="snum">{it.sno}</td>
                  <td className="prod">{it.name}</td>
                  <td className="num">{it.quantity}</td>
                  <td className="num strike">Rs. {it.mrp.toLocaleString('en-IN')}</td>
                  <td className="num strike">Rs. {it.actualTotal.toLocaleString('en-IN')}</td>
                  <td className="num pct"><span className="chip">{it.offPct}%</span></td>
                  <td className="num discount">Rs. {it.discountAmt.toLocaleString('en-IN')}</td>
                  <td className="num net">Rs. {it.netTotal.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* TOTALS */}
          <div className="jj-totals-wrap">
            <div className="jj-totals">
              <div className="row">
                <span>Gross Amount (MRP Total)</span>
                <span>Rs. {calculatedGross.toLocaleString('en-IN')}</span>
              </div>
              <div className="row discount">
                <span>Festival Discount<span className="pct-tag">{avgDiscount}% OFF</span></span>
                <span>−Rs. {calculatedDiscount.toLocaleString('en-IN')}</span>
              </div>
              <div className="row">
                <span>Total Value (Net Amount)</span>
                <span>Rs. {calculatedNet.toLocaleString('en-IN')}</span>
              </div>
              <div className="row">
                <span>Packing Charges (3%)</span>
                <span>Rs. {packing.toLocaleString('en-IN')}</span>
              </div>
              <hr />
              <div className="net-payable">
                <span className="lbl">Net Payable</span>
                <span className="amt">Rs. {netPayable.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* THANK YOU */}
          <div className="jj-thanks">
            <svg className="burst" viewBox="0 0 48 48" fill="none">
              <g stroke="#F5A300" strokeWidth="2" strokeLinecap="round">
                <line x1="24" y1="4" x2="24" y2="16"/>
                <line x1="24" y1="32" x2="24" y2="44"/>
                <line x1="4" y1="24" x2="16" y2="24"/>
                <line x1="32" y1="24" x2="44" y2="24"/>
                <line x1="10" y1="10" x2="18" y2="18"/>
                <line x1="30" y1="30" x2="38" y2="38"/>
                <line x1="10" y1="38" x2="18" y2="30"/>
                <line x1="30" y1="18" x2="38" y2="10"/>
              </g>
              <circle cx="24" cy="24" r="5" fill="#C8102E"/>
            </svg>
            <h4>Thank you for choosing us!</h4>
            <p>Celebrate the joy from JJ Crackers.</p>
          </div>
        </div>

        {/* GARLAND DIVIDER */}
        <div className="jj-garland-divider">
          {[...Array(14)].map((_, i) => (
            <svg key={i} viewBox="0 0 24 24">
              <g fill="#F5A300">
                <circle cx="12" cy="5" r="3.6"/>
                <circle cx="12" cy="19" r="3.6"/>
                <circle cx="5" cy="12" r="3.6"/>
                <circle cx="19" cy="12" r="3.6"/>
                <circle cx="7.2" cy="7.2" r="3.6"/>
                <circle cx="16.8" cy="16.8" r="3.6"/>
                <circle cx="7.2" cy="16.8" r="3.6"/>
                <circle cx="16.8" cy="7.2" r="3.6"/>
              </g>
              <circle cx="12" cy="12" r="3.4" fill="#C8102E"/>
            </svg>
          ))}
        </div>

        {/* BILINGUAL TERMS & SAFETY PANELS */}
        <div className="jj-panels">
          <div className="jj-panel">
            <h4>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4M4 6h16v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6Z" stroke="#C8102E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Terms &amp; Conditions
            </h4>
            <ol>
              <li>Goods once booked cannot be cancelled or returned.<span className="ta">பதிவு செய்யப்பட்ட பொருட்கள் திரும்பப் பெறப்பட மாட்டாது.</span></li>
              <li>Delivery is subject to transport service availability.<span className="ta">பொருட்கள் போக்குவரத்து சேவை கிடைக்கும் தன்மையை பொறுத்து விநியோகம் செய்யப்படும்.</span></li>
              <li>Price includes local taxes; transport charges are extra.<span className="ta">விலையில் உள்ளூர் வரிகள் அடங்கும்; போக்குவரத்து கட்டணம் தனி.</span></li>
              <li>Customer must verify goods quantity at transport pickup hub.<span className="ta">போக்குவரத்து மையத்தில் பொருட்களைப் பெறும்போது அளவைச் சரிபார்க்கவும்.</span></li>
            </ol>
          </div>

          <div className="jj-panel safety">
            <h4>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 2 4 5v6c0 5 3.4 8.4 8 11 4.6-2.6 8-6 8-11V5l-8-3Z" stroke="#C8102E" strokeWidth="1.6" strokeLinejoin="round"/>
              </svg>
              Safety Instructions
            </h4>
            <ol>
              <li>Store fireworks in a cool, dry, and secure place.<span className="ta">பட்டாசுகளை குளிர்ந்த, உலர்ந்த இடத்தில் வைக்கவும்.</span></li>
              <li>Maintain safe distance while lighting fireworks.<span className="ta">பட்டாசு பற்றவைக்கும்போது பாதுகாப்பான தூரத்தை பராமரிக்கவும்.</span></li>
              <li>Use an incense stick (Agarbatti) for lighting; avoid open flame.<span className="ta">ஊதுபத்தி பயன்படுத்தவும்; திறந்த சுடரை தவிர்க்கவும்.</span></li>
              <li>Keep a bucket of water nearby for emergencies.<span className="ta">அவசர காலத்திற்கு தண்ணீர் வாலி வைத்திருக்கவும்.</span></li>
              <li>Supervision by adults is mandatory for children.<span className="ta">குழந்தைகளுக்கு பெரியவர்களின் கண்காணிப்பு கட்டாயமாகும்.</span></li>
            </ol>
          </div>
        </div>

        {/* FOOTER */}
        <div className="jj-footer">
          <b>JJ CRACKERS · SIVAKASI</b>
          <div className="tag">Premium Friendly Sivakasi Fireworks Since 2015 · Contact: +91 70923 00252</div>
        </div>
      </div>
    </div>
  );
}
