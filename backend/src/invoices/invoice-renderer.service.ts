import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Response } from 'express';
import * as puppeteer from 'puppeteer';

@Injectable()
export class InvoiceRendererService implements OnModuleInit {
  private readonly logger = new Logger(InvoiceRendererService.name);
  private browser: any = null;

  async onModuleInit() {
    try {
      this.browser = await puppeteer.launch({ 
        headless: true, 
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
      });
      this.logger.log('Puppeteer browser launched');
    } catch (err) {
      this.logger.warn('Puppeteer not available, PDF generation will fall back to pdfkit');
    }
  }

  async renderInvoicePdf(data: any, res: Response) {
    const html = this.buildInvoiceHtml(data);
    
    if (this.browser) {
      const page = await this.browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const pdf = await page.pdf({ format: 'A4', landscape: true, margin: { top: '5mm', right: '5mm', bottom: '5mm', left: '5mm' } });
      await page.close();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=invoice-${data.invoiceNumber}.pdf`);
      res.send(pdf);
    } else {
      // Fallback to basic PDF
      res.setHeader('Content-Type', 'application/pdf');
      const PDFDocument = require('pdfkit');
      const doc = new PDFDocument({ margin: 50 });
      doc.pipe(res);
      doc.fontSize(20).text('Invoice', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Invoice #: ${data.invoiceNumber}`);
      doc.text(`Total: ${data.totalAmount}`);
      doc.end();
    }
  }

  async renderBatchPdf(invoices: any[], res: Response) {
    const zip = require('archiver')('zip');
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=invoices-batch.zip');
    zip.pipe(res);

    for (const inv of invoices) {
      const html = this.buildInvoiceHtml(inv);
      if (this.browser) {
        const page = await this.browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdf = await page.pdf({ format: 'A4', landscape: true, margin: { top: '5mm', right: '5mm', bottom: '5mm', left: '5mm' } });
        await page.close();
        zip.append(pdf, { name: `invoice-${inv.invoiceNumber}.pdf` });
      }
    }
    zip.finalize();
  }

  private buildInvoiceHtml(data: any): string {
    const { invoiceNumber, customerName, meterSerial, consumption, lines, subtotal, taxAmount, totalAmount, balanceBefore, balanceAfter, issueDate, dueDate, status } = data;
    const lineRows = (lines ?? []).map((l: any) => `
      <tr><td>${l.description}</td><td>${l.quantity}</td><td>${l.unitPrice}</td><td>${l.lineAmount}</td></tr>
    `).join('');

    return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="utf-8"><style>
  body { font-family: 'DejaVu Sans', Arial; font-size: 12px; margin: 20px; }
  .header { text-align: center; font-size: 18px; font-weight: bold; color: #000066; margin-bottom: 20px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
  th, td { border: 1px solid #999; padding: 4px 8px; text-align: right; font-size: 10px; }
  th { background: #CCCCFF; font-weight: bold; }
  .totals { text-align: left; }
  .footer { text-align: center; font-size: 9px; color: #666; margin-top: 20px; }
</style></head>
<body>
  <div class="header">فاتورة كهرباء</div>
  <table>
    <tr><th>رقم الفاتورة</th><td>${invoiceNumber}</td><th>التاريخ</th><td>${issueDate ?? ''}</td></tr>
    <tr><th>العميل</th><td>${customerName ?? ''}</td><th>العداد</th><td>${meterSerial ?? ''}</td></tr>
    <tr><th>الاستهلاك</th><td>${consumption ?? 0}</td><th>الحالة</th><td>${status ?? ''}</td></tr>
  </table>
  <table>
    <tr><th>البيان</th><th>الكمية</th><th>سعر الوحدة</th><th>الإجمالي</th></tr>
    ${lineRows}
  </table>
  <table>
    <tr><td>الإجمالي قبل الضريبة</td><td>${subtotal ?? 0}</td></tr>
    <tr><td>الضريبة</td><td>${taxAmount ?? 0}</td></tr>
    <tr><td>الإجمالي</td><td>${totalAmount ?? 0}</td></tr>
  </table>
</body></html>`;
  }
}
