import { Module } from '@nestjs/common';
import { DatabaseModule } from '../common/database/database.module';
import { InvoicesController } from './invoices.controller';
import { InvoiceTemplateService } from './invoice-template.service';
import { InvoiceRendererService } from './invoice-renderer.service';
import { CalculationEngineService } from '../billing/calculation-engine.service';

@Module({
  imports: [DatabaseModule],
  controllers: [InvoicesController],
  providers: [InvoiceTemplateService, InvoiceRendererService, CalculationEngineService],
  exports: [InvoiceTemplateService, InvoiceRendererService, CalculationEngineService],
})
export class InvoicesModule {}
