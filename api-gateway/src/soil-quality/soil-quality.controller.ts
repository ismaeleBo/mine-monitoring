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
import { SoilQualityQueryParamsDto } from './dto/query-params.dto';
import { SoilQualityResponseDto } from './dto/soil-quality-response.dto';
import { SoilDailyAverageDto } from './dto/daily-average.dto';
import { DailyMeasurementsResponse } from './dto/daily-measurements-response.dto';

@ApiTags('soil-quality')
@Controller('soil-quality')
export class SoilQualityController {
  constructor(
    @Inject('SOIL_QUALITY_SERVICE')
    private readonly soilQualityClient: ClientProxy,
  ) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Get soil quality reading by ID' })
  @ApiResponse({ status: 200, type: SoilQualityResponseDto })
  async getReadingById(
    @Param('id') id: string,
  ): Promise<SoilQualityResponseDto> {
    return firstValueFrom(
      this.soilQualityClient.send({ cmd: 'get_soil_quality_reading' }, id),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Search readings with filters' })
  @ApiResponse({ status: 200, type: [SoilQualityResponseDto] })
  async search(
    @Query() query: SoilQualityQueryParamsDto,
  ): Promise<SoilQualityResponseDto[]> {
    return firstValueFrom(
      this.soilQualityClient.send(
        { cmd: 'search_soil_quality_readings' },
        query,
      ),
    );
  }

  @Get('/stats/daily-average')
  @ApiOperation({ summary: 'Get daily averages for soil quality parameters' })
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
  @ApiResponse({ status: 200, type: [SoilDailyAverageDto] })
  async getDailyAverages(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('sensorId') sensorId?: string,
    @Query('location') location?: string,
  ): Promise<SoilDailyAverageDto[]> {
    if (!startDate || !endDate) {
      throw new BadRequestException('startDate and endDate are required');
    }

    return firstValueFrom(
      this.soilQualityClient.send(
        { cmd: 'get_soil_quality_daily_averages' },
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
      this.soilQualityClient.send<DailyMeasurementsResponse[]>(
        { cmd: 'get_soil_quality_daily_measurements' },
        { date: parsedDate.toISOString(), location },
      ),
    );

    if (!response) {
      throw new InternalServerErrorException(
        'No data received from Soil Quality Microservice.',
      );
    }

    return response;
  }
}
