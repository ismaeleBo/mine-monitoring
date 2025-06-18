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
import { SoilQualityService } from '../services/soil-quality.service';
import { SoilQualityReadingDto } from '../dto/soil-quality-reading.dto';
import { SoilQualityResponseDto } from '../dto/soil-quality-response.dto';
import { SoilQualityQueryParamsDto } from 'src/dto/query-params.dto';
import { SoilDailyAverageDto } from 'src/dto/daily-average.dto';

@ApiTags('soil-quality')
@Controller('soil-quality')
export class SoilQualityController {
  constructor(private readonly soilQualityService: SoilQualityService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new soil quality reading' })
  @ApiResponse({
    status: 201,
    description: 'Reading created successfully',
    type: SoilQualityResponseDto,
  })
  async createReading(
    @Body() readingDto: SoilQualityReadingDto,
  ): Promise<SoilQualityResponseDto> {
    return this.soilQualityService.createReading(readingDto);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get a reading by its ID' })
  @ApiResponse({ status: 200, type: SoilQualityResponseDto })
  @ApiResponse({ status: 404, description: 'Reading not found' })
  async getReadingById(
    @Param('id') id: string,
  ): Promise<SoilQualityResponseDto> {
    const reading = await this.soilQualityService.getReadingById(id);
    if (!reading) {
      throw new HttpException('Reading not found', HttpStatus.NOT_FOUND);
    }
    return reading;
  }

  @Get()
  @ApiOperation({ summary: 'Search readings by filters' })
  @ApiResponse({ status: 200, type: [SoilQualityResponseDto] })
  async search(
    @Query() query: SoilQualityQueryParamsDto,
  ): Promise<SoilQualityResponseDto[]> {
    return this.soilQualityService.search(query);
  }

  @Get('/stats/daily-average')
  @ApiOperation({ summary: 'Retrieve daily soil quality averages' })
  @ApiResponse({ status: 200, type: [SoilDailyAverageDto] })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  async getDailyAverages(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('sensorId') sensorId?: string,
    @Query('location') location?: string,
  ): Promise<SoilDailyAverageDto[]> {
    if (!startDate || !endDate) {
      throw new BadRequestException('startDate and endDate are required');
    }

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    return this.soilQualityService.getDailyAverages(
      parsedStartDate,
      parsedEndDate,
      sensorId,
      location,
    );
  }

  @Get('/stats/daily-measurements')
  @ApiOperation({ summary: 'Get all soil measurements for a specific day' })
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

    return this.soilQualityService.getDailyMeasurements(date, location);
  }
}
