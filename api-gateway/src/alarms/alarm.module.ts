import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AlarmController } from './alarm.controller';

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
  controllers: [AlarmController],
})
export class AlarmModule {}
