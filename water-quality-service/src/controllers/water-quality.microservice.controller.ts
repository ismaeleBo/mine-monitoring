import { Controller, BadRequestException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { WaterQualityService } from '../services/water-quality.service';
import { WaterQualityResponseDto } from '../dto/water-quality-response.dto';
import { WaterQualityQueryParamsDto } from 'src/dto/query-params.dto';
import { WaterDailyAverageDto } from 'src/dto/daily-average.dto';

@Controller()
export class WaterQualityMicroserviceController {
  constructor(private readonly waterQualityService: WaterQualityService) {}

  @MessagePattern({ cmd: 'get_water_quality_reading' })
  async getReadingByIdMicroservice(
    @Payload() id: string,
  ): Promise<WaterQualityResponseDto | null> {
    return this.waterQualityService.getReadingById(id);
  }

  @MessagePattern({ cmd: 'search_water_quality_readings' })
  async searchReadingsMicroservice(
    @Payload() query: WaterQualityQueryParamsDto,
  ): Promise<WaterQualityResponseDto[]> {
    return this.waterQualityService.search(query);
  }

  @MessagePattern({ cmd: 'get_water_quality_daily_averages' })
  async getDailyAveragesMicroservice(
    @Payload()
    payload: {
      startDate: string;
      endDate: string;
      sensorId?: string;
      location?: string;
    },
  ): Promise<WaterDailyAverageDto[]> {
    const { startDate, endDate, sensorId, location } = payload;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid startDate or endDate format');
    }

    return this.waterQualityService.getDailyAverages(
      start,
      end,
      sensorId,
      location,
    );
  }

  @MessagePattern({ cmd: 'get_water_quality_daily_measurements' })
  async getDailyMeasurementsMicroservice(
    @Payload() payload: { date: string; location?: string },
  ) {
    const date = new Date(payload.date);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    return this.waterQualityService.getDailyMeasurements(
      date,
      payload.location,
    );
  }
}
