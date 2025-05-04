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
          host: 'localhost',
          port: 3004,
        },
      },
    ]),
  ],
  controllers: [WaterQualityController],
})
export class WaterQualityModule {}
