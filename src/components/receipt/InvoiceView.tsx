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

const LOGO_DATA_URI = 'data:image/png;base64,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';

function paginateItems<T>(items: T[]): { pageType: string; items: T[]; showSummary: boolean }[] {
  const total = items.length;
  if (total <= 8) {
    return [{ pageType: 'first-and-final', items, showSummary: true }];
  }

  const pages: { pageType: string; items: T[]; showSummary: boolean }[] = [];
  const remaining = [...items];

  let page1Count = 12;
  if (total <= 14) {
    page1Count = Math.ceil(total / 2);
  }

  pages.push({
    pageType: 'first',
    items: remaining.splice(0, page1Count),
    showSummary: false,
  });

  while (remaining.length > 0) {
    if (remaining.length <= 14) {
      pages.push({
        pageType: 'continuation-with-summary',
        items: remaining.splice(0, remaining.length),
        showSummary: true,
      });
    } else if (remaining.length <= 22) {
      const count = Math.ceil(remaining.length / 2);
      pages.push({
        pageType: 'continuation',
        items: remaining.splice(0, count),
        showSummary: false,
      });
    } else {
      pages.push({
        pageType: 'continuation',
        items: remaining.splice(0, 18),
        showSummary: false,
      });
    }
  }

  if (!pages.some(p => p.showSummary)) {
    pages[pages.length - 1].showSummary = true;
  }

  return pages;
}

export default function InvoiceView({ order, showActions = true }: InvoiceViewProps) {
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
      category: item.category || 'Crackers',
    };
  });

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

  const orderDateObj = order.created_at ? new Date(order.created_at) : new Date();
  const formattedDate = orderDateObj.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const formattedTime = orderDateObj.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // Customer location: strictly from customer data (never default to Sivakasi!)
  const customerCity = order.customer_city ? order.customer_city.trim() : '';
  const customerPincode = order.customer_pincode ? order.customer_pincode.trim() : '';
  const customerDistrict = order.customer_district && order.customer_district.trim() !== customerCity ? order.customer_district.trim() : '';
  const customerState = order.customer_state ? order.customer_state.trim() : '';
  const customerAddress = order.customer_address ? order.customer_address.trim() : '';

  let cityPinStr = 'N/A';
  if (customerCity && customerPincode) {
    cityPinStr = `${customerCity} - ${customerPincode}`;
  } else if (customerCity) {
    cityPinStr = customerCity;
  } else if (customerPincode) {
    cityPinStr = `PIN: ${customerPincode}`;
  }
  if (customerDistrict && cityPinStr !== 'N/A') {
    cityPinStr += ` (${customerDistrict})`;
  }

  const stateMap: Record<string, string> = {
    'tamil nadu': 'TN',
    'tamilnadu': 'TN',
    'kerala': 'KL',
    'karnataka': 'KA',
    'andhra pradesh': 'AP',
    'telangana': 'TS',
    'maharashtra': 'MH',
    'delhi': 'DL',
    'puducherry': 'PY',
  };
  const stateCode = customerState ? (stateMap[customerState.trim().toLowerCase()] || (customerState.trim().length <= 3 ? customerState.trim().toUpperCase() : '')) : '';
  const topCityDisplay = customerCity
    ? `${customerCity.toUpperCase()}${stateCode ? ', ' + stateCode : ''}`
    : 'FESTIVAL ORDER';

  const formatRs = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

  const invoicePages = paginateItems(items);
  const totalPages = invoicePages.length + 1; // +1 for the dedicated Safety Guide final page

  return (
    <div className="jj-invoice-root">
      <style jsx global>{`
        
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap');

  :root {
    --midnight: #101827;
    --navy-deep: #0B1220;
    --navy-surface: #1E293B;
    --gold: #D4A72C;
    --gold-light: #F2C14E;
    --gold-soft: #FDE68A;
    --orange: #F97316;
    --red: #C2410C;
    --crimson: #991B1B;
    --ink: #0F172A;
    --muted: #64748B;
    --light-border: #E2E8F0;
    --subtle-bg: #F8F7F3;
    --green: #16A34A;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: var(--ink);
    -webkit-font-smoothing: antialiased;
    background: #ECE9E1;
    padding: 30px 16px;
  }

  .invoice-wrapper {
    max-width: 860px;
    margin: 0 auto;
  }

  /* Page Sheet styling */
  .page-sheet {
    width: 860px;
    min-height: 1216px;
    background: #FFFFFF;
    margin: 0 auto 36px;
    box-shadow: 0 12px 35px rgba(0,0,0,0.1);
    border-radius: 6px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    overflow: hidden;
  }

  .sheet-inner {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  /* Header Banner */
  .header-banner {
    background: linear-gradient(135deg, var(--midnight) 0%, #1a2333 60%, #151e2e 100%);
    color: #FFFFFF;
    padding: 22px 28px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    overflow: hidden;
  }

  .header-banner::before {
    content: "";
    position: absolute;
    right: -40px;
    top: -40px;
    width: 220px;
    height: 220px;
    background: radial-gradient(circle, rgba(212, 167, 44, 0.15) 0%, transparent 70%);
    pointer-events: none;
  }

  .header-banner.continuation {
    padding: 16px 28px;
  }

  .brand-group {
    display: flex;
    align-items: center;
    gap: 18px;
    position: relative;
    z-index: 1;
  }

  .logo-box {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: #FFFFFF;
    padding: 2px;
    box-shadow: 0 0 0 3px var(--gold), 0 4px 14px rgba(0,0,0,0.35);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo-box.small {
    width: 52px;
    height: 52px;
  }

  .logo-box img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: block;
    object-fit: cover;
  }

  .brand-text {
    display: flex;
    flex-direction: column;
  }

  .brand-name {
    font-family: 'Cinzel', serif;
    font-weight: 800;
    font-size: 25px;
    letter-spacing: 1.5px;
    color: #FFFFFF;
    line-height: 1.1;
  }

  .brand-sub {
    font-size: 11.5px;
    color: var(--gold-light);
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-top: 3px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .brand-sub span.tamil {
    font-size: 12px;
    letter-spacing: 0.2px;
    color: #FFFFFF;
    font-weight: 600;
  }

  .brand-contact {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.75);
    margin-top: 5px;
    line-height: 1.45;
  }

  .brand-contact b { color: rgba(255, 255, 255, 0.95); font-weight: 600; }

  /* Invoice Tag (Right) */
  .invoice-tag-group {
    text-align: right;
    position: relative;
    z-index: 1;
  }

  .festive-spark-icon {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--gold-light);
    margin-bottom: 2px;
  }

  .festive-spark-icon svg { width: 13px; height: 13px; fill: var(--gold); }

  .invoice-title {
    font-family: 'Cinzel', serif;
    font-size: 22px;
    font-weight: 800;
    letter-spacing: 2px;
    color: #FFFFFF;
    line-height: 1.1;
  }

  .invoice-title.small {
    font-size: 17px;
    letter-spacing: 1.5px;
  }

  .order-number-display {
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    font-weight: 700;
    color: var(--gold-soft);
    letter-spacing: 0.5px;
    margin-top: 3px;
  }

  .order-number-display.small {
    font-size: 13px;
  }

  .status-badge {
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

  .status-badge .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #4ADE80;
    box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.3);
  }

  /* Spark Gradient Accent Line */
  .spark-accent-line {
    height: 4px;
    background: linear-gradient(90deg, var(--gold) 0%, var(--orange) 35%, var(--red) 70%, var(--gold) 100%);
  }

  /* Order Summary Strip */
  .order-strip {
    background: var(--subtle-bg);
    border-bottom: 1px solid var(--light-border);
    padding: 10px 28px;
    display: grid;
    grid-template-columns: 1.2fr 1.5fr 1fr 1.2fr;
    gap: 14px;
  }

  .strip-item {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .strip-icon {
    width: 30px;
    height: 30px;
    border-radius: 7px;
    background: #FFFFFF;
    border: 1px solid var(--light-border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gold);
    flex-shrink: 0;
  }

  .strip-icon svg { width: 15px; height: 15px; stroke-width: 2; }
  .strip-content { display: flex; flex-direction: column; }
  .strip-label {
    font-size: 9.5px;
    text-transform: uppercase;
    letter-spacing: 0.7px;
    font-weight: 700;
    color: var(--muted);
  }
  .strip-val {
    font-size: 12.5px;
    font-weight: 700;
    color: var(--ink);
    margin-top: 1px;
  }
  .strip-val.accent { color: var(--crimson); }
  .strip-val.confirmed { color: var(--green); }

  /* Body Content */
  .body-content {
    padding: 16px 28px 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  /* Customer Information Card (Full Width) */
  .customer-card {
    background: #FFFFFF;
    border: 1px solid var(--light-border);
    border-radius: 8px;
    padding: 12px 18px 14px;
    position: relative;
    border-top: 3px solid var(--gold);
    box-shadow: 0 2px 5px rgba(0,0,0,0.02);
    margin-bottom: 16px;
  }

  .card-header-bar {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: var(--midnight);
    margin-bottom: 10px;
    padding-bottom: 6px;
    border-bottom: 1px dashed var(--light-border);
  }

  .card-header-bar svg { width: 14px; height: 14px; color: var(--gold); }

  .customer-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: 8px;
    column-gap: 32px;
  }

  .cust-field {
    display: flex;
    flex-direction: column;
  }

  .cust-field.full-width {
    grid-column: 1 / -1;
    margin-top: 2px;
    padding-top: 6px;
    border-top: 1px solid #F1F5F9;
  }

  .cust-label {
    font-size: 9.5px;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    font-weight: 700;
    color: var(--muted);
    margin-bottom: 2px;
  }

  .cust-val {
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
    line-height: 1.4;
  }

  .cust-val.name {
    font-size: 15px;
    font-weight: 800;
    color: var(--midnight);
  }

  .cust-val.phone {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    color: var(--ink);
  }

  /* Product Table */
  .table-section-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .table-title-text {
    font-family: 'Cinzel', serif;
    font-size: 14px;
    font-weight: 700;
    color: var(--midnight);
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .table-title-text svg { width: 14px; height: 14px; fill: var(--gold); }

  .table-subtitle {
    font-size: 10.5px;
    color: var(--muted);
    font-weight: 500;
  }

  .product-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    border: 1px solid var(--light-border);
    border-radius: 7px;
    overflow: hidden;
    margin-bottom: 16px;
  }

  .product-table th {
    background: var(--midnight);
    color: #FFFFFF;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    padding: 10px 10px;
    border: none;
  }

  .product-table th.center, .product-table td.center { text-align: center; }
  .product-table th.left, .product-table td.left { text-align: left; }
  .product-table th.right, .product-table td.right { text-align: right; }

  .product-table td {
    padding: 9px 10px;
    font-size: 12px;
    border-bottom: 1px solid var(--light-border);
    background: #FFFFFF;
    vertical-align: middle;
  }

  .product-table tr:nth-child(even) td {
    background: #FCFBFA;
  }

  .product-table tr:last-child td {
    border-bottom: none;
  }

  .sno-col {
    color: #64748B;
    font-weight: 600;
  }

  .prod-col {
    font-weight: 600;
    color: var(--ink);
    word-break: break-word;
    line-height: 1.4;
  }

  .prod-bullet {
    display: inline-block;
    margin-right: 6px;
    font-size: 12px;
    vertical-align: middle;
  }

  .qty-col {
    font-weight: 700;
    color: var(--midnight);
  }

  .regular-price {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 600;
    color: #1E293B;
  }

  .disc-val {
    font-family: 'JetBrains Mono', monospace;
    color: var(--green);
    font-weight: 700;
  }

  .net-val {
    font-family: 'JetBrains Mono', monospace;
    color: var(--crimson);
    font-weight: 800;
  }

  /* Bottom Financial Summary Grid */
  .bottom-summary-grid {
    display: grid;
    grid-template-columns: 1fr 1.15fr;
    gap: 18px;
    margin-top: 4px;
    margin-bottom: 16px;
    align-items: stretch;
  }

  .signatory-card {
    background: #FFFFFF;
    border: 1px solid var(--light-border);
    border-radius: 8px;
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    border-top: 3px solid var(--gold);
    box-shadow: 0 2px 5px rgba(0,0,0,0.02);
  }

  .signatory-title {
    font-family: 'Cinzel', serif;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1.2px;
    color: var(--midnight);
    text-transform: uppercase;
  }

  .signatory-logo-wrap {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: #FFFFFF;
    padding: 2px;
    box-shadow: 0 0 0 2.5px var(--gold), 0 4px 12px rgba(0,0,0,0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 12px 0;
  }

  .signatory-logo-wrap img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  .signatory-brand {
    font-family: 'Cinzel', serif;
    font-size: 13.5px;
    font-weight: 800;
    color: var(--midnight);
    letter-spacing: 0.8px;
    line-height: 1.2;
  }

  .signatory-sub {
    font-size: 10.5px;
    font-weight: 700;
    color: #D4A72C;
    letter-spacing: 0.6px;
    margin-top: 2px;
  }

  .discount-highlight {
    color: #16A34A !important;
    font-weight: 800 !important;
  }

  .totals-table-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .totals-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 10px;
  }

  .totals-table td {
    padding: 6px 2px;
    font-size: 12.5px;
    line-height: 1.3;
  }

  .tot-label {
    color: #475569;
    font-weight: 500;
  }

  .tot-val {
    text-align: right;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    color: var(--ink);
  }

  .tot-val.bold { font-weight: 800; }

  .discount-row td {
    color: var(--green);
  }

  .discount-val {
    color: var(--green) !important;
  }

  .net-payable-bar {
    background: var(--midnight);
    color: #FFFFFF;
    border-radius: 7px;
    padding: 10px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 10px rgba(11, 18, 32, 0.2);
  }

  .payable-label {
    display: flex;
    flex-direction: column;
  }

  .payable-label .main {
    font-family: 'Cinzel', serif;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1px;
    color: var(--gold-light);
  }

  .payable-label .sub {
    font-size: 9.5px;
    color: rgba(255, 255, 255, 0.65);
    margin-top: 2px;
  }

  .payable-val {
    font-family: 'JetBrains Mono', monospace;
    font-size: 22px;
    font-weight: 800;
    color: #FFFFFF;
    letter-spacing: 0.5px;
  }

  /* Thank You Strip */
  .thankyou-strip {
    background: linear-gradient(90deg, #F8FAFC 0%, #FFFBEB 50%, #F8FAFC 100%);
    border: 1px dashed var(--gold);
    border-radius: 6px;
    padding: 9px 16px;
    text-align: center;
    font-size: 11px;
    font-weight: 700;
    color: var(--midnight);
    letter-spacing: 0.6px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-top: auto;
  }

  .thankyou-strip svg { width: 14px; height: 14px; fill: var(--gold); }
  .thankyou-strip span { color: #854D0E; font-weight: 500; font-style: italic; }

  /* Footer */
  .invoice-footer {
    background: var(--midnight);
    color: rgba(255, 255, 255, 0.7);
    padding: 10px 28px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10.5px;
    border-top: 1px solid rgba(255,255,255,0.08);
  }

  .invoice-footer b { color: #FFFFFF; font-weight: 700; }
  .footer-right { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: var(--gold-soft); }

  /* ========================================================
     SAFETY GUIDE PAGE (Always Final Page)
     ======================================================== */
  .safety-sheet {
    background: #FFFFFF;
  }

  .safety-banner {
    background: linear-gradient(135deg, var(--midnight) 0%, #1a2333 100%);
    color: #FFFFFF;
    padding: 18px 28px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .safety-festive-tag {
    font-family: 'Cinzel', serif;
    font-size: 16px;
    font-weight: 800;
    letter-spacing: 1px;
    color: #FFFFFF;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .safety-festive-tag svg { width: 15px; height: 15px; fill: var(--gold); }

  .safety-subtitle {
    font-size: 11px;
    color: var(--gold-soft);
    font-weight: 500;
    margin-top: 3px;
  }

  .safety-badge-pill {
    padding: 4px 12px;
    border-radius: 999px;
    background: rgba(212, 167, 44, 0.18);
    border: 1px solid var(--gold);
    color: var(--gold-light);
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .safety-badge-pill svg { width: 13px; height: 13px; }

  .safety-body {
    padding: 16px 28px 18px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .safety-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 14px;
  }

  .safety-card {
    background: #FFFFFF;
    border: 1px solid var(--light-border);
    border-radius: 7px;
    padding: 12px 14px;
    position: relative;
    border-top: 3px solid var(--gold);
    display: flex;
    flex-direction: column;
  }

  .card-num-watermark {
    position: absolute;
    right: 10px;
    top: 6px;
    font-size: 16px;
    font-weight: 900;
    font-family: 'JetBrains Mono', monospace;
    color: #CBD5E1;
  }

  .safety-card-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
  }

  .safety-icon {
    width: 20px;
    height: 20px;
    border-radius: 5px;
    background: #FFFBEB;
    border: 1px solid #FDE68A;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #D97706;
    flex-shrink: 0;
  }

  .safety-icon svg { width: 12px; height: 12px; }

  .safety-card-title {
    font-size: 11px;
    font-weight: 800;
    color: var(--midnight);
    letter-spacing: 0.4px;
  }

  .safety-en-text {
    font-size: 10.5px;
    color: #475569;
    line-height: 1.4;
    margin-bottom: 5px;
    font-weight: 500;
  }

  .safety-ta-text {
    font-size: 10px;
    color: #64748B;
    line-height: 1.35;
    font-style: italic;
    border-top: 1px dashed #F1F5F9;
    padding-top: 4px;
    margin-top: auto;
  }

  .safety-center-brand {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 14px 20px;
    margin: 12px 0 16px;
    background: linear-gradient(135deg, #FFFDF5 0%, #FFF8E7 100%);
    border: 1px solid #FDE68A;
    border-radius: 10px;
    text-align: center;
    position: relative;
    box-shadow: 0 2px 8px rgba(212, 167, 44, 0.08);
  }

  .safety-logo-circle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #FFFFFF;
    padding: 2px;
    box-shadow: 0 0 0 2.5px var(--gold), 0 4px 12px rgba(0,0,0,0.12);
    margin-bottom: 8px;
  }

  .safety-logo-circle img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  .safety-brand-tag {
    font-family: 'Cinzel', serif;
    font-size: 16px;
    font-weight: 800;
    letter-spacing: 2.5px;
    color: var(--midnight);
    line-height: 1.2;
  }

  .safety-spark-sub {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.2px;
    color: #D97706;
    margin-top: 4px;
    text-transform: uppercase;
  }

  .notice-panel {
    background: #FFFDF5;
    border: 1px solid #FEF3C7;
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 12px;
  }

  .notice-header {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 800;
    color: #92400E;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    margin-bottom: 8px;
  }

  .notice-header svg { width: 14px; height: 14px; color: #D97706; }

  .notice-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 18px;
  }

  .notice-item {
    font-size: 10.5px;
    color: #78350F;
    line-height: 1.45;
  }

  .notice-item b { color: #451A03; font-weight: 700; }
  .notice-item .ta { font-size: 9.8px; color: #92400E; display: block; margin-top: 2px; }

  .safety-business-strip {
    border-top: 1px solid var(--light-border);
    padding-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10.5px;
    color: var(--muted);
  }

  .biz-name {
    font-weight: 800;
    color: var(--midnight);
    font-size: 12px;
  }

  .biz-addr {
    font-size: 10px;
    color: #64748B;
    margin-top: 2px;
  }

  .biz-contacts {
    text-align: right;
  }

  .biz-contacts b { color: var(--ink); font-weight: 700; }

  /* Print Media Rules */
  @media print {
    @page {
      size: A4 portrait;
      margin: 0;
    }
    body {
      background: #FFFFFF !important;
      padding: 0 !important;
      margin: 0 !important;
    }
    .invoice-wrapper {
      max-width: none !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    .page-sheet {
      width: 210mm !important;
      height: 297mm !important;
      min-height: 297mm !important;
      max-height: 297mm !important;
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      page-break-after: always !important;
      break-after: page !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      overflow: hidden !important;
    }
    .page-sheet:last-child {
      page-break-after: avoid !important;
      break-after: avoid !important;
    }
  }


        @media screen {
          .jj-invoice-root {
            background: #ECE9E1;
            padding: 30px 16px;
            min-height: 100vh;
          }
          .action-bar-wrap {
            max-width: 860px;
            margin: 0 auto 20px;
            display: flex;
            justify-content: flex-end;
            gap: 12px;
          }
          .print-btn {
            background: linear-gradient(135deg, #101827 0%, #1E293B 100%);
            color: #FFFFFF;
            border: 1px solid #D4A72C;
            padding: 10px 20px;
            border-radius: 6px;
            font-weight: 700;
            font-size: 13px;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
          .print-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(0,0,0,0.25);
            background: #1E293B;
          }
        }

        @media print {
          .action-bar-wrap {
            display: none !important;
          }
        }
      `}</style>

      {showActions && (
        <div className="action-bar-wrap">
          <button onClick={() => window.print()} className="print-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Print / Save as PDF
          </button>
        </div>
      )}

      <div className="invoice-wrapper">
        {invoicePages.map((page, pageIdx) => {
          const currentPageNum = pageIdx + 1;
          const isFirstPage = pageIdx === 0;

          return (
            <div key={currentPageNum} className="page-sheet" id={`invoice-page-${currentPageNum}`}>
              <div className="sheet-inner">
                {isFirstPage ? (
                  <>
                    {/* Header (Page 1) */}
                    <div className="header-banner">
                      <div className="brand-group">
                        <div className="logo-box">
                          <img src={LOGO_DATA_URI} alt="JJ Crackers Logo" />
                        </div>
                        <div className="brand-text">
                          <div className="brand-name">JJ CRACKERS</div>
                          <div className="brand-sub">
                            <span>JEGAJOTHI CRACKERS</span>
                            <span>·</span>
                            <span className="tamil">ஜெகஜோதி பட்டாசுகள்</span>
                          </div>
                          <div className="brand-contact">
                            1/406, Sivakasi-Vembakottai Main Road, Opp. EB Office, Vembakottai, Tamil Nadu<br />
                            Phone: <b>+91 70923 00252</b> &nbsp;|&nbsp; Email: <b>jjcrackersworld@gmail.com</b>
                          </div>
                        </div>
                      </div>

                      <div className="invoice-tag-group">
                        <div className="festive-spark-icon">
                          <svg viewBox="0 0 24 24"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/></svg>
                          PREMIUM SIVAKASI FIREWORKS
                        </div>
                        <div className="invoice-title">ORDER INVOICE</div>
                        <div className="order-number-display">#{order.order_number}</div>
                        <div>
                          <span className="status-badge"><span className="dot"></span> CONFIRMED</span>
                        </div>
                      </div>
                    </div>

                    <div className="spark-accent-line"></div>

                    {/* Order Summary Strip */}
                    <div className="order-strip">
                      <div className="strip-item">
                        <div className="strip-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                        </div>
                        <div className="strip-content">
                          <span className="strip-label">Order Ref</span>
                          <span className="strip-val">{order.order_number}</span>
                        </div>
                      </div>

                      <div className="strip-item">
                        <div className="strip-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        </div>
                        <div className="strip-content">
                          <span className="strip-label">Order Date &amp; Time</span>
                          <span className="strip-val">{formattedDate}, {formattedTime}</span>
                        </div>
                      </div>

                      <div className="strip-item">
                        <div className="strip-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        </div>
                        <div className="strip-content">
                          <span className="strip-label">Order Status</span>
                          <span className="strip-val confirmed">CONFIRMED</span>
                        </div>
                      </div>

                      <div className="strip-item">
                        <div className="strip-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        </div>
                        <div className="strip-content">
                          <span className="strip-label">Customer / City</span>
                          <span className="strip-val accent">{topCityDisplay}</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Continuation Header */}
                    <div className="header-banner continuation">
                      <div className="brand-group">
                        <div className="logo-box small">
                          <img src={LOGO_DATA_URI} alt="JJ Crackers Logo" />
                        </div>
                        <div className="brand-text">
                          <div className="brand-name" style={{ fontSize: '19px' }}>JJ CRACKERS</div>
                          <div className="brand-sub" style={{ fontSize: '10px' }}>
                            <span>JEGAJOTHI CRACKERS</span>
                            <span>·</span>
                            <span className="tamil" style={{ fontSize: '10.5px' }}>ஜெகஜோதி பட்டாசுகள்</span>
                          </div>
                        </div>
                      </div>

                      <div className="invoice-tag-group">
                        <div className="invoice-title small">ORDER INVOICE — CONTINUED</div>
                        <div className="order-number-display small">#{order.order_number}</div>
                      </div>
                    </div>

                    <div className="spark-accent-line"></div>
                  </>
                )}

                {/* Body Content */}
                <div className="body-content">
                  {isFirstPage && (
                    <div className="customer-card">
                      <div className="card-header-bar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        BILL TO / CUSTOMER INFORMATION
                      </div>
                      <div className="customer-grid">
                        <div className="cust-field">
                          <span className="cust-label">Customer Name</span>
                          <span className="cust-val name">{order.customer_name || 'Valued Customer'}</span>
                        </div>
                        <div className="cust-field">
                          <span className="cust-label">Phone Number</span>
                          <span className="cust-val phone">{order.customer_phone || 'N/A'}</span>
                        </div>
                        <div className="cust-field">
                          <span className="cust-label">Email Address</span>
                          <span className="cust-val">{order.customer_email || 'N/A'}</span>
                        </div>
                        <div className="cust-field">
                          <span className="cust-label">City / PIN Code</span>
                          <span className="cust-val">{cityPinStr}</span>
                        </div>
                        <div className="cust-field">
                          <span className="cust-label">DELIVERY / BILLING ADDRESS</span>
                          <span className="cust-val">{customerAddress || cityPinStr}</span>
                        </div>
                        <div className="cust-field">
                          <span className="cust-label">APPLIED FESTIVAL DISCOUNT</span>
                          <span className="cust-val discount-highlight">{avgDiscount}% OFF ({formatRs(discountTotal)} Saved)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Products Table */}
                  <div className="table-section-title">
                    <div className="table-title-text">
                      <svg viewBox="0 0 24 24"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/></svg>
                      {isFirstPage ? 'ORDERED FIREWORKS ITEMS' : 'ORDERED FIREWORKS ITEMS — CONTINUED'}
                    </div>
                    <div className="table-subtitle">Prices include all local taxes &amp; festival discounts</div>
                  </div>

                  <table className="product-table">
                    <thead>
                      <tr>
                        <th className="center" style={{ width: '6%' }}>S.NO</th>
                        <th className="left" style={{ width: '36%' }}>PRODUCT DESCRIPTION</th>
                        <th className="center" style={{ width: '8%' }}>QTY</th>
                        <th className="right" style={{ width: '12%' }}>ACTUAL PRICE</th>
                        <th className="right" style={{ width: '13%' }}>ACTUAL TOTAL</th>
                        <th className="right" style={{ width: '12%' }}>DISCOUNT</th>
                        <th className="right" style={{ width: '13%' }}>NET TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {page.items.map(item => (
                        <tr key={item.sno}>
                          <td className="center sno-col">{item.sno}</td>
                          <td className="left prod-col">
                            <span className="prod-bullet">🎆</span>
                            <span>{item.name}</span>
                          </td>
                          <td className="center qty-col">{item.quantity}</td>
                          <td className="right regular-price">{formatRs(item.mrp)}</td>
                          <td className="right regular-price">{formatRs(item.actualTotal)}</td>
                          <td className="right disc-val">{formatRs(item.discountAmt)}</td>
                          <td className="right net-val">{formatRs(item.netTotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {page.showSummary && (
                    <>
                      {/* Financial Summary & Total Payable (Stays Together) */}
                      <div className="bottom-summary-grid">
                        <div className="signatory-card">
                          <div className="signatory-title">AUTHORIZED SIGNATORY</div>
                          <div className="signatory-logo-wrap">
                            <img src={LOGO_DATA_URI} alt="JJ Crackers Logo" />
                          </div>
                          <div className="signatory-footer">
                            <div className="signatory-brand">JJ CRACKERS</div>
                            <div className="signatory-sub">JEGAJOTHI CRACKERS</div>
                          </div>
                        </div>

                        <div className="totals-table-wrapper">
                          <table className="totals-table">
                            <tbody>
                              <tr>
                                <td className="tot-label">GROSS AMOUNT (ACTUAL MRP TOTAL)</td>
                                <td className="tot-val">{formatRs(grossAmount)}</td>
                              </tr>
                              <tr className="discount-row">
                                <td className="tot-label">FESTIVAL DISCOUNT ({avgDiscount}% OFF)</td>
                                <td className="tot-val discount-val">-{formatRs(discountTotal)}</td>
                              </tr>
                              <tr>
                                <td className="tot-label">NET PRODUCT VALUE</td>
                                <td className="tot-val bold">{formatRs(netValue)}</td>
                              </tr>
                              <tr>
                                <td className="tot-label">PACKING &amp; FORWARDING (3%)</td>
                                <td className="tot-val">{formatRs(packing)}</td>
                              </tr>
                            </tbody>
                          </table>

                          <div className="net-payable-bar">
                            <div className="payable-label">
                              <span className="main">TOTAL PAYABLE AMOUNT</span>
                            </div>
                            <div className="payable-val">{formatRs(netPayable)}</div>
                          </div>
                        </div>
                      </div>

                      {/* Thank You Note */}
                      <div className="thankyou-strip">
                        <svg viewBox="0 0 24 24"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/></svg>
                        THANK YOU FOR CHOOSING JJ CRACKERS!
                        <span>"Celebrate the joy from JJ Crackers."</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Page Footer */}
              <div className="invoice-footer">
                <div className="footer-left">
                  <b>JJ CRACKERS</b> · Licensed Under Explosives Act, 1884 · Sivakasi Direct Factory Outlet
                </div>
                <div className="footer-right">
                  Page <b>{currentPageNum}</b> of <b>{totalPages}</b>
                </div>
              </div>
            </div>
          );
        })}

        {/* STANDALONE FINAL PAGE: FIREWORKS SAFETY & CELEBRATION GUIDE */}
        <div className="page-sheet safety-sheet" id={`invoice-page-${totalPages}`}>
          <div className="sheet-inner">
            <div className="safety-banner">
              <div className="safety-title-group">
                <div className="safety-festive-tag">
                  <svg viewBox="0 0 24 24"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/></svg>
                  FIREWORKS SAFETY &amp; CELEBRATION GUIDE
                </div>
                <div className="safety-subtitle">Celebrate beautifully. Celebrate responsibly. Follow Sivakasi standard safety protocols.</div>
              </div>
              <div className="safety-badge-pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                SAFETY FIRST
              </div>
            </div>

            <div className="spark-accent-line"></div>

            <div className="safety-body">
              {/* 6 Safety Cards (3x2 grid) */}
              <div className="safety-grid">
                <div className="safety-card">
                  <div className="card-num-watermark">01</div>
                  <div className="safety-card-header">
                    <div className="safety-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg></div>
                    <div className="safety-card-title">STORE SAFELY</div>
                  </div>
                  <div className="safety-en-text">Store fireworks in a cool, dry, ventilated area away from heat sources.</div>
                  <div className="safety-ta-text">பட்டாசுகளை குளிர்ந்த, உலர்ந்த மற்றும் பாதுகாப்பான இடத்தில் வைக்கவும்.</div>
                </div>

                <div className="safety-card">
                  <div className="card-num-watermark">02</div>
                  <div className="safety-card-header">
                    <div className="safety-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg></div>
                    <div className="safety-card-title">KEEP A SAFE DISTANCE</div>
                  </div>
                  <div className="safety-en-text">Maintain at least 5 meters distance after lighting aerial items and ground chakkars.</div>
                  <div className="safety-ta-text">பட்டாசு பற்றவைத்த பிறகு பாதுகாப்பு தூரத்திற்கு செல்லவும்.</div>
                </div>

                <div className="safety-card">
                  <div className="card-num-watermark">03</div>
                  <div className="safety-card-header">
                    <div className="safety-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
                    <div className="safety-card-title">USE PROPER LIGHTING</div>
                  </div>
                  <div className="safety-en-text">Always use an incense stick (agarbatti) or sparkler to ignite. Never use open flame.</div>
                  <div className="safety-ta-text">பற்றவைக்க ஊதுபத்தியை பயன்படுத்தவும்; திறந்த சுடரை தவிர்க்கவும்.</div>
                </div>

                <div className="safety-card">
                  <div className="card-num-watermark">04</div>
                  <div className="safety-card-header">
                    <div className="safety-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg></div>
                    <div className="safety-card-title">KEEP WATER NEARBY</div>
                  </div>
                  <div className="safety-en-text">Keep a bucket of clean water or sand readily available for emergency use.</div>
                  <div className="safety-ta-text">அவசர காலத்திற்கு அருகில் ஒரு வாளி தண்ணீரை எப்போதும் வைத்திருக்கவும்.</div>
                </div>

                <div className="safety-card">
                  <div className="card-num-watermark">05</div>
                  <div className="safety-card-header">
                    <div className="safety-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
                    <div className="safety-card-title">ADULT SUPERVISION</div>
                  </div>
                  <div className="safety-en-text">Children must light fireworks only under continuous adult guidance and care.</div>
                  <div className="safety-ta-text">குழந்தைகள் பட்டாசுகளை பெரியவர்களின் மேற்பார்வையில் மட்டுமே வெடிக்க வேண்டும்.</div>
                </div>

                <div className="safety-card">
                  <div className="card-num-watermark">06</div>
                  <div className="safety-card-header">
                    <div className="safety-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
                    <div className="safety-card-title">RESPONSIBLE CELEBRATION</div>
                  </div>
                  <div className="safety-en-text">Dispose of spent fireworks in water buckets before discarding. Respect your neighbors.</div>
                  <div className="safety-ta-text">பாதுகாப்பு விதிகளை பின்பற்றி பிறருக்கு இடையூறின்றி மகிழ்ச்சியுடன் கொண்டாடவும்.</div>
                </div>
              </div>

              {/* Center Brand Visual */}
              <div className="safety-center-brand">
                <div className="safety-logo-circle">
                  <img src={LOGO_DATA_URI} alt="JJ CRACKERS" />
                </div>
                <div className="safety-brand-tag">CELEBRATE THE JOY</div>
                <div className="safety-spark-sub">✦ PREMIUM SIVAKASI FIREWORKS ✦</div>
              </div>

              {/* Terms Panel */}
              <div className="notice-panel">
                <div className="notice-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  IMPORTANT CUSTOMER NOTICE &amp; DISPATCH TERMS (விதிகளும் நிபந்தனைகளும்)
                </div>
                <div className="notice-list">
                  <div className="notice-item">
                    ● <b>Booking Cancellation:</b> Goods once booked cannot be cancelled or returned under any circumstances.
                    <span className="ta">பதிவு செய்யப்பட்ட ஆர்டர்கள் எக்காரணம் கொண்டும் ரத்து செய்யப்பட மாட்டாது.</span>
                  </div>
                  <div className="notice-item">
                    ● <b>Transport Service:</b> Delivery is subject to regional transport partner service and truck availability.
                    <span className="ta">பொருட்கள் போக்குவரத்து சேவை கிடைக்கும் தன்மையைப் பொறுத்து விநியோகம் செய்யப்படும்.</span>
                  </div>
                  <div className="notice-item">
                    ● <b>Transport Charges:</b> Quoted prices include local taxes; freight &amp; transport hub handling charges are payable at hub.
                    <span className="ta">போக்குவரத்து மைய கட்டணம் வாடிக்கையாளரால் நேரடியாக செலுத்தப்பட வேண்டும்.</span>
                  </div>
                  <div className="notice-item">
                    ● <b>Parcel Verification:</b> Customers must verify physical box count and seals at the transport delivery hub before taking delivery.
                    <span className="ta">போக்குவரத்து மையத்தில் பார்சல்களைப் பெறும்போது பெட்டிகளின் எண்ணிக்கையை சரிபார்க்கவும்.</span>
                  </div>
                </div>
              </div>

              {/* Business Strip */}
              <div className="safety-business-strip">
                <div className="biz-info">
                  <div className="biz-name">JJ CRACKERS · JEGAJOTHI CRACKERS</div>
                  <div className="biz-addr">Premium Sivakasi Fireworks Factory Outlet · Sivakasi-Vembakottai Main Road, Vembakottai, Tamil Nadu</div>
                </div>
                <div className="biz-contacts">
                  <div className="biz-phone">Phone: <b>+91 70923 00252</b></div>
                  <div className="biz-email">Email: jjcrackersworld@gmail.com</div>
                </div>
              </div>
            </div>
          </div>

          <div className="invoice-footer">
            <div className="footer-left">
              <b>JJ CRACKERS</b> · "Celebrate the joy. Celebrate responsibly."
            </div>
            <div className="footer-right">
              Page <b>{totalPages}</b> of <b>{totalPages}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
