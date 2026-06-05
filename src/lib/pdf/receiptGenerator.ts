import jsPDF from 'jspdf';

interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
  mrp: number;
  category?: string;
}

interface ReceiptData {
  orderNumber: string;
  date: string;
  customerName: string;
  customerEmail: string;
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
}

// ─── COLOR CONSTANTS ────────────────────────────────────────────────────────
const C = {
  black:     [30, 30, 30]     as const,
  dark:      [55, 55, 55]     as const,
  mid:       [110, 110, 110]  as const,
  light:     [160, 160, 160]  as const,
  border:    [200, 200, 200]  as const,
  bgRow:     [248, 248, 248]  as const,
  bgCard:    [245, 245, 245]  as const,
  white:     [255, 255, 255]  as const,
  gold:      [184, 134, 11]   as const,
  green:     [22, 128, 57]    as const,
  greenBg:   [235, 250, 240]  as const,
  greenBdr:  [34, 160, 72]    as const,
  tableHead: [38, 38, 38]     as const,
};

const PAGE_W = 210;
const PAGE_H = 297;
const M = 14;
const CW = PAGE_W - M * 2;
const FOOTER_ZONE = 20;
const MAX_Y = PAGE_H - M - FOOTER_ZONE;

// ─── Rupee formatter (uses "Rs." to avoid font glyph issues) ────────────────
function rs(n: number): string {
  return 'Rs. ' + n.toLocaleString('en-IN');
}

// ─── MAIN EXPORT ────────────────────────────────────────────────────────────
export async function generateReceipt(data: ReceiptData): Promise<jsPDF> {
  const doc = new jsPDF('p', 'mm', 'a4');
  let y = M;

  // ─── Load logo ────────────────────────────────────────────────────────
  let logoLoaded = false;
  const logoImg = new Image();
  logoImg.crossOrigin = 'anonymous';
  try {
    await new Promise<void>((resolve) => {
      logoImg.onload = () => { logoLoaded = true; resolve(); };
      logoImg.onerror = () => resolve();
      logoImg.src = '/jj-crackers-logo.png';
    });
  } catch { /* silent */ }

  // ═══════════════════════════════════════════════════════════════════════
  //  COLUMN LAYOUT — well-spaced, no overflow
  //  Total content width = 182mm (M=14 on each side)
  // ═══════════════════════════════════════════════════════════════════════
  //  S.No: 10mm | Product: 62mm | Category: 24mm | Qty: 14mm | MRP: 22mm | Offer: 24mm | Total: 26mm = 182
  const col = {
    sno:     M,             // x = 14, width = 10
    prod:    M + 10,        // x = 24, width = 62
    cat:     M + 72,        // x = 86, width = 24
    qty:     M + 96,        // x = 110, width = 14
    mrp:     M + 110,       // x = 124, width = 22
    offer:   M + 132,       // x = 146, width = 24
    total:   M + 156,       // x = 170, width = 26
    end:     M + CW,        // x = 196
  };
  const colBorders = [col.sno, col.prod, col.cat, col.qty, col.mrp, col.offer, col.total, col.end];

  // ═══════════════════════════════════════════════════════════════════════
  //  HELPER: Company Header (repeated every page)
  // ═══════════════════════════════════════════════════════════════════════
  const drawCompanyHeader = (isFirstPage: boolean) => {
    y = M;

    // Logo
    if (logoLoaded && logoImg.complete && logoImg.naturalHeight > 0) {
      doc.addImage(logoImg, 'PNG', M, y, 20, 20);
    }

    // Company name block
    const tx = M + 24;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(...C.black);
    doc.text('JJ CRACKERS', tx, y + 7);

    doc.setFontSize(8);
    doc.setTextColor(...C.gold);
    doc.text('JEGAJOTHI CRACKERS | PREMIUM SIVAKASI FIREWORKS', tx, y + 12.5);

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.mid);
    doc.text('1/406, Sivakasi-Vembakottai Main Road, Opp. EB Office, Vembakottai, Tamil Nadu', tx, y + 16.5);
    doc.text('Phone: +91 70923 00252  |  Email: jjcrackersworld@gmail.com', tx, y + 20);

    // Receipt title (right side)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(...C.gold);
    doc.text('ORDER RECEIPT', PAGE_W - M, y + 7, { align: 'right' });

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.mid);
    if (isFirstPage) {
      doc.text('ORIGINAL FOR CUSTOMER - ' + String(data.customerName || ''), PAGE_W - M, y + 12, { align: 'right' });
    } else {
      doc.text('Order: ' + String(data.orderNumber || '') + '  (Continued)', PAGE_W - M, y + 12, { align: 'right' });
    }

    y += 24;

    // Separator line
    doc.setDrawColor(...C.border);
    doc.setLineWidth(0.5);
    doc.line(M, y, PAGE_W - M, y);
    y += 5;
  };

  // ═══════════════════════════════════════════════════════════════════════
  //  HELPER: Footer (post-processed on every page)
  // ═══════════════════════════════════════════════════════════════════════
  const drawFooter = (pageNum: number, totalPgs: number) => {
    const fy = PAGE_H - M - FOOTER_ZONE + 4;
    doc.setDrawColor(...C.border);
    doc.setLineWidth(0.3);
    doc.line(M, fy, PAGE_W - M, fy);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...C.black);
    doc.text('JJ CRACKERS  |  SIVAKASI', PAGE_W / 2, fy + 5, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(...C.mid);
    doc.text('Premium Friendly Sivakasi Fireworks Since 1984  |  Contact: +91 70923 00252', PAGE_W / 2, fy + 9, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(...C.dark);
    doc.text('Page ' + pageNum + ' of ' + totalPgs, PAGE_W / 2, fy + 14, { align: 'center' });
  };

  // ═══════════════════════════════════════════════════════════════════════
  //  HELPER: Draw Table Header with vertical borders
  // ═══════════════════════════════════════════════════════════════════════
  const TH = 7; // table header row height

  const drawTableHeader = () => {
    // Dark background
    doc.setFillColor(...C.tableHead);
    doc.rect(M, y, CW, TH, 'F');

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.white);

    const ty = y + 4.8;
    doc.text('S.No',               col.sno + 2,         ty);
    doc.text('Product Description', col.prod + 2,        ty);
    doc.text('Category',            col.cat + 2,         ty);
    doc.text('Qty',                 col.qty + 12,        ty, { align: 'right' });
    doc.text('MRP',                 col.mrp + 20,        ty, { align: 'right' });
    doc.text('Offer Price',         col.offer + 22,      ty, { align: 'right' });
    doc.text('Total',               col.end - 2,         ty, { align: 'right' });

    // Vertical white separators inside header
    doc.setDrawColor(...C.white);
    doc.setLineWidth(0.15);
    for (let i = 1; i < colBorders.length - 1; i++) {
      doc.line(colBorders[i], y, colBorders[i], y + TH);
    }

    y += TH;
  };

  // ═══════════════════════════════════════════════════════════════════════
  //  HELPER: Draw vertical grid lines for a table row
  // ═══════════════════════════════════════════════════════════════════════
  const ROW_H = 7.5;

  const drawRowBorders = (rowY: number) => {
    doc.setDrawColor(...C.border);
    doc.setLineWidth(0.15);
    // Vertical lines
    for (const bx of colBorders) {
      doc.line(bx, rowY, bx, rowY + ROW_H);
    }
    // Bottom horizontal line
    doc.line(M, rowY + ROW_H, PAGE_W - M, rowY + ROW_H);
  };

  // ═══════════════════════════════════════════════════════════════════════
  //  HELPER: New page with header + table header
  // ═══════════════════════════════════════════════════════════════════════
  const startNewPage = () => {
    doc.addPage();
    drawCompanyHeader(false);
    drawTableHeader();
  };

  // ═══════════════════════════════════════════════════════════════════════
  //  PAGE 1: Header
  // ═══════════════════════════════════════════════════════════════════════
  drawCompanyHeader(true);

  // ── Order Info Card ──────────────────────────────────────────────────
  const cardH = 16;
  doc.setFillColor(...C.bgCard);
  doc.setDrawColor(...C.border);
  doc.setLineWidth(0.3);
  doc.roundedRect(M, y, CW, cardH, 1.5, 1.5, 'FD');

  // Row 1: Order Ref & Date
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...C.dark);
  doc.text('Order Reference:', M + 6, y + 5.5);
  doc.setTextColor(...C.gold);
  doc.text(String(data.orderNumber || ''), M + 38, y + 5.5);

  doc.setTextColor(...C.dark);
  doc.text('Order Date:', M + 100, y + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.mid);
  doc.text(String(data.date || ''), M + 122, y + 5.5);

  // Row 2: Order Status — CONFIRMED badge
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.dark);
  doc.text('Order Status:', M + 6, y + 11.5);

  // Green badge — wider to prevent clipping
  const bx = M + 38;
  const by = y + 8;
  const bw = 32;
  const bh = 5.5;
  doc.setFillColor(...C.greenBg);
  doc.setDrawColor(...C.greenBdr);
  doc.setLineWidth(0.5);
  doc.roundedRect(bx, by, bw, bh, 1.5, 1.5, 'FD');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.green);
  doc.text('CONFIRMED', bx + bw / 2, by + 3.8, { align: 'center' });

  y += cardH + 5;

  // ── Customer Details — 2-Column Card ───────────────────────────────
  const custState = data.customerState || '';
  const custDistrict = data.customerDistrict || '';
  const custAddress = data.customerAddress || '';
  const custCity = data.customerCity || '';
  const custPincode = data.customerPincode || '';
  const hasAddr = !!(custAddress || custCity || custPincode);
  const boxH = hasAddr ? 34 : 26;

  doc.setFillColor(...C.bgCard);
  doc.setDrawColor(...C.border);
  doc.setLineWidth(0.3);
  doc.roundedRect(M, y, CW, boxH, 1.5, 1.5, 'FD');

  // Vertical divider
  const midX = M + CW / 2;
  doc.setDrawColor(...C.border);
  doc.setLineWidth(0.2);
  doc.line(midX, y + 2, midX, y + boxH - 2);

  // LEFT: Customer Details
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.gold);
  doc.text('CUSTOMER DETAILS', M + 6, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...C.black);
  doc.text(String(data.customerName || ''), M + 6, y + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...C.dark);
  doc.text('Phone:  ' + String(data.customerPhone || ''), M + 6, y + 17);
  if (data.customerEmail) {
    doc.text('Email:  ' + String(data.customerEmail), M + 6, y + 21.5);
  }
  if (hasAddr) {
    doc.setFontSize(6.5);
    doc.setTextColor(...C.mid);
    const addr = [custAddress, custCity, custPincode].filter(Boolean).join(', ');
    const addrLines = doc.splitTextToSize(addr, CW / 2 - 14);
    doc.text(addrLines, M + 6, data.customerEmail ? y + 26 : y + 21.5);
  }

  // RIGHT: Place of Supply & Transport
  const rx = midX + 6;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.gold);
  doc.text('PLACE OF SUPPLY & TRANSPORT', rx, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  const supplyData = [
    ['State:', custState || 'N/A'],
    ['District:', custDistrict || 'N/A'],
    ['Destination:', custCity || 'N/A'],
    ['Postal Code:', custPincode || 'N/A'],
  ];
  let ry = y + 12;
  for (const [label, value] of supplyData) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.dark);
    doc.text(label, rx, ry);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.black);
    doc.text(String(value), rx + 26, ry);
    ry += 4.5;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...C.gold);
  doc.text('Pickup: Nearest Transport Office Hub', rx, ry + 1);

  y += boxH + 5;

  // ═══════════════════════════════════════════════════════════════════════
  //  PRODUCT TABLE
  // ═══════════════════════════════════════════════════════════════════════

  // Top border of entire table
  doc.setDrawColor(...C.border);
  doc.setLineWidth(0.3);
  doc.line(M, y, PAGE_W - M, y);

  drawTableHeader();

  data.items.forEach((item, index) => {
    // Check for page break
    if (y > MAX_Y - ROW_H) {
      startNewPage();
    }

    const rowTop = y;

    // Alternating row background
    if (index % 2 === 0) {
      doc.setFillColor(...C.bgRow);
      doc.rect(M, rowTop, CW, ROW_H, 'F');
    }

    const ty = rowTop + 5;

    // S.No
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...C.mid);
    doc.text(String(index + 1), col.sno + 5, ty, { align: 'center' });

    // Product Description
    doc.setTextColor(...C.black);
    doc.setFont('helvetica', 'normal');
    const nameStr = String(item.name || '');
    const maxNameW = col.cat - col.prod - 4;
    const nameLines = doc.splitTextToSize(nameStr, maxNameW);
    doc.text(nameLines[0] || '', col.prod + 2, ty);

    // Category
    doc.setTextColor(...C.mid);
    doc.setFontSize(6.5);
    const catStr = String(item.category || '-');
    const catTrunc = catStr.length > 12 ? catStr.substring(0, 10) + '..' : catStr;
    doc.text(catTrunc, col.cat + 2, ty);
    doc.setFontSize(7);

    // Qty (right-aligned)
    doc.setTextColor(...C.dark);
    doc.text(String(item.quantity || 0), col.qty + 12, ty, { align: 'right' });

    // MRP (right-aligned)
    doc.setTextColor(...C.light);
    doc.text(rs(item.mrp || 0), col.mrp + 20, ty, { align: 'right' });

    // Offer Price (right-aligned)
    doc.setTextColor(...C.dark);
    doc.text(rs(item.price || 0), col.offer + 22, ty, { align: 'right' });

    // Total (right-aligned, bold)
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.black);
    const lineTotal = (item.price || 0) * (item.quantity || 0);
    doc.text(rs(lineTotal), col.end - 2, ty, { align: 'right' });
    doc.setFont('helvetica', 'normal');

    // Draw row grid lines
    drawRowBorders(rowTop);

    y += ROW_H;
  });

  // ═══════════════════════════════════════════════════════════════════════
  //  TOTALS (last page only)
  // ═══════════════════════════════════════════════════════════════════════

  // Ensure enough space for totals + signature + terms (~80mm)
  if (y > MAX_Y - 80) {
    doc.addPage();
    drawCompanyHeader(false);
  }

  y += 5;

  // Subtotal
  const totLabelX = M + 110;
  const totValueX = PAGE_W - M - 4;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.mid);
  doc.text('Sub Total:', totLabelX, y);
  doc.setTextColor(...C.dark);
  doc.setFont('helvetica', 'bold');
  doc.text(rs(data.subtotal || 0), totValueX, y, { align: 'right' });
  y += 6;

  // Savings
  if (data.discountTotal > 0) {
    doc.setTextColor(...C.green);
    doc.setFont('helvetica', 'bold');
    doc.text('Total Savings:', totLabelX, y);
    doc.text('-' + rs(data.discountTotal), totValueX, y, { align: 'right' });
    y += 6;
  }

  // Divider
  doc.setDrawColor(...C.border);
  doc.setLineWidth(0.3);
  doc.line(totLabelX - 2, y, PAGE_W - M, y);
  y += 4;

  // NET PAYABLE bar
  const npX = totLabelX - 4;
  const npW = PAGE_W - M - npX;
  doc.setFillColor(...C.tableHead);
  doc.roundedRect(npX, y - 2.5, npW, 11, 1.5, 1.5, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.white);
  doc.text('NET PAYABLE:', npX + 5, y + 4.5);
  doc.setTextColor(...C.gold);
  doc.text(rs(data.totalAmount || 0), PAGE_W - M - 4, y + 4.5, { align: 'right' });

  y += 18;

  // ═══════════════════════════════════════════════════════════════════════
  //  CONFIRMED STAMP + AUTHORIZED SIGNATORY
  // ═══════════════════════════════════════════════════════════════════════

  if (y > MAX_Y - 40) {
    doc.addPage();
    drawCompanyHeader(false);
  }

  // ── CONFIRMED Stamp (left) ──
  const stampW = 38;
  const stampH = 12;
  const stampX = M + 4;
  const stampY = y;

  doc.setDrawColor(...C.greenBdr);
  doc.setLineWidth(1.2);
  doc.setFillColor(...C.greenBg);
  doc.roundedRect(stampX, stampY, stampW, stampH, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...C.green);
  doc.text('CONFIRMED', stampX + stampW / 2, stampY + stampH / 2 + 1, { align: 'center' });

  // ── Authorized Signatory (right) ──
  const sigX = PAGE_W - M - 35;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...C.dark);
  doc.text('For JJ Crackers', sigX + 17.5, y + 1, { align: 'center' });

  // Logo as signature
  if (logoLoaded && logoImg.complete && logoImg.naturalHeight > 0) {
    doc.addImage(logoImg, 'PNG', sigX + 8, y + 3, 18, 18);
  }

  const sigLineY = y + 23;
  doc.setDrawColor(...C.border);
  doc.setLineWidth(0.3);
  doc.line(sigX - 3, sigLineY, sigX + 38, sigLineY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...C.mid);
  doc.text('Authorized Signatory', sigX + 17.5, sigLineY + 4, { align: 'center' });

  y += 32;

  // ═══════════════════════════════════════════════════════════════════════
  //  TERMS & CONDITIONS (last page only)
  // ═══════════════════════════════════════════════════════════════════════

  if (y > MAX_Y - 30) {
    doc.addPage();
    drawCompanyHeader(false);
  }

  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.dark);
  doc.text('TERMS & CONDITIONS', M, y);
  y += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.mid);
  doc.setFontSize(6);
  const terms = [
    'Goods once booked cannot be cancelled after dispatch.',
    'Transport charges may apply based on destination.',
    'Delivery depends on transport service availability.',
    'Customers must verify product quantity at pickup.',
    'Fireworks should be used responsibly and safely.',
    'Keep away from children.',
    'Store in a cool and dry place.',
  ];
  terms.forEach((t, i) => {
    doc.text((i + 1) + '. ' + t, M, y);
    y += 3.4;
  });

  // ═══════════════════════════════════════════════════════════════════════
  //  POST-PROCESSING: Footers on all pages
  // ═══════════════════════════════════════════════════════════════════════
  const finalTotal = doc.getNumberOfPages();
  for (let i = 1; i <= finalTotal; i++) {
    doc.setPage(i);
    drawFooter(i, finalTotal);
  }

  return doc;
}

// ─── Download helper ────────────────────────────────────────────────────────
export function downloadReceipt(doc: jsPDF, orderNumber: string) {
  doc.save('JJ-Crackers-Receipt-' + String(orderNumber || 'order') + '.pdf');
}
