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
          host: process.env.AIR_QUALITY_HOST || 'localhost',
          port: Number(process.env.AIR_QUALITY_PORT || 4002),
        },
      },
    ]),
  ],
  controllers: [AirQualityController],
})
export class AirQualityModule {}
