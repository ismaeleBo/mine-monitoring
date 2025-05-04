import { Controller, Logger, OnModuleInit } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { WaterQualityService } from '../services/water-quality.service';
import { MqttService } from '../services/mqtt.service';
import { WaterQualityReadingDto } from '../dto/water-quality-reading.dto';

interface RawWaterQualityMessage {
  sensor_id: string;
  timestamp: string;
  location: string;
  values: {
    pH?: number;
    Conductivity?: number;
    DO?: number;
    As?: number;
  };
}

@Controller()
export class MqttController implements OnModuleInit {
  private readonly logger = new Logger(MqttController.name);

  constructor(
    private readonly waterQualityService: WaterQualityService,
    private readonly mqttService: MqttService,
  ) {}

  onModuleInit() {
    this.mqttService.subscribe(
      'mining/water-quality/readings/#',
      (topic: string, message: Buffer) => {
        void this.handleWaterQualityMessage(topic, message);
      },
    );
  }

  private async handleWaterQualityMessage(
    topic: string,
    message: Buffer,
  ): Promise<void> {
    this.logger.log(`[MQTT] Messaggio ricevuto sul topic: ${topic}`);
    try {
      const rawPayload = JSON.parse(
        message.toString(),
      ) as RawWaterQualityMessage;

      const normalizedPayload: WaterQualityReadingDto = {
        sensorId: rawPayload.sensor_id,
        timestamp: rawPayload.timestamp,
        location: rawPayload.location,
        pH: rawPayload.values.pH ?? null,
        conductivity: rawPayload.values.Conductivity ?? null,
        dissolvedOxygen: rawPayload.values.DO ?? null,
        arsenic: rawPayload.values.As ?? null,
      };

      const dto = plainToInstance(WaterQualityReadingDto, normalizedPayload);
      await validateOrReject(dto);

      const saved = await this.waterQualityService.createReading(dto);
      this.logger.log(`[MQTT] Lettura registrata con ID=${saved.id}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Errore sconosciuto';
      this.logger.error(
        `[MQTT] Errore durante la lettura del messaggio: ${msg}`,
      );
    }
  }
}
