import { Controller, BadRequestException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductionMonitoringService } from '../services/production-monitoring.service';
import { ProductionMonitoringResponseDto } from '../dto/production-monitoring-response.dto';
import { ProductionMonitoringQueryParamsDto } from 'src/dto/query-params.dto';
import { ProductionDailyAverageDto } from 'src/dto/daily-average.dto';

@Controller()
export class ProductionMonitoringMicroserviceController {
  constructor(
    private readonly productionMonitoringService: ProductionMonitoringService,
  ) {}

  @MessagePattern({ cmd: 'get_production_monitoring_reading' })
  async getReadingByIdMicroservice(
    @Payload() id: string,
  ): Promise<ProductionMonitoringResponseDto | null> {
    return this.productionMonitoringService.getReadingById(id);
  }

  @MessagePattern({ cmd: 'search_production_monitoring_readings' })
  async searchReadingsMicroservice(
    @Payload() query: ProductionMonitoringQueryParamsDto,
  ): Promise<ProductionMonitoringResponseDto[]> {
    return this.productionMonitoringService.search(query);
  }

  @MessagePattern({ cmd: 'get_production_monitoring_daily_averages' })
  async getDailyAveragesMicroservice(
    @Payload()
    payload: {
      startDate: string;
      endDate: string;
      sensorId?: string;
      location?: string;
    },
  ): Promise<ProductionDailyAverageDto[]> {
    const { startDate, endDate, sensorId, location } = payload;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid startDate or endDate format');
    }

    return this.productionMonitoringService.getDailyAverages(
      start,
      end,
      sensorId,
      location,
    );
  }

  @MessagePattern({ cmd: 'get_production_monitoring_daily_measurements' })
  async getDailyMeasurementsMicroservice(
    @Payload() payload: { date: string; location?: string },
  ) {
    const date = new Date(payload.date);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    return this.productionMonitoringService.getDailyMeasurements(
      date,
      payload.location,
    );
  }
}
