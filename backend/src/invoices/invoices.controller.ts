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
    const invoices = await this.prisma.invoice.findMany({ orderBy: { createdAt: 'desc' } });
    const data = await Promise.all(invoices.map(async (inv) => {
      const lines = await this.prisma.invoiceLine.findMany({ where: { invoiceId: inv.id } });
      return {
        invoiceNumber: inv.invoiceNumber,
        customerName: inv.customerId,
        meterSerial: inv.meterId,
        consumption: lines.reduce((s, l) => s + Number(l.quantity), 0),
        lines: lines.map(l => ({ description: l.description, quantity: Number(l.quantity), unitPrice: Number(l.unitPrice), lineAmount: Number(l.lineAmount) })),
        subtotal: Number(inv.subtotalAmount),
        taxAmount: Number(inv.taxAmount),
        totalAmount: Number(inv.totalAmount),
        balanceBefore: 0,
        balanceAfter: Number(inv.remainingAmount),
        issueDate: inv.issuedAt?.toISOString().slice(0, 10),
        dueDate: inv.dueAt?.toISOString().slice(0, 10),
        status: inv.status,
      };
    }));
    await this.renderer.renderBatchPdf(data, res);
  }
}
