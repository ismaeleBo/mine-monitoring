import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './modules/database.module';

import { SoilQualityService } from './services/soil-quality.service';
import { SoilQualityController } from './controllers/soil-quality.controller';
import { MqttService } from './services/mqtt.service';
import { MqttController } from './controllers/mqtt.controller';
import { SoilQualityMeasurement } from './entities/soil-quality-measurement.entity';
import { SoilQualityMicroserviceController } from './controllers/soil-quality.microservice.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([SoilQualityMeasurement]),
  ],
  controllers: [
    SoilQualityController,
    SoilQualityMicroserviceController,
    MqttController,
  ],
  providers: [SoilQualityService, MqttService],
  exports: [MqttService],
})
export class AppModule {}
