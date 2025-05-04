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
import { WaterQualityService } from '../services/water-quality.service';
import { WaterQualityReadingDto } from '../dto/water-quality-reading.dto';
import { WaterQualityResponseDto } from '../dto/water-quality-response.dto';
import { WaterQualityQueryParamsDto } from 'src/dto/query-params.dto';
import { WaterDailyAverageDto } from 'src/dto/daily-average.dto';

@ApiTags('water-quality')
@Controller('water-quality')
export class WaterQualityController {
  constructor(private readonly waterQualityService: WaterQualityService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new water quality reading' })
  @ApiResponse({
    status: 201,
    description: 'Reading created successfully',
    type: WaterQualityResponseDto,
  })
  async createReading(
    @Body() readingDto: WaterQualityReadingDto,
  ): Promise<WaterQualityResponseDto> {
    return this.waterQualityService.createReading(readingDto);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get a reading by its ID' })
  @ApiResponse({ status: 200, type: WaterQualityResponseDto })
  @ApiResponse({ status: 404, description: 'Reading not found' })
  async getReadingById(
    @Param('id') id: string,
  ): Promise<WaterQualityResponseDto> {
    const reading = await this.waterQualityService.getReadingById(id);
    if (!reading) {
      throw new HttpException('Reading not found', HttpStatus.NOT_FOUND);
    }
    return reading;
  }

  @Get()
  @ApiOperation({ summary: 'Search readings by filters' })
  @ApiResponse({ status: 200, type: [WaterQualityResponseDto] })
  async search(
    @Query() query: WaterQualityQueryParamsDto,
  ): Promise<WaterQualityResponseDto[]> {
    return this.waterQualityService.search(query);
  }

  @Get('/stats/daily-average')
  @ApiOperation({ summary: 'Retrieve daily water quality averages' })
  @ApiResponse({ status: 200, type: [WaterDailyAverageDto] })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  async getDailyAverages(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('sensorId') sensorId?: string,
    @Query('location') location?: string,
  ): Promise<WaterDailyAverageDto[]> {
    if (!startDate || !endDate) {
      throw new BadRequestException('startDate and endDate are required');
    }

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    return this.waterQualityService.getDailyAverages(
      parsedStartDate,
      parsedEndDate,
      sensorId,
      location,
    );
  }

  @Get('/stats/daily-measurements')
  @ApiOperation({ summary: 'Get all water measurements for a specific day' })
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

    return this.waterQualityService.getDailyMeasurements(date, location);
  }
}
