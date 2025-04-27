import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpException,
  BadRequestException,
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

  // === API HTTP ===

  @Post()
  @ApiOperation({ summary: 'Record a new air quality reading.' })
  @ApiResponse({
    status: 201,
    description: 'Reading saved successfully',
    type: AirQualityResponseDto,
  })
  async createReading(
    @Body() readingDto: AirQualityReadingDto,
  ): Promise<AirQualityResponseDto> {
    return this.airQualityService.createReading(readingDto);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Retrieve a reading by ID' })
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
    description: 'Letture trovate',
    type: [AirQualityResponseDto],
  })
  async search(
    @Query() query: AirQualityQueryParamsDto,
  ): Promise<AirQualityResponseDto[]> {
    return this.airQualityService.search(query);
  }

  @Get('/stats/daily-average')
  @ApiOperation({
    summary: 'Retrieve daily air quality averages.',
  })
  @ApiResponse({
    status: 200,
    description: 'Calculated daily averages',
    type: [DailyAverageDto],
  })
  async getDailyAverages(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('sensorId') sensorId?: string,
    @Query('location') location?: string,
  ): Promise<DailyAverageDto[]> {
    if (!startDate || !endDate) {
      throw new BadRequestException('startDate and endDate are mandatory');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    return this.airQualityService.getDailyAverages(
      start,
      end,
      sensorId,
      location,
    );
  }

  // === MICROSERVICES PATTERNS ===

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
}
