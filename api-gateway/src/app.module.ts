import { Module } from '@nestjs/common';
import { AlarmModule } from './alarms/alarm.module';
import { AirQualityModule } from './air-quality/air-quality.module';
import { WaterQualityModule } from './water-quality/water-quality.module';

@Module({
  imports: [AirQualityModule, WaterQualityModule, AlarmModule],
})
export class AppModule {}
