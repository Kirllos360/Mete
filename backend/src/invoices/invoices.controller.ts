import { Controller, Get, Post, Param, Res, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/types/role.enum';
import { PrismaService } from '../common/database/prisma.service';
import { InvoiceRendererService } from './invoice-renderer.service';

@ApiTags('Invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly renderer: InvoiceRendererService,
  ) {}

  @Get(':id/pdf')
  @Roles(Role.OPERATOR, Role.ADMIN, Role.SUPER_ADMIN, Role.FINANCE)
  @ApiOperation({ summary: 'Download invoice as PDF (HTML rendered)' })
  async downloadPdf(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id } });
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    const lines = await this.prisma.invoiceLine.findMany({ where: { invoiceId: id } });
    await this.renderer.renderInvoicePdf({
      invoiceNumber: invoice.invoiceNumber,
      customerName: invoice.customerId,
      meterSerial: invoice.meterId,
      consumption: lines.reduce((s, l) => s + Number(l.quantity), 0),
      lines: lines.map(l => ({ description: l.description, quantity: Number(l.quantity), unitPrice: Number(l.unitPrice), lineAmount: Number(l.lineAmount) })),
      subtotal: Number(invoice.subtotalAmount),
      taxAmount: Number(invoice.taxAmount),
      totalAmount: Number(invoice.totalAmount),
      balanceBefore: 0,
      balanceAfter: Number(invoice.remainingAmount),
      issueDate: invoice.issuedAt?.toISOString().slice(0, 10),
      dueDate: invoice.dueAt?.toISOString().slice(0, 10),
      status: invoice.status,
    }, res);
  }

  @Post('batch-download')
  @Roles(Role.OPERATOR, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Download all invoices as ZIP' })
  async batchDownload(@Res() res: Response) {
    try {
      const invoices = await this.prisma.invoice.findMany({ orderBy: { createdAt: 'desc' }, take: 10 });
      const JSZip = require('jszip');
      const zip = new JSZip();

      for (const inv of invoices) {
        const lines = await this.prisma.invoiceLine.findMany({ where: { invoiceId: inv.id } });
        const data = {
          invoiceNumber: inv.invoiceNumber, customerName: inv.customerId, meterSerial: inv.meterId,
          consumption: lines.reduce((s: number, l: any) => s + Number(l.quantity), 0),
          lines: lines.map((l: any) => ({ description: l.description, quantity: Number(l.quantity), unitPrice: Number(l.unitPrice), lineAmount: Number(l.lineAmount) })),
          subtotal: Number(inv.subtotalAmount), taxAmount: Number(inv.taxAmount), totalAmount: Number(inv.totalAmount),
          issueDate: inv.issuedAt?.toISOString().slice(0, 10), status: inv.status,
        };
        zip.file(`invoice-${inv.invoiceNumber}.json`, JSON.stringify(data, null, 2));
      }

      const content = await zip.generateAsync({ type: 'nodebuffer' });
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename=invoices-batch.zip');
      res.send(content);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }
}
