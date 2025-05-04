import { Controller, Get, Query, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AlarmResponseDto } from './dto/alarm-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AlarmQueryDto } from './dto/alarm-query.dto';

@ApiTags('alarms')
@Controller('alarms')
export class AlarmController {
  constructor(
    @Inject('ALARM_SERVICE')
    private readonly alarmClient: ClientProxy,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Search alarms with optional filters' })
  @ApiResponse({ status: 200, type: [AlarmResponseDto] })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'parameter', required: false })
  @ApiQuery({ name: 'location', required: false })
  @ApiQuery({ name: 'severity', required: false })
  @ApiQuery({ name: 'sensorId', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  async getAlarms(
    @Query() query: AlarmQueryDto & { page?: string; limit?: string },
  ): Promise<AlarmResponseDto[]> {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '20', 10);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { page: _p, limit: _l, ...filters } = query;

    return firstValueFrom(
      this.alarmClient.send<AlarmResponseDto[]>(
        { cmd: 'get_alarms_paginated' },
        { query: filters, page, limit },
      ),
    );
  }
}
