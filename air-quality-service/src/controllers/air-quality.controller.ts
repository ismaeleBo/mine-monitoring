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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AirQualityService } from '../services/air-quality.service';
import { AirQualityReadingDto } from '../dto/air-quality-reading.dto';
import { AirQualityResponseDto } from '../dto/air-quality-response.dto';
import { DailyAverageDto } from '../dto/daily-average.dto';
import { AirQualityQueryParamsDto } from '../dto/query-params.dto';

@ApiTags('air-quality')
@Controller('air-quality')
export class AirQualityController {
  constructor(private readonly airQualityService: AirQualityService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new air quality reading' })
  @ApiResponse({
    status: 201,
    description: 'Reading created successfully',
    type: AirQualityResponseDto,
  })
  async createReading(
    @Body() readingDto: AirQualityReadingDto,
  ): Promise<AirQualityResponseDto> {
    return this.airQualityService.createReading(readingDto);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get a reading by its ID' })
  @ApiResponse({
    status: 200,
    description: 'Reading found',
    type: AirQualityResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Reading not found' })
  async getReadingById(
    @Param('id') id: string,
  ): Promise<AirQualityResponseDto> {
    const reading = await this.airQualityService.getReadingById(id);
    if (!reading) {
      throw new HttpException('Reading not found', HttpStatus.NOT_FOUND);
    }
    return reading;
  }

  @Get()
  @ApiOperation({ summary: 'Search readings by filters' })
  @ApiResponse({
    status: 200,
    description: 'Readings retrieved successfully',
    type: [AirQualityResponseDto],
  })
  async search(
    @Query() query: AirQualityQueryParamsDto,
  ): Promise<AirQualityResponseDto[]> {
    return this.airQualityService.search(query);
  }

  @Get('/stats/daily-average')
  @ApiOperation({ summary: 'Retrieve daily air quality averages' })
  @ApiResponse({
    status: 200,
    description: 'Daily averages calculated successfully',
    type: [DailyAverageDto],
  })
  async getDailyAverages(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('sensorId') sensorId?: string,
    @Query('location') location?: string,
  ): Promise<DailyAverageDto[]> {
    if (!startDate || !endDate) {
      throw new BadRequestException('startDate and endDate are required');
    }

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      throw new BadRequestException(
        'Invalid date format for startDate or endDate',
      );
    }

    return this.airQualityService.getDailyAverages(
      parsedStartDate,
      parsedEndDate,
      sensorId,
      location,
    );
  }

  // === MICROSERVICE PATTERNS ===

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
}
