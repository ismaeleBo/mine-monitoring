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
import { DailyMeasurementsResponse } from './dto/daily-measurements-response.dto';
import { ProductionMonitoringResponseDto } from './dto/production-monitoring-response.dto';
import { ProductionMonitoringQueryParamsDto } from './dto/query-params.dto';
import { ProductionDailyAverageDto } from './dto/daily-average.dto';

@ApiTags('production-monitoring')
@Controller('production-monitoring')
export class ProductionMonitoringController {
  constructor(
    @Inject('PRODUCTION_MONITORING_SERVICE')
    private readonly productionMonitoringClient: ClientProxy,
  ) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Get production monitoring reading by ID' })
  @ApiResponse({ status: 200, type: ProductionMonitoringResponseDto })
  async getReadingById(
    @Param('id') id: string,
  ): Promise<ProductionMonitoringResponseDto> {
    return firstValueFrom(
      this.productionMonitoringClient.send(
        { cmd: 'get_production_monitoring_reading' },
        id,
      ),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Search readings with filters' })
  @ApiResponse({ status: 200, type: [ProductionMonitoringResponseDto] })
  async search(
    @Query() query: ProductionMonitoringQueryParamsDto,
  ): Promise<ProductionMonitoringResponseDto[]> {
    return firstValueFrom(
      this.productionMonitoringClient.send(
        { cmd: 'search_production_monitoring_readings' },
        query,
      ),
    );
  }

  @Get('/stats/daily-average')
  @ApiOperation({
    summary: 'Get daily averages for production monitoring parameters',
  })
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
  @ApiResponse({ status: 200, type: [ProductionDailyAverageDto] })
  async getDailyAverages(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('sensorId') sensorId?: string,
    @Query('location') location?: string,
  ): Promise<ProductionDailyAverageDto[]> {
    if (!startDate || !endDate) {
      throw new BadRequestException('startDate and endDate are required');
    }

    return firstValueFrom(
      this.productionMonitoringClient.send(
        { cmd: 'get_production_monitoring_daily_averages' },
        { startDate, endDate, sensorId, location },
      ),
    );
  }

  @Get('/stats/daily-measurements')
  @ApiOperation({ summary: 'Get all readings for a specific day' })
  @ApiQuery({
    name: 'date',
    required: true,
    description: 'Date (YYYY-MM-DD)',
  })
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
      this.productionMonitoringClient.send<DailyMeasurementsResponse[]>(
        { cmd: 'get_production_monitoring_daily_measurements' },
        { date: parsedDate.toISOString(), location },
      ),
    );

    if (!response) {
      throw new InternalServerErrorException(
        'No data received from Production Monitoring Microservice.',
      );
    }

    return response;
  }
}
