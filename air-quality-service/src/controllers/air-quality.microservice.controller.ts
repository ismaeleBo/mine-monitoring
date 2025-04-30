import { Controller, BadRequestException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AirQualityResponseDto } from 'src/dto/air-quality-response.dto';
import { DailyAverageDto } from 'src/dto/daily-average.dto';
import { AirQualityQueryParamsDto } from 'src/dto/query-params.dto';
import { AirQualityService } from 'src/services/air-quality.service';

@Controller()
export class AirQualityMicroserviceController {
  constructor(private readonly airQualityService: AirQualityService) {}

  @MessagePattern({ cmd: 'get_reading' })
  async getReadingByIdMicroservice(
    @Payload() id: string,
  ): Promise<AirQualityResponseDto | null> {
    return this.airQualityService.getReadingById(id);
  }

  @MessagePattern({ cmd: 'search_readings' })
  async searchReadingsMicroservice(
    @Payload() query: AirQualityQueryParamsDto,
  ): Promise<AirQualityResponseDto[]> {
    return this.airQualityService.search(query);
  }

  @MessagePattern({ cmd: 'get_daily_averages' })
  async getDailyAveragesMicroservice(
    @Payload()
    payload: {
      startDate: string;
      endDate: string;
      sensorId?: string;
      location?: string;
    },
  ): Promise<DailyAverageDto[]> {
    const { startDate, endDate, sensorId, location } = payload;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid startDate or endDate format');
    }

    return this.airQualityService.getDailyAverages(
      start,
      end,
      sensorId,
      location,
    );
  }

  @MessagePattern({ cmd: 'get_daily_measurements' })
  async getDailyMeasurementsMicroservice(
    @Payload() payload: { date: string; location?: string },
  ) {
    const date = new Date(payload.date);
    return this.airQualityService.getDailyMeasurements(date, payload.location);
  }
}
