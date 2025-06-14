import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { WaterQualityController } from './water-quality.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'WATER_QUALITY_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.WATER_QUALITY_HOST || 'localhost',
          port: Number(process.env.WATER_QUALITY_PORT || 4004),
        },
      },
    ]),
  ],
  controllers: [WaterQualityController],
})
export class WaterQualityModule {}
