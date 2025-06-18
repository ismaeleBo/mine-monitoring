import { Controller, BadRequestException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SoilQualityService } from '../services/soil-quality.service';
import { SoilQualityResponseDto } from '../dto/soil-quality-response.dto';
import { SoilQualityQueryParamsDto } from 'src/dto/query-params.dto';
import { SoilDailyAverageDto } from 'src/dto/daily-average.dto';

@Controller()
export class SoilQualityMicroserviceController {
  constructor(private readonly soilQualityService: SoilQualityService) {}

  @MessagePattern({ cmd: 'get_soil_quality_reading' })
  async getReadingByIdMicroservice(
    @Payload() id: string,
  ): Promise<SoilQualityResponseDto | null> {
    return this.soilQualityService.getReadingById(id);
  }

  @MessagePattern({ cmd: 'search_soil_quality_readings' })
  async searchReadingsMicroservice(
    @Payload() query: SoilQualityQueryParamsDto,
  ): Promise<SoilQualityResponseDto[]> {
    return this.soilQualityService.search(query);
  }

  @MessagePattern({ cmd: 'get_soil_quality_daily_averages' })
  async getDailyAveragesMicroservice(
    @Payload()
    payload: {
      startDate: string;
      endDate: string;
      sensorId?: string;
      location?: string;
    },
  ): Promise<SoilDailyAverageDto[]> {
    const { startDate, endDate, sensorId, location } = payload;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid startDate or endDate format');
    }

    return this.soilQualityService.getDailyAverages(
      start,
      end,
      sensorId,
      location,
    );
  }

  @MessagePattern({ cmd: 'get_soil_quality_daily_measurements' })
  async getDailyMeasurementsMicroservice(
    @Payload() payload: { date: string; location?: string },
  ) {
    const date = new Date(payload.date);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    return this.soilQualityService.getDailyMeasurements(date, payload.location);
  }
}
