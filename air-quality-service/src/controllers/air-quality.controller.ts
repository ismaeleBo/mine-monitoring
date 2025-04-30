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
import { AirQualityReadingDto } from 'src/dto/air-quality-reading.dto';
import { AirQualityResponseDto } from 'src/dto/air-quality-response.dto';
import { DailyAverageDto } from 'src/dto/daily-average.dto';
import { AirQualityQueryParamsDto } from 'src/dto/query-params.dto';
import { AirQualityService } from 'src/services/air-quality.service';

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

  @Get('/stats/daily-measurements')
  @ApiOperation({ summary: 'Get all measurements for a specific day' })
  @ApiResponse({ status: 200, description: 'Measurements fetched' })
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

    return this.airQualityService.getDailyMeasurements(date, location);
  }
}
