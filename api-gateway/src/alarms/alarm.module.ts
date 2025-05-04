import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AlarmMicroserviceController } from './alarm.microservice.controller';
import { AlarmGateway } from './alarm.gateway';
import { AlarmController } from './alarm.controller';
import { AlarmNotifierService } from './alarm-notifier.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ALARM_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3003,
        },
      },
    ]),
  ],
  controllers: [AlarmController, AlarmMicroserviceController],
  providers: [AlarmGateway, AlarmNotifierService],
})
export class AlarmModule {}
