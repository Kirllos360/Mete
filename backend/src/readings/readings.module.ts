import { Module } from '@nestjs/common';
import { ReadingsController } from './readings.controller';
import { ReadingsService } from './readings.service';
import { ThresholdsModule } from '../projects/thresholds/thresholds.module';
import { PrismaService } from '../common/database/prisma.service';
import { PollingModule } from './polling/polling.module';

@Module({
  imports: [ThresholdsModule, PollingModule],
  controllers: [ReadingsController],
  providers: [ReadingsService, PrismaService]
})
export class ReadingsModule {}
