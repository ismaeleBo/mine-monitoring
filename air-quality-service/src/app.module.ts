// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirQualityController } from './controllers/air-quality.controller';
import { AirQualityService } from './services/air-quality.service';
import { AirQualityRepository } from './repositories/air-quality.repository';
import { MqttService } from './services/mqtt.service';
import { AirQualityMeasurement } from './entities/air-quality-measurement.entity';
import { DatabaseModule } from './modules/database.module';
import { MqttController } from './controllers/mqtt.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([AirQualityMeasurement]),
  ],
  controllers: [AirQualityController, MqttController],
  providers: [AirQualityService, AirQualityRepository, MqttService],
  exports: [MqttService],
})
export class AppModule {}
