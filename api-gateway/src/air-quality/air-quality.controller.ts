import {
  Controller,
  Get,
  Param,
  Query,
  Inject,
  HttpException,
  HttpStatus,
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
    const reading = await firstValueFrom(
      this.airQualityClient.send<AirQualityResponseDto>(
        { cmd: 'get_reading' },
        id,
      ),
    );

    if (!reading) {
      throw new HttpException('Reading not found', HttpStatus.NOT_FOUND);
    }

    return reading;
  }

  @Get()
  @ApiOperation({ summary: 'Search readings by filters' })
  @ApiResponse({
    status: 200,
    description: 'Readings found',
    type: [AirQualityResponseDto],
  })
  async search(
    @Query() queryParams: AirQualityQueryParamsDto,
  ): Promise<AirQualityResponseDto[]> {
    return firstValueFrom(
      this.airQualityClient.send<AirQualityResponseDto[]>(
        { cmd: 'search_readings' },
        queryParams,
      ),
    );
  }

  @Get('/stats/daily-averages')
  @ApiOperation({
    summary: 'Retrieve daily air quality averages.',
  })
  @ApiResponse({
    status: 200,
    description: 'Medie giornaliere calcolate',
    type: [DailyAverageDto],
  })
  async getDailyAverages(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('sensorId') sensorId?: string,
    @Query('location') location?: string,
  ): Promise<DailyAverageDto[]> {
    if (!startDate || !endDate) {
      throw new HttpException(
        'startDate and endDate are mandatory',
        HttpStatus.BAD_REQUEST,
      );
    }

    const payload = {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      sensorId,
      location,
    };

    return firstValueFrom(
      this.airQualityClient.send<DailyAverageDto[]>(
        { cmd: 'get_daily_averages' },
        payload,
      ),
    );
  }
}
