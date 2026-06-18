import { Module } from '@nestjs/common';
import { DatabaseModule } from '../common/database/database.module';
import { InvoicesController } from './invoices.controller';
import { InvoiceRendererService } from './invoice-renderer.service';
import { CalculationEngineService } from '../billing/calculation-engine.service';

@Module({
  imports: [DatabaseModule],
  controllers: [InvoicesController],
  providers: [InvoiceRendererService, CalculationEngineService],
  exports: [InvoiceRendererService, CalculationEngineService],
})
export class InvoicesModule {}
