import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SoilQualityController } from './soil-quality.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SOIL_QUALITY_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.SOIL_QUALITY_HOST || 'localhost',
          port: Number(process.env.SOIL_QUALITY_PORT || 4005),
        },
      },
    ]),
  ],
  controllers: [SoilQualityController],
})
export class SoilQualityModule {}
