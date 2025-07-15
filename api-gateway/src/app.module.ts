import { Module } from '@nestjs/common';
import { AlarmModule } from './alarms/alarm.module';
import { AirQualityModule } from './air-quality/air-quality.module';
import { WaterQualityModule } from './water-quality/water-quality.module';
import { SoilQualityModule } from './soil-quality/soil-quality.module';
import { ProductionMonitoringModule } from './production-monitoring/production-monitoring.module';

@Module({
  imports: [
    AirQualityModule,
    WaterQualityModule,
    SoilQualityModule,
    ProductionMonitoringModule,
    AlarmModule,
  ],
})
export class AppModule {}
