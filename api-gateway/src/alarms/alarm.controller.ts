import { Controller, Get, Query, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AlarmResponseDto } from './dto/alarm-response.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AlarmQueryDto } from './dto/alarm-query.dto';

@ApiTags('alarms')
@Controller('alarms')
export class AlarmController {
  constructor(
    @Inject('ALARM_SERVICE')
    private readonly alarmClient: ClientProxy,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Cerca allarmi con filtri opzionali' })
  @ApiResponse({ status: 200, type: [AlarmResponseDto] })
  async getAlarms(@Query() query: AlarmQueryDto): Promise<AlarmResponseDto[]> {
    return firstValueFrom(
      this.alarmClient.send<AlarmResponseDto[]>(
        { cmd: 'get_alarms_by_filters' },
        query,
      ),
    );
  }
}
