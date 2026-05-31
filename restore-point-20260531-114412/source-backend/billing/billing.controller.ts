import { Controller, Post, Param, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/types/role.enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Invoices')
@Controller()
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class BillingController {
  @Post('invoices/generate')
  @Roles(Role.OPERATOR, Role.PROJECT_ADMIN, Role.SUPER_ADMIN, Role.FINANCE)
  @HttpCode(HttpStatus.ACCEPTED)
  async generateInvoices(@Body() _body: Record<string, unknown>) {
    return { batchId: '00000000-0000-0000-0000-000000000000', generatedCount: 0 };
  }

  @Post('invoices/:invoiceId/issue')
  @Roles(Role.OPERATOR, Role.PROJECT_ADMIN, Role.SUPER_ADMIN, Role.FINANCE)
  @HttpCode(HttpStatus.OK)
  async issueInvoice(@Param('invoiceId') _invoiceId: string) {
    return { status: 'issued' };
  }

  @Post('invoices/:invoiceId/adjustments')
  @Roles(Role.OPERATOR, Role.PROJECT_ADMIN, Role.SUPER_ADMIN, Role.FINANCE)
  @HttpCode(HttpStatus.CREATED)
  async addInvoiceAdjustment(
    @Param('invoiceId') _invoiceId: string,
    @Body() _body: Record<string, unknown>
  ) {
    return {
      id: '00000000-0000-0000-0000-000000000000',
      adjustmentType: 'credit',
      amount: 0,
      reason: ''
    };
  }
}
