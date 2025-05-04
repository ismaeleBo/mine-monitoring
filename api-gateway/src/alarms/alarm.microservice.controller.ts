import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AlarmResponseDto } from './dto/alarm-response.dto';
import { AlarmNotifierService } from './alarm-notifier.service';

@Controller()
export class AlarmMicroserviceController {
  constructor(private readonly notifier: AlarmNotifierService) {}

  @MessagePattern('alarm_created')
  handleAlarmCreated(@Payload() alarm: AlarmResponseDto) {
    console.log('[GATEWAY] Alarm received via TCP:', alarm);
    this.notifier.emitAlarm(alarm);
  }
}
