import {
  Controller,
  Get,
  Param,
  Query,
  Inject,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { WaterQualityQueryParamsDto } from './dto/query-params.dto';
import { WaterQualityResponseDto } from './dto/water-quality-response.dto';
import { WaterDailyAverageDto } from './dto/daily-average.dto';
import { DailyMeasurementsResponse } from './dto/daily-measurements-response.dto';

@ApiTags('water-quality')
@Controller('water-quality')
export class WaterQualityController {
  constructor(
    @Inject('WATER_QUALITY_SERVICE')
    private readonly waterQualityClient: ClientProxy,
  ) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Get water quality reading by ID' })
  @ApiResponse({ status: 200, type: WaterQualityResponseDto })
  async getReadingById(
    @Param('id') id: string,
  ): Promise<WaterQualityResponseDto> {
    return firstValueFrom(
      this.waterQualityClient.send({ cmd: 'get_water_quality_reading' }, id),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Search readings with filters' })
  @ApiResponse({ status: 200, type: [WaterQualityResponseDto] })
  async search(
    @Query() query: WaterQualityQueryParamsDto,
  ): Promise<WaterQualityResponseDto[]> {
    return firstValueFrom(
      this.waterQualityClient.send(
        { cmd: 'search_water_quality_readings' },
        query,
      ),
    );
  }

  @Get('/stats/daily-average')
  @ApiOperation({ summary: 'Get daily averages for air quality parameters' })
  @ApiQuery({
    name: 'startDate',
    required: true,
    description: 'Start date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    description: 'End date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'sensorId',
    required: false,
    description: 'Optional sensor ID filter',
  })
  @ApiQuery({
    name: 'location',
    required: false,
    description: 'Optional location filter',
  })
  @ApiResponse({ status: 200, type: [WaterDailyAverageDto] })
  async getDailyAverages(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('sensorId') sensorId?: string,
    @Query('location') location?: string,
  ): Promise<WaterDailyAverageDto[]> {
    if (!startDate || !endDate) {
      throw new BadRequestException('startDate and endDate are required');
    }

    return firstValueFrom(
      this.waterQualityClient.send(
        { cmd: 'get_water_quality_daily_averages' },
        { startDate, endDate, sensorId, location },
      ),
    );
  }

  @Get('/stats/daily-measurements')
  @ApiOperation({ summary: 'Get all readings for a specific day' })
  @ApiQuery({ name: 'date', required: true })
  @ApiQuery({ name: 'location', required: false })
  @ApiResponse({ status: 200 })
  async getDailyMeasurements(
    @Query('date') dateStr: string,
    @Query('location') location?: string,
  ) {
    if (!dateStr) {
      throw new BadRequestException('The "date" query parameter is required.');
    }

    const parsedDate = new Date(dateStr);

    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException(
        'Invalid "date" format. Expected YYYY-MM-DD.',
      );
    }

    const response = await firstValueFrom(
      this.waterQualityClient.send<DailyMeasurementsResponse[]>(
        { cmd: 'get_water_quality_daily_measurements' },
        { date: parsedDate.toISOString(), location },
      ),
    );

    if (!response) {
      throw new InternalServerErrorException(
        'No data received from Air Quality Microservice.',
      );
    }

    return response;
  }
}
