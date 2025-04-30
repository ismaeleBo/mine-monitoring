import { Module } from '@nestjs/common';
import { AirQualityModule } from './air-quality/air-quality.module';
import { AlarmGateway } from './alarms/alarm.gateway';
import { AlarmModule } from './alarms/alarm.module';

@Module({
  imports: [AirQualityModule, AlarmModule],
  providers: [AlarmGateway],
})
export class AppModule {}
