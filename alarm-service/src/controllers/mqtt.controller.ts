import { Controller, Logger, OnModuleInit } from '@nestjs/common';
import { AlarmService } from '../services/alarm.service';
import { MqttService } from '../services/mqtt.service';
import { AlarmSeverity, CreateAlarmDto } from '../dto/create-alarm.dto';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export interface RawAlarmMessage {
  sensor_id: string;
  timestamp: string;
  location: string;
  parameter: string;
  measured_value: number;
  threshold_exceeded: number;
  severity: AlarmSeverity;
}

@Controller()
export class MqttController implements OnModuleInit {
  private readonly logger = new Logger(MqttController.name);

  constructor(
    private readonly mqttService: MqttService,
    private readonly alarmService: AlarmService,
  ) {}

  onModuleInit() {
    const topic = 'mining/alerts/#';

    this.logger.log(
      `[MQTT] Inizializzazione. Sottoscrizione al topic: ${topic}`,
    );

    this.mqttService.subscribe(topic, (incomingTopic, message) => {
      void this.handleMqttMessage(incomingTopic, message);
    });
  }

  private async handleMqttMessage(
    topic: string,
    message: Buffer,
  ): Promise<void> {
    try {
      this.logger.debug(`[MQTT] Message received on topic: ${topic}`);

      const rawPayload = JSON.parse(message.toString()) as RawAlarmMessage;

      const alarm = plainToInstance(CreateAlarmDto, {
        sensorId: rawPayload.sensor_id,
        timestamp: rawPayload.timestamp,
        location: rawPayload.location,
        parameter: rawPayload.parameter,
        measuredValue: rawPayload.measured_value,
        thresholdExceeded: rawPayload.threshold_exceeded,
        severity: rawPayload.severity,
      });

      await validateOrReject(alarm);

      const savedAlarm = await this.alarmService.create(alarm);

      this.logger.log(
        `[MQTT] Alarm salvato. ID=${savedAlarm.id} | ${alarm.severity} - ${alarm.parameter} = ${alarm.measuredValue} in ${alarm.location}`,
      );

      // Qui in futuro: emit WebSocket
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Errore generico nella gestione MQTT';
      this.logger.error(`[MQTT] Error parsing or saving: ${msg}`);
    }
  }
}
