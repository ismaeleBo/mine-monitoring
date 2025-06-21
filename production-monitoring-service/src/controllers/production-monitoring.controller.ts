import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ProductionMonitoringService } from '../services/production-monitoring.service';
import { ProductionMonitoringReadingDto } from '../dto/production-monitoring-reading.dto';
import { ProductionMonitoringResponseDto } from '../dto/production-monitoring-response.dto';
import { ProductionMonitoringQueryParamsDto } from 'src/dto/query-params.dto';
import { ProductionDailyAverageDto } from 'src/dto/daily-average.dto';

@ApiTags('production-monitoring')
@Controller('production-monitoring')
export class ProductionMonitoringController {
  constructor(
    private readonly productionMonitoringService: ProductionMonitoringService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new production reading' })
  @ApiResponse({
    status: 201,
    description: 'Reading created successfully',
    type: ProductionMonitoringResponseDto,
  })
  async createReading(
    @Body() readingDto: ProductionMonitoringReadingDto,
  ): Promise<ProductionMonitoringResponseDto> {
    return this.productionMonitoringService.createReading(readingDto);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get a reading by its ID' })
  @ApiResponse({ status: 200, type: ProductionMonitoringResponseDto })
  @ApiResponse({ status: 404, description: 'Reading not found' })
  async getReadingById(
    @Param('id') id: string,
  ): Promise<ProductionMonitoringResponseDto> {
    const reading = await this.productionMonitoringService.getReadingById(id);
    if (!reading) {
      throw new HttpException('Reading not found', HttpStatus.NOT_FOUND);
    }
    return reading;
  }

  @Get()
  @ApiOperation({ summary: 'Search readings by filters' })
  @ApiResponse({ status: 200, type: [ProductionMonitoringResponseDto] })
  async search(
    @Query() query: ProductionMonitoringQueryParamsDto,
  ): Promise<ProductionMonitoringResponseDto[]> {
    return this.productionMonitoringService.search(query);
  }

  @Get('/stats/daily-average')
  @ApiOperation({ summary: 'Retrieve daily production monitoring averages' })
  @ApiResponse({ status: 200, type: [ProductionDailyAverageDto] })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  @ApiQuery({ name: 'sensorId', required: false })
  @ApiQuery({ name: 'location', required: false })
  async getDailyAverages(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('sensorId') sensorId?: string,
    @Query('location') location?: string,
  ): Promise<ProductionDailyAverageDto[]> {
    if (!startDate || !endDate) {
      throw new BadRequestException('startDate and endDate are required');
    }

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    return this.productionMonitoringService.getDailyAverages(
      parsedStartDate,
      parsedEndDate,
      sensorId,
      location,
    );
  }

  @Get('/stats/daily-measurements')
  @ApiOperation({
    summary: 'Get all production measurements for a specific day',
  })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'date', required: true })
  @ApiQuery({ name: 'location', required: false })
  async getDailyMeasurements(
    @Query('date') dateStr: string,
    @Query('location') location?: string,
  ) {
    if (!dateStr) {
      throw new BadRequestException('date is required');
    }

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    return this.productionMonitoringService.getDailyMeasurements(
      date,
      location,
    );
  }
}
