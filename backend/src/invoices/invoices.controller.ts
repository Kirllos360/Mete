import { Controller, Get, Post, Param, Res, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/types/role.enum';
import { PrismaService } from '../common/database/prisma.service';
import { InvoiceTemplateService } from './invoice-template.service';
import { InvoiceDocument } from './invoice-document.model';
import { getUtilityConfig } from '../utilities/utility-config';
import { getChargeGroupName } from './charge-groups';

@ApiTags('Invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly template: InvoiceTemplateService,
  ) {}

  @Get(':id/pdf')
  @Roles(Role.OPERATOR, Role.ADMIN, Role.SUPER_ADMIN, Role.FINANCE)
  @ApiOperation({ summary: 'Download invoice as PDF (Master Template)' })
  async downloadPdf(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    const inv = await this.prisma.invoice.findUnique({ where: { id } });
    if (!inv) return res.status(404).json({ error: 'Invoice not found' });

    const lines = await this.prisma.invoiceLine.findMany({ where: { invoiceId: id } });
    const project = await this.prisma.project.findUnique({ where: { id: inv.projectId } }).catch(() => null);
    const meter = await this.prisma.meter.findUnique({ where: { id: inv.meterId } }).catch(() => null);
    const period = await this.prisma.billingPeriod.findUnique({ where: { id: inv.billingPeriodId } }).catch(() => null);

    const chargeLines = lines.map(l => ({
      chargeCode: '',
      chargeName: l.description,
      chargeNameAr: l.description,
      chargeGroup: (l as any).chargeGroup ?? 0,
      quantity: Number(l.quantity),
      rateAmount: Number(l.unitPrice),
      lineAmount: Number(l.lineAmount),
    }));

    const subtotal = chargeLines.reduce((s, l) => s + l.lineAmount, 0);
    const taxAmount = Number(inv.taxAmount);
    const totalAmount = subtotal + taxAmount;
    const balanceBefore = Number((inv as any).balanceBefore ?? 0);
    const balanceAfter = balanceBefore + totalAmount;
    const consumption = chargeLines.filter(l => l.chargeGroup === 0).reduce((s, l) => s + l.quantity, 0);

    const utilConfig: any = getUtilityConfig(inv.utilityType);
    const cfg = utilConfig;

    const doc: InvoiceDocument = {
      invoiceNumber: inv.invoiceNumber,
      invoiceTitle: cfg.invoiceTitle || 'فاتورة',
      utilityType: inv.utilityType,
      billingPeriod: period?.periodCode ?? '',
      issueDate: inv.issuedAt?.toISOString().slice(0, 10) ?? inv.createdAt.toISOString().slice(0, 10),
      dueDate: inv.dueAt?.toISOString().slice(0, 10) ?? '',
      status: inv.status,
      companyName: project?.name ?? '',
      companyNameAr: project?.name ?? '',
      companyLogo: (project as any)?.logo ?? undefined,
      companyLicense: (project as any)?.license ?? undefined,
      companySignature: (project as any)?.signature ?? undefined,
      companyBankDetails: (project as any)?.bankDetails ?? undefined,
      customerId: inv.customerId,
      customerName: inv.customerId,
      projectName: project?.name ?? '',
      unitNumber: inv.unitId === 'system' ? undefined : inv.unitId,
      meterSerial: (meter?.serialNumber as string) ?? (inv as any).meterSerial ?? inv.meterId,
      meterType: meter?.meterType ?? '',
      consumption,
      unit: cfg.unit || 'kWh',
      startReading: undefined,
      endReading: undefined,
      tariffName: undefined,
      balanceBefore,
      currentCharges: subtotal,
      adjustments: 0,
      payments: Number(inv.paidAmount),
      balanceAfter,
      subtotal,
      taxAmount,
      totalAmount,
      currency: 'EGP',
      chargeLines,
      generatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };

    await this.template.renderInvoice(doc, res);
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
        zip.file(`invoice-${inv.invoiceNumber}.json`, JSON.stringify({ invoiceNumber: inv.invoiceNumber, status: inv.status, total: inv.totalAmount, lines: lines.length }, null, 2));
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
