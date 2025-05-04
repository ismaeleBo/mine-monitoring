import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './modules/database.module';

import { WaterQualityService } from './services/water-quality.service';
import { WaterQualityController } from './controllers/water-quality.controller';
import { MqttService } from './services/mqtt.service';
import { MqttController } from './controllers/mqtt.controller';
import { WaterQualityMeasurement } from './entities/water-quality-measurement.entity';
import { WaterQualityMicroserviceController } from './controllers/water-quality.microservice.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([WaterQualityMeasurement]),
  ],
  controllers: [
    WaterQualityController,
    WaterQualityMicroserviceController,
    MqttController,
  ],
  providers: [WaterQualityService, MqttService],
  exports: [MqttService],
})
export class AppModule {}
