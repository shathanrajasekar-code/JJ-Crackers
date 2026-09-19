import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '../jj-crackers-invoice.html');
  const outPdfPath = path.resolve(__dirname, '../public/jj-crackers-invoice.pdf');

  console.log('HTML path:', htmlPath);
  console.log('Output PDF path:', outPdfPath);

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  
  // Load html
  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
  console.log('Navigating to:', fileUrl);
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });

  // Generate PDF
  await page.pdf({
    path: outPdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' }
  });

  await browser.close();
  console.log('PDF generated successfully!');
  const stats = fs.statSync(outPdfPath);
  console.log('PDF file size:', stats.size, 'bytes');
}

main().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
