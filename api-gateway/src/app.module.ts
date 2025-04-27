import { Module } from '@nestjs/common';
import { AirQualityModule } from './air-quality/air-quality.module';

@Module({
  imports: [AirQualityModule],
})
export class AppModule {}
