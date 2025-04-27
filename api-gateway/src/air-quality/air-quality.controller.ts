import {
  Controller,
  Get,
  Param,
  Query,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AirQualityResponseDto } from './dto/air-quality-response.dto';
import { AirQualityQueryParamsDto } from './dto/query-params.dto';
import { DailyAverageDto } from './dto/daily-average.dto';

@ApiTags('air-quality')
@Controller('air-quality')
export class AirQualityController {
  constructor(
    @Inject('AIR_QUALITY_SERVICE')
    private readonly airQualityClient: ClientProxy,
  ) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Get a single reading by ID' })
  @ApiResponse({ status: 200, type: AirQualityResponseDto })
  @ApiResponse({ status: 404, description: 'Reading not found' })
  async getReadingById(
    @Param('id') id: string,
  ): Promise<AirQualityResponseDto> {
    return firstValueFrom(
      this.airQualityClient.send<AirQualityResponseDto>(
        { cmd: 'get_reading' },
        id,
      ),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Search readings by filters' })
  @ApiResponse({ status: 200, type: [AirQualityResponseDto] })
  async search(
    @Query() query: AirQualityQueryParamsDto,
  ): Promise<AirQualityResponseDto[]> {
    return firstValueFrom(
      this.airQualityClient.send<AirQualityResponseDto[]>(
        { cmd: 'search_readings' },
        query,
      ),
    );
  }

  @Get('/stats/daily-average')
  @ApiOperation({ summary: 'Get daily averages for air quality parameters' })
  @ApiResponse({ status: 200, type: [DailyAverageDto] })
  async getDailyAverages(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('sensorId') sensorId?: string,
    @Query('location') location?: string,
  ): Promise<DailyAverageDto[]> {
    if (!startDate || !endDate) {
      throw new BadRequestException('startDate and endDate are required');
    }

    const params: {
      startDate: string;
      endDate: string;
      sensorId?: string;
      location?: string;
    } = { startDate, endDate };

    if (sensorId) params.sensorId = sensorId;
    if (location) params.location = location;

    return firstValueFrom(
      this.airQualityClient.send<DailyAverageDto[]>(
        { cmd: 'get_daily_averages' },
        params,
      ),
    );
  }
}
