import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './modules/database.module';

import { ProductionMonitoringService } from './services/production-monitoring.service';
import { ProductionMonitoringController } from './controllers/production-monitoring.controller';
import { MqttService } from './services/mqtt.service';
import { MqttController } from './controllers/mqtt.controller';
import { ProductionMonitoringMeasurement } from './entities/production-monitoring-measurement.entity';
import { ProductionMonitoringMicroserviceController } from './controllers/production-monitoring.microservice.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([ProductionMonitoringMeasurement]),
  ],
  controllers: [
    ProductionMonitoringController,
    ProductionMonitoringMicroserviceController,
    MqttController,
  ],
  providers: [ProductionMonitoringService, MqttService],
  exports: [MqttService],
})
export class AppModule {}
