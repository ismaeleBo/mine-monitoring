import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AlarmService } from '../services/alarm.service';
import { AlarmQueryDto } from '../dto/alarm-query.dto';
import { AlarmResponseDto } from '../dto/alarm-response.dto';

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
}
