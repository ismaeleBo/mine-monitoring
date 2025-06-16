import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { Alarm } from './entities/alarm.entity';
import { AlarmService } from './services/alarm.service';
import { MqttService } from './services/mqtt.service';
import { MqttController } from './controllers/mqtt.controller';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/database.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AlarmController } from './controllers/alarm.controller';
import { AlarmMicroserviceController } from './controllers/alarm.microservice.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ALARM_NOTIFIER',
        transport: Transport.TCP,
        options: {
          host: process.env.GATEWAY_HOST || 'localhost',
          port: Number(process.env.GATEWAY_PORT || 4000),
        },
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([Alarm]),
  ],
  controllers: [
    AppController,
    AlarmController,
    AlarmMicroserviceController,
    MqttController,
  ],
  providers: [AppService, AlarmService, MqttService],
})
export class AppModule {}
