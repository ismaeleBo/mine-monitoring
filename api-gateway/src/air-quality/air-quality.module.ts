import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AirQualityController } from './air-quality.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AIR_QUALITY_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
        },
      },
    ]),
  ],
  controllers: [AirQualityController],
})
export class AirQualityModule {}
