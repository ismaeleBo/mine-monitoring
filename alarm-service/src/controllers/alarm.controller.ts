import { Controller, Get, Query } from '@nestjs/common';
import { AlarmService } from '../services/alarm.service';
import { AlarmQueryDto } from '../dto/alarm-query.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AlarmResponseDto } from '../dto/alarm-response.dto';

@ApiTags('alarms')
@Controller('alarms')
export class AlarmController {
  constructor(private readonly alarmService: AlarmService) {}

  @Get()
  @ApiOperation({ summary: 'Recupera gli alarm con filtri opzionali' })
  @ApiResponse({
    status: 200,
    description: 'Lista di allarmi filtrata con successo',
    type: [AlarmResponseDto],
  })
  async getAlarms(@Query() query: AlarmQueryDto): Promise<AlarmResponseDto[]> {
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
}
