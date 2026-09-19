import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
  mrp?: number;
  category?: string;
}

export interface ReceiptData {
  orderNumber: string;
  date: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  customerAddress?: string;
  customerCity?: string;
  customerPincode?: string;
  customerState?: string;
  customerDistrict?: string;
  items: ReceiptItem[];
  subtotal: number;
  discountTotal: number;
  totalAmount: number;
  packingCharges?: number;
}

function escapeHtml(str: string = ''): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatCurrency(n: number): string {
  return 'Rs. ' + Math.round(n).toLocaleString('en-IN');
}

/**
 * Builds the exact HTML matching jj-crackers-invoice.html template for any order data
 */
function buildInvoiceHtml(data: ReceiptData): string {
  const items = (data.items || []).map((item, idx) => {
    const qty = Number(item.quantity || 1);
    const netPrice = Number(item.price || 0);
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
      offPct: offPct > 0 ? offPct : 60,
    };
  });

  const calculatedGross = items.reduce((sum, i) => sum + i.actualTotal, 0);
  const calculatedNet = items.reduce((sum, i) => sum + i.netTotal, 0);
  const calculatedDiscount = Math.max(0, calculatedGross - calculatedNet);
  
  const grossAmount = data.subtotal && data.subtotal > calculatedNet ? data.subtotal : calculatedGross;
  const discountTotal = data.discountTotal && data.discountTotal > 0 ? data.discountTotal : calculatedDiscount;
  const netValue = grossAmount - discountTotal;
  
  const packingCharges = data.packingCharges !== undefined
    ? Number(data.packingCharges)
    : Math.round(netValue * 0.03);

  const netPayable = data.totalAmount && data.totalAmount > 0
    ? Number(data.totalAmount)
    : netValue + packingCharges;

  const avgDiscount = grossAmount > 0 ? Math.round((discountTotal / grossAmount) * 100) : 60;

  const stateVal = data.customerState || 'Tamil Nadu';
  const districtVal = data.customerDistrict || 'N/A';
  const cityVal = data.customerCity || 'Sivakasi';
  const pincodeVal = data.customerPincode || '626123';
  const addressVal = data.customerAddress || '';

  const orderDateStr = data.date || new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const tableRowsHtml = items.map(item => `
    <tr>
      <td class="snum">${item.sno}</td>
      <td class="prod">${escapeHtml(item.name)}</td>
      <td class="num">${item.quantity}</td>
      <td class="num strike">${formatCurrency(item.mrp)}</td>
      <td class="num strike">${formatCurrency(item.actualTotal)}</td>
      <td class="pct"><span class="chip">-${item.offPct}%</span></td>
      <td class="num discount">${formatCurrency(item.discountAmt)}</td>
      <td class="num net">${formatCurrency(item.netTotal)}</td>
    </tr>
  `).join('');

  return `
<div class="sheet">
  <!-- HEADER -->
  <div class="header">
    <div class="header-row">
      <div class="brand">
        <div class="logo-frame">
          <img src="/logo/logo.png" alt="JJ Crackers Logo" crossorigin="anonymous" />
        </div>
        <div>
          <div class="brand-name">JJ CRACKERS</div>
          <div class="brand-sub">ஜெகஜோதி பட்டாசுகள் · PREMIUM SIVAKASI FIREWORKS</div>
          <div class="brand-addr">1/406, Sivakasi-Vembakottai Main Road, Opp. EB Office,<br>Vembakottai, Tamil Nadu · +91 70923 00252</div>
        </div>
      </div>
      <div class="receipt-tag">
        <div class="kicker">Order Receipt</div>
        <div class="title">${escapeHtml(data.orderNumber)}</div>
        <div class="status-pill"><span class="dot"></span> Confirmed</div>
      </div>
    </div>
  </div>

  <!-- SPARK STRIP -->
  <div class="spark-strip"></div>

  <!-- DIYA ROW -->
  <div class="diya-row">
    <svg viewBox="0 0 64 64"><path d="M12 42 C12 52, 22 56, 32 56 C42 56, 52 52, 52 42 Z" fill="#F5A300"/><ellipse cx="32" cy="42" rx="20" ry="5" fill="#FFD400"/><path d="M32 14 C36 22, 38 28, 32 37 C26 28, 28 22, 32 14 Z" fill="#C8102E"/><path d="M32 20 C34 25, 35 29, 32 35 C29 29, 30 25, 32 20 Z" fill="#FFD400"/></svg>
    <svg viewBox="0 0 64 64"><path d="M12 42 C12 52, 22 56, 32 56 C42 56, 52 52, 52 42 Z" fill="#F5A300"/><ellipse cx="32" cy="42" rx="20" ry="5" fill="#FFD400"/><path d="M32 14 C36 22, 38 28, 32 37 C26 28, 28 22, 32 14 Z" fill="#C8102E"/><path d="M32 20 C34 25, 35 29, 32 35 C29 29, 30 25, 32 20 Z" fill="#FFD400"/></svg>
    <svg viewBox="0 0 64 64"><path d="M12 42 C12 52, 22 56, 32 56 C42 56, 52 52, 52 42 Z" fill="#F5A300"/><ellipse cx="32" cy="42" rx="20" ry="5" fill="#FFD400"/><path d="M32 14 C36 22, 38 28, 32 37 C26 28, 28 22, 32 14 Z" fill="#C8102E"/><path d="M32 20 C34 25, 35 29, 32 35 C29 29, 30 25, 32 20 Z" fill="#FFD400"/></svg>
  </div>

  <!-- META STRIP -->
  <div class="meta-strip">
    <div class="meta-item">
      <div class="label">Order Date</div>
      <div class="value">${escapeHtml(orderDateStr)}</div>
    </div>
    <div class="meta-item">
      <div class="label">Customer</div>
      <div class="value accent">${escapeHtml(data.customerName)}</div>
    </div>
    <div class="meta-item">
      <div class="label">Contact</div>
      <div class="value">${escapeHtml(data.customerPhone)}</div>
    </div>
    <div class="meta-item">
      <div class="label">Discount Applied</div>
      <div class="value pct">${avgDiscount}% OFF</div>
    </div>
  </div>

  <!-- BODY -->
  <div class="body">
    <!-- GARLAND -->
    <div class="garland">
      ${Array(7).fill(`
        <svg viewBox="0 0 24 24">
          <g fill="#F5A300">
            <circle cx="12" cy="5" r="3.6"/><circle cx="12" cy="19" r="3.6"/>
            <circle cx="5" cy="12" r="3.6"/><circle cx="19" cy="12" r="3.6"/>
            <circle cx="7.2" cy="7.2" r="3.6"/><circle cx="16.8" cy="16.8" r="3.6"/>
            <circle cx="7.2" cy="16.8" r="3.6"/><circle cx="16.8" cy="7.2" r="3.6"/>
          </g>
          <circle cx="12" cy="12" r="3.4" fill="#C8102E"/>
        </svg>
      `).join('')}
    </div>

    <!-- TWO COLUMNS -->
    <div class="two-col">
      <div class="info-card">
        <h3>Customer Details</h3>
        <div class="name">${escapeHtml(data.customerName)}</div>
        <p>${escapeHtml(addressVal || 'Customer Pickup / Delivery Address')}</p>
        <p>${escapeHtml(cityVal)}${districtVal && districtVal !== 'N/A' ? ', ' + escapeHtml(districtVal) : ''} - ${escapeHtml(pincodeVal)}</p>
        <p>Phone: ${escapeHtml(data.customerPhone)}</p>
        ${data.customerEmail ? `<p>Email: ${escapeHtml(data.customerEmail)}</p>` : ''}
      </div>

      <div class="info-card">
        <h3>Place of Supply &amp; Transport</h3>
        <div class="kv"><span>State</span><b>${escapeHtml(stateVal)}</b></div>
        <div class="kv"><span>District</span><b>${escapeHtml(districtVal)}</b></div>
        <div class="kv"><span>Destination</span><b>${escapeHtml(cityVal)}</b></div>
        <div class="kv"><span>Postal Code</span><b>${escapeHtml(pincodeVal)}</b></div>
        <div class="hub-note">📍 Pickup: Nearest Transport Office Hub</div>
      </div>
    </div>

    <!-- ITEMS TABLE -->
    <div class="section-label">
      <svg viewBox="0 0 24 24" fill="none"><path d="M12 2l2.4 7.2h7.6l-6 4.8 2.3 7.2-6.3-4.6-6.3 4.6 2.3-7.2-6-4.8h7.6z" fill="#C8102E"/></svg>
      Order Items
    </div>

    <table class="items">
      <thead>
        <tr>
          <th style="width:36px;">S.No</th>
          <th>Product Description</th>
          <th class="num" style="width:40px;">Qty</th>
          <th class="num">Actual Price</th>
          <th class="num">Actual Total</th>
          <th style="text-align:right; width:65px;">Off %</th>
          <th class="num">Discount</th>
          <th class="num">Net Total</th>
        </tr>
      </thead>
      <tbody>
        ${tableRowsHtml}
      </tbody>
    </table>

    <!-- TOTALS -->
    <div class="totals-wrap">
      <div class="totals">
        <div class="row">
          <span>Gross Amount (MRP Total)</span>
          <b>${formatCurrency(grossAmount)}</b>
        </div>
        <div class="row discount">
          <span>Festival Discount <span class="pct-tag">${avgDiscount}% OFF</span></span>
          <b>-${formatCurrency(discountTotal)}</b>
        </div>
        <div class="row">
          <span>Total Value (Net Amount)</span>
          <b>${formatCurrency(netValue)}</b>
        </div>
        <div class="row">
          <span>Packing Charges (3%)</span>
          <b>${formatCurrency(packingCharges)}</b>
        </div>
        <div class="net-payable">
          <span class="lbl">Net Payable</span>
          <span class="amt">${formatCurrency(netPayable)}</span>
        </div>
      </div>
    </div>

    <!-- THANK YOU NOTE -->
    <div class="thanks">
      <svg class="burst" viewBox="0 0 48 48" fill="none">
        <g stroke="#F5A300" stroke-width="2.5" stroke-linecap="round">
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

  <!-- GARLAND DIVIDER -->
  <div class="garland-divider">
    ${Array(14).fill(`
      <svg viewBox="0 0 24 24">
        <g fill="#F5A300">
          <circle cx="12" cy="5" r="3.6"/><circle cx="12" cy="19" r="3.6"/>
          <circle cx="5" cy="12" r="3.6"/><circle cx="19" cy="12" r="3.6"/>
          <circle cx="7.2" cy="7.2" r="3.6"/><circle cx="16.8" cy="16.8" r="3.6"/>
          <circle cx="7.2" cy="16.8" r="3.6"/><circle cx="16.8" cy="7.2" r="3.6"/>
        </g>
        <circle cx="12" cy="12" r="3.4" fill="#C8102E"/>
      </svg>
    `).join('')}
  </div>

  <!-- BILINGUAL TERMS & SAFETY -->
  <div class="panels">
    <div class="panel">
      <h4>
        <svg viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4M4 6h16v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6Z" stroke="#C8102E" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Terms &amp; Conditions
      </h4>
      <ol>
        <li>Goods once booked cannot be cancelled or returned.<span class="ta">பதிவு செய்யப்பட்ட பொருட்கள் திரும்பப் பெறப்பட மாட்டாது.</span></li>
        <li>Delivery is subject to transport service availability.<span class="ta">பொருட்கள் போக்குவரத்து சேவை கிடைக்கும் தன்மையை பொறுத்து விநியோகம் செய்யப்படும்.</span></li>
        <li>Price includes local taxes; transport charges are extra.<span class="ta">விலையில் உள்ளூர் வரிகள் அடங்கும்; போக்குவரத்து கட்டணம் தனி.</span></li>
        <li>Customer must verify goods quantity at transport pickup hub.<span class="ta">போக்குவரத்து மையத்தில் பொருட்களைப் பெறும்போது அளவைச் சரிபார்க்கவும்.</span></li>
      </ol>
    </div>

    <div class="panel safety">
      <h4>
        <svg viewBox="0 0 24 24" fill="none"><path d="M12 2 4 5v6c0 5 3.4 8.4 8 11 4.6-2.6 8-6 8-11V5l-8-3Z" stroke="#C8102E" stroke-width="1.6" stroke-linejoin="round"/></svg>
        Safety Instructions
      </h4>
      <ol>
        <li>Store fireworks in a cool, dry, and secure place.<span class="ta">பட்டாசுகளை குளிர்ந்த, உலர்ந்த இடத்தில் வைக்கவும்.</span></li>
        <li>Maintain safe distance while lighting fireworks.<span class="ta">பட்டாசு பற்றவைக்கும்போது பாதுகாப்பான தூரத்தை பராமரிக்கவும்.</span></li>
        <li>Use an incense stick (Agarbatti) for lighting; avoid open flame.<span class="ta">ஊதுபத்தி பயன்படுத்தவும்; திறந்த சுடரை தவிர்க்கவும்.</span></li>
        <li>Keep a bucket of water nearby for emergencies.<span class="ta">அவசர காலத்திற்கு தண்ணீர் வாலி வைத்திருக்கவும்.</span></li>
        <li>Supervision by adults is mandatory for children.<span class="ta">குழந்தைகளுக்கு பெரியவர்களின் கண்காணிப்பு கட்டாயமாகும்.</span></li>
      </ol>
    </div>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <b>JJ CRACKERS · SIVAKASI</b>
    <div class="tag">Premium Friendly Sivakasi Fireworks Since 2015 · Contact: +91 70923 00252</div>
  </div>
</div>
  `;
}

const INVOICE_CSS = `
  :root {
    --navy: #1B2A5E;
    --navy-deep: #101B42;
    --red: #C8102E;
    --red-deep: #8C0B20;
    --maroon: #7B2D26;
    --yellow: #FFD400;
    --yellow-soft: #FFE685;
    --marigold: #F5A300;
    --ink: #1B2440;
    --cream: #FFFBEF;
    --sand: #FCEFCB;
    --green: #2F7A45;
    --line: rgba(27,36,64,0.14);
  }
  * { box-sizing: border-box; }
  .sheet {
    width: 860px;
    margin: 0 auto;
    background: var(--cream);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 30px 60px rgba(16,27,66,0.24);
    border: 1px solid rgba(27,36,64,0.08);
    font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: var(--ink);
    -webkit-font-smoothing: antialiased;
  }
  .header {
    position: relative;
    background: linear-gradient(135deg, var(--navy-deep) 0%, var(--navy) 60%, #22326B 100%);
    color: var(--cream);
    padding: 30px 40px 26px;
    overflow: hidden;
  }
  .header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
  }
  .brand { display: flex; align-items: center; gap: 18px; }
  .logo-frame {
    width: 78px; height: 78px; border-radius: 50%;
    background: #fff;
    padding: 4px;
    box-shadow: 0 0 0 4px var(--yellow), 0 8px 18px rgba(0,0,0,0.30);
    flex-shrink: 0;
  }
  .logo-frame img { width: 100%; height: 100%; border-radius: 50%; display: block; object-fit: cover; }
  .brand-name { font-family: 'Fraunces', serif; font-weight: 800; font-size: 29px; letter-spacing: 0.4px; line-height: 1.05; text-transform: uppercase; color: #FFFBEF; }
  .brand-sub { font-size: 12px; color: var(--yellow-soft); margin-top: 5px; font-weight: 700; letter-spacing: 0.3px; }
  .brand-addr { font-size: 11.3px; color: rgba(255,251,239,0.72); margin-top: 8px; line-height: 1.5; max-width: 340px; }
  .receipt-tag { text-align: right; }
  .receipt-tag .kicker { font-size: 11px; color: var(--yellow-soft); font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
  .receipt-tag .title { font-family: 'Fraunces', serif; font-size: 23px; font-weight: 700; margin-top: 3px; color: #FFFBEF; }
  .status-pill {
    display: inline-flex; align-items: center; gap: 6px;
    margin-top: 10px; padding: 6px 14px; border-radius: 999px;
    background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.35);
    font-size: 12px; font-weight: 700; letter-spacing: 0.4px; color: var(--cream);
  }
  .status-pill .dot { width: 7px; height: 7px; border-radius: 50%; background: #7CE38B; box-shadow: 0 0 0 3px rgba(124,227,139,0.25); }
  .spark-strip {
    height: 14px;
    background: repeating-linear-gradient(90deg, var(--yellow) 0 10px, var(--red) 10px 20px);
  }
  .diya-row {
    display: flex; justify-content: center; gap: 26px;
    background: var(--sand);
    padding: 10px 10px 4px;
  }
  .diya-row svg { width: 30px; height: 30px; }
  .meta-strip {
    display: flex; flex-wrap: wrap; justify-content: space-between;
    background: var(--sand);
    padding: 12px 40px 16px;
    gap: 20px;
    border-bottom: 1px dashed rgba(27,36,64,0.25);
  }
  .meta-item { flex: 1 1 0; min-width: 120px; }
  .meta-item .label { font-size: 11px; color: #8A6A1E; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; }
  .meta-item .value { font-size: 14.5px; font-weight: 700; color: var(--ink); margin-top: 2px; }
  .meta-item .value.accent { color: var(--red); }
  .meta-item .value.pct { color: var(--green); }
  .body { padding: 30px 40px 8px; }
  .garland { display: flex; justify-content: center; gap: 6px; margin-bottom: 26px; }
  .garland svg { width: 26px; height: 26px; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; }
  .info-card {
    background: #FFFFFF;
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 18px 20px;
    position: relative;
  }
  .info-card::before {
    content: "";
    position: absolute; left: 0; top: 14px; bottom: 14px; width: 4px;
    background: var(--yellow);
    border-radius: 0 4px 4px 0;
  }
  .info-card h3 {
    font-family: 'Fraunces', serif;
    font-size: 13.5px; margin: 0 0 10px; color: var(--red);
    text-transform: uppercase; letter-spacing: 0.6px; font-weight: 700;
  }
  .info-card .name { font-weight: 800; font-size: 15.5px; margin-bottom: 4px; color: var(--ink); }
  .info-card p { margin: 2px 0; font-size: 13.5px; color: #3C4260; line-height: 1.55; }
  .info-card .kv { display: flex; justify-content: space-between; font-size: 13.5px; padding: 3px 0; color: #3C4260; }
  .info-card .kv b { color: var(--ink); font-weight: 700; }
  .hub-note {
    margin-top: 10px; padding: 7px 10px; border-radius: 8px;
    background: rgba(200,16,46,0.08); color: var(--red); font-size: 12px; font-weight: 700;
    display: inline-block;
  }
  .section-label {
    font-family: 'Fraunces', serif; font-weight: 700; font-size: 15px; color: var(--ink);
    margin: 4px 0 12px; display: flex; align-items: center; gap: 8px;
  }
  .section-label svg { width: 16px; height: 16px; }
  table.items {
    width: 100%; border-collapse: separate; border-spacing: 0;
    border-radius: 12px; overflow: hidden;
    border: 1px solid var(--line);
    margin-bottom: 8px;
  }
  table.items thead th {
    background: var(--navy-deep);
    color: var(--yellow-soft);
    font-size: 11.2px; text-transform: uppercase; letter-spacing: 0.5px;
    padding: 12px 12px; text-align: left; font-weight: 700;
  }
  table.items thead th.num { text-align: right; }
  table.items tbody td {
    padding: 12px 12px; font-size: 13.5px; border-bottom: 1px solid var(--line);
    background: #fff; color: var(--ink);
  }
  table.items tbody tr:nth-child(even) td { background: #FBF6E4; }
  table.items tbody tr:last-child td { border-bottom: none; }
  table.items td.num { text-align: right; font-variant-numeric: tabular-nums; }
  table.items td.strike { color: #9AA0B4; text-decoration: line-through; font-size: 12.5px; }
  table.items td.discount { color: var(--green); font-weight: 700; }
  table.items td.pct { text-align: right; }
  table.items td.pct .chip {
    display: inline-block; background: rgba(200,16,46,0.10); color: var(--red);
    font-weight: 800; font-size: 12px; padding: 3px 9px; border-radius: 999px;
  }
  table.items td.net { font-weight: 800; color: var(--red); }
  table.items td.snum { color: #8A8FA6; font-size: 12.5px; text-align: center; }
  table.items td.prod { font-weight: 700; color: var(--ink); }
  .totals-wrap { display: flex; justify-content: flex-end; margin: 18px 0 30px; }
  .totals {
    width: 330px; background: #fff; border: 1px solid var(--line); border-radius: 14px;
    padding: 16px 20px;
  }
  .totals .row { display: flex; justify-content: space-between; font-size: 13.5px; padding: 5px 0; color: #3C4260; }
  .totals .row b { color: var(--ink); font-weight: 700; }
  .totals .row.discount { color: var(--green); font-weight: 700; }
  .totals .row.discount .pct-tag {
    background: var(--green); color: #fff; font-size: 10.5px; font-weight: 800;
    padding: 1px 7px; border-radius: 999px; margin-left: 6px;
  }
  .totals .net-payable {
    margin-top: 10px; padding: 14px 16px; border-radius: 10px;
    background: linear-gradient(135deg, var(--red) 0%, var(--red-deep) 100%);
    color: #fff; display: flex; justify-content: space-between; align-items: center;
    box-shadow: 0 8px 18px rgba(200,16,46,0.30);
  }
  .net-payable .lbl { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--yellow-soft); }
  .net-payable .amt { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 700; color: #fff; }
  .thanks { text-align: center; padding: 6px 0 26px; }
  .thanks .burst { margin: 0 auto 10px; width: 46px; height: 46px; }
  .thanks h4 { font-family: 'Fraunces', serif; font-size: 20px; margin: 0; color: var(--red); font-weight: 700; }
  .thanks p { margin: 6px 0 0; font-size: 13px; color: #6B6350; font-style: italic; }
  .garland-divider { display: flex; justify-content: center; align-items: center; gap: 2px; padding: 0 40px 24px; }
  .garland-divider svg { width: 24px; height: 24px; margin: 0 -3px; }
  .panels { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; padding: 0 40px 30px; }
  .panel { background: var(--sand); border-radius: 12px; padding: 18px 20px; border: 1px solid rgba(27,36,64,0.08); }
  .panel.safety { background: #FDE7E1; }
  .panel h4 {
    font-family: 'Fraunces', serif; font-size: 13.5px; margin: 0 0 12px; color: var(--red);
    text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 7px; font-weight: 700;
  }
  .panel h4 svg { width: 15px; height: 15px; }
  .panel ol { margin: 0; padding-left: 18px; }
  .panel li { font-size: 12.2px; line-height: 1.65; color: #3C4260; margin-bottom: 9px; }
  .panel li .ta { display: block; font-size: 11.2px; color: #7A7460; margin-top: 1px; }
  .footer {
    background: var(--navy-deep); color: rgba(255,251,239,0.82);
    padding: 20px 40px; text-align: center; font-size: 12px;
  }
  .footer b { color: var(--yellow-soft); letter-spacing: 0.6px; font-weight: 800; font-size: 13.5px; }
  .footer .tag { margin-top: 4px; font-size: 11.3px; color: rgba(255,251,239,0.55); }
`;

/**
 * Generates an ultra-premium, pixel-perfect PDF matching jj-crackers-invoice.html
 */
export async function generateReceipt(data: ReceiptData): Promise<jsPDF> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    // SSR fallback dummy
    return new jsPDF('p', 'mm', 'a4');
  }

  // Ensure fonts are loaded
  if (document.fonts) {
    try {
      await document.fonts.ready;
    } catch { /* continue */ }
  }

  // Create clean offscreen rendering container to ensure perfect desktop layout on ALL devices (mobile/desktop)
  const renderContainer = document.createElement('div');
  renderContainer.id = 'jj-pdf-offscreen-render';
  renderContainer.style.position = 'fixed';
  renderContainer.style.left = '-9999px';
  renderContainer.style.top = '0';
  renderContainer.style.width = '860px';
  renderContainer.style.zIndex = '-9999';
  renderContainer.style.background = '#FFFBEF';
  renderContainer.style.overflow = 'visible';

  // Inject style tag + HTML content
  const styleEl = document.createElement('style');
  styleEl.textContent = INVOICE_CSS;
  renderContainer.appendChild(styleEl);

  const wrapper = document.createElement('div');
  wrapper.innerHTML = buildInvoiceHtml(data);
  renderContainer.appendChild(wrapper);

  document.body.appendChild(renderContainer);

  // Wait briefly for images and layout to render cleanly
  await new Promise(r => setTimeout(r, 120));

  const sheetEl = renderContainer.querySelector('.sheet') as HTMLElement || renderContainer;

  try {
    const canvas = await html2canvas(sheetEl, {
      scale: 2, // 2x high resolution for retina crispness
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FFFBEF',
      logging: false,
      width: 860,
      windowWidth: 1024,
    });

    const doc = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = 210;
    const pdfHeight = 297;
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    let heightLeft = imgHeight;
    let position = 0;

    doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position -= pdfHeight;
      doc.addPage();
      doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    return doc;
  } finally {
    if (renderContainer.parentNode) {
      document.body.removeChild(renderContainer);
    }
  }
}

/**
 * Downloads the generated PDF to user's device
 */
export function downloadReceipt(doc: jsPDF, orderNumber: string) {
  doc.save('JJ-Crackers-Receipt-' + String(orderNumber || 'order') + '.pdf');
}
