import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AlarmService } from '../services/alarm.service';
import { AlarmQueryDto } from '../dto/alarm-query.dto';
import { AlarmResponseDto } from '../dto/alarm-response.dto';
import { plainToInstance } from 'class-transformer';

@Controller()
export class AlarmMicroserviceController {
  constructor(private readonly alarmService: AlarmService) {}

  @MessagePattern({ cmd: 'get_alarms_by_filters' })
  async getAlarmsByFiltersMicroservice(
    @Payload() query: AlarmQueryDto,
  ): Promise<AlarmResponseDto[]> {
    const alarms = await this.alarmService.findByFilters(query);
    return alarms.map((alarm) => ({
      id: alarm.id,
      sensorId: alarm.sensorId,
      timestamp: alarm.timestamp.toISOString(),
      location: alarm.location,
      parameter: alarm.parameter,
      measuredValue: alarm.measuredValue,
      thresholdExceeded: alarm.thresholdExceeded,
      severity: alarm.severity,
    }));
  }

  @MessagePattern({ cmd: 'get_alarms_paginated' })
  async getPaginated(
    @Payload()
    payload: {
      query: AlarmQueryDto;
      page?: number;
      limit?: number;
    },
  ): Promise<{ data: AlarmResponseDto[]; total: number }> {
    const { query, page = 1, limit = 20 } = payload;
    const result = await this.alarmService.findPaginated(query, page, limit);

    return {
      data: result.data.map((a) => plainToInstance(AlarmResponseDto, a)),
      total: result.total,
    };
  }
}
