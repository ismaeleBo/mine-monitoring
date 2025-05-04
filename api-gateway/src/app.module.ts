import { Module } from '@nestjs/common';
import { AlarmModule } from './alarms/alarm.module';
import { AirQualityModule } from './air-quality/air-quality.module';

@Module({
  imports: [AirQualityModule, AlarmModule],
})
export class AppModule {}
