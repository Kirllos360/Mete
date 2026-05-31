import { Module } from '@nestjs/common';
import { ReadingsController } from './readings.controller';
import { ReadingsService } from './readings.service';
import { ThresholdsModule } from '../projects/thresholds/thresholds.module';
import { PrismaService } from '../common/database/prisma.service';

@Module({
  imports: [ThresholdsModule],
  controllers: [ReadingsController],
  providers: [ReadingsService, PrismaService]
})
export class ReadingsModule {}
