import { Injectable, Logger } from '@nestjs/common';
import { Response } from 'express';
import { InvoiceDocument } from './invoice-document.model';
import { getChargeGroupName } from './charge-groups';

@Injectable()
export class InvoiceTemplateService {
  private readonly logger = new Logger(InvoiceTemplateService.name);
  private browserPromise: Promise<any> | null = null;

  private async getBrowser(): Promise<any> {
    if (!this.browserPromise) {
      this.browserPromise = (async () => {
        try {
          const p = require('puppeteer');
          const browser = await p.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
          this.logger.log('Puppeteer ready');
          return browser;
        } catch (e: any) {
          this.logger.warn(`Puppeteer unavailable: ${e.message}`);
          return null;
        }
      })();
    }
    return this.browserPromise;
  }

  async renderInvoice(doc: InvoiceDocument, res: Response) {
    const html = this.buildHtml(doc);
    const browser = await this.getBrowser();
    if (browser) {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const pdf = await page.pdf({ format: 'A4', landscape: true, margin: { top: 5, right: 5, bottom: 5, left: 5 } });
      await page.close();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=invoice-${doc.invoiceNumber}.pdf`);
      return res.send(pdf);
    }
    // Fallback to pdfkit
    const PDFDocument = require('pdfkit');
    const doc2 = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${doc.invoiceNumber}.pdf`);
    doc2.pipe(res);
    doc2.fontSize(20).text(doc.invoiceTitle, { align: 'center' });
    doc2.fontSize(12).text(`Invoice #: ${doc.invoiceNumber}`);
    doc2.text(`Total: ${doc.totalAmount}`);
    doc2.end();
  }

  private buildHtml(d: InvoiceDocument): string {
    const chargeRows = d.chargeLines.map(l => `
      <tr><td style="text-align:right">${getChargeGroupName(l.chargeGroup, 'ar')} - ${l.chargeName}</td><td style="text-align:center">${l.quantity}</td><td style="text-align:left">${l.rateAmount.toFixed(3)}</td><td style="text-align:left">${l.lineAmount.toFixed(3)}</td></tr>
    `).join('');

    const chargeGroupSummary = this.buildChargeGroupSummary(d.chargeLines);

    return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="utf-8"><style>
  @page { size: landscape; margin: 5mm; }
  body{font-family:'DejaVu Sans','Arial',sans-serif;font-size:10px;margin:10px;color:#222}
  .header{text-align:center;margin-bottom:10px;border-bottom:2px solid #000066;padding-bottom:8px}
  .header h1{font-size:18px;color:#000066;margin:0}
  .header .sub{font-size:9px;color:#666}
  table{width:100%;border-collapse:collapse;margin-bottom:6px}
  th,td{border:1px solid #999;padding:3px 5px;font-size:9px;text-align:right}
  th{background:#CCCCFF;font-weight:bold;text-align:center}
  .section-title{font-size:11px;font-weight:bold;color:#000066;margin:8px 0 4px 0;padding:3px 5px;background:#E8E8FF}
  .totals-table td:last-child{font-weight:bold}
  .footer{text-align:center;font-size:8px;color:#999;margin-top:12px;border-top:1px solid #ccc;padding-top:6px}
  .left{text-align:left}
  .center{text-align:center}
  .amount{text-align:left;font-family:'DejaVu Sans Mono',monospace}
  .logo{max-height:50px;max-width:150px}
</style></head>
<body>
  <div class="header">
    ${d.companyLogo ? `<img src="${d.companyLogo}" class="logo" alt="Logo" />` : ''}
    <h1>${d.invoiceTitle}</h1>
    <div class="sub">${d.companyNameAr || d.companyName} | ${d.companyLicense || ''}</div>
  </div>

  <table>
    <tr><th style="width:15%">رقم الفاتورة</th><td style="width:18%">${d.invoiceNumber}</td><th style="width:15%">التاريخ</th><td style="width:18%">${d.issueDate}</td><th style="width:15%">الحالة</th><td style="width:18%">${d.status}</td></tr>
    <tr><th>العميل</th><td colspan="2">${d.customerNameAr || d.customerName}${d.customerTenant ? ' / ' + d.customerTenant : ''}</td><th>العداد</th><td colspan="2">${d.meterSerial}</td></tr>
    <tr><th>الوحدة</th><td>${d.unitNumber || '-'}</td><th>المشروع</th><td>${d.projectName}</td><th>فترة الفاتورة</th><td>${d.billingPeriod}</td></tr>
    <tr><th>القراءة السابقة</th><td>${d.startReading ?? '-'}</td><th>القراءة الحالية</th><td>${d.endReading ?? '-'}</td><th>الاستهلاك (${d.unit})</th><td>${d.consumption}</td></tr>
  </table>

  <div class="section-title">تفاصيل الرسوم / Charge Details</div>
  <table>
    <tr><th style="width:40%">البيان</th><th style="width:15%">الكمية</th><th style="width:20%">سعر الوحدة</th><th style="width:25%">الإجمالي</th></tr>
    ${chargeRows || '<tr><td colspan="4" class="center">لا توجد رسوم</td></tr>'}
  </table>

  ${chargeGroupSummary}

  <div class="section-title">ملخص الفاتورة / Invoice Summary</div>
  <table class="totals-table">
    <tr><td style="width:40%">الرصيد السابق</td><td class="amount">${d.balanceBefore.toFixed(3)}</td><td style="width:40%">Previous Balance</td></tr>
    <tr><td>المصاريف الحالية</td><td class="amount">${d.currentCharges.toFixed(3)}</td><td>Current Charges</td></tr>
    <tr><td>تسويات</td><td class="amount">${d.adjustments.toFixed(3)}</td><td>Adjustments</td></tr>
    <tr><td>المدفوعات</td><td class="amount">${(d.payments || 0).toFixed(3)}</td><td>Payments</td></tr>
    <tr><td>الضريبة</td><td class="amount">${d.taxAmount.toFixed(3)}</td><td>Tax</td></tr>
    <tr style="font-weight:bold;background:#E8E8FF"><td>الرصيد بعد الفاتورة</td><td class="amount">${d.balanceAfter.toFixed(3)}</td><td>Balance After</td></tr>
  </table>

  <div class="footer">
    ${d.companyBankDetails ? `<div>${d.companyBankDetails}</div>` : ''}
    ${d.companySignature ? `<img src="${d.companySignature}" style="max-height:30px" alt="Signature" />` : ''}
    <div>Meter Verse / عالم العدادات | ${d.generatedAt}</div>
  </div>
</body></html>`;
  }

  private buildChargeGroupSummary(lines: any[]): string {
    const groups: Record<number, number> = {};
    for (const l of lines) { groups[l.chargeGroup] = (groups[l.chargeGroup] || 0) + l.lineAmount; }
    const rows = Object.entries(groups).map(([gid, total]) => `
      <tr><td>${getChargeGroupName(Number(gid), 'ar')}</td><td class="amount">${total.toFixed(3)}</td><td>${getChargeGroupName(Number(gid), 'en')}</td></tr>
    `).join('');
    return `
    <div class="section-title">ملخص مجموعات الرسوم / Charge Group Summary</div>
    <table><tr><th style="width:40%">المجموعة</th><th style="width:25%">الإجمالي</th><th style="width:35%">Group</th></tr>${rows}</table>`;
  }
}
