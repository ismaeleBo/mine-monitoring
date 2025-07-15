import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductionMonitoringController } from './production-monitoring.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCTION_MONITORING_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.PRODUCTION_MONITORING_HOST || 'localhost',
          port: Number(process.env.PRODUCTION_MONITORING_PORT || 4005),
        },
      },
    ]),
  ],
  controllers: [ProductionMonitoringController],
})
export class ProductionMonitoringModule {}
