import { Controller, Logger, OnModuleInit } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { SoilQualityService } from '../services/soil-quality.service';
import { MqttService } from '../services/mqtt.service';
import { SoilQualityReadingDto } from '../dto/soil-quality-reading.dto';

interface RawSoilQualityMessage {
  sensor_id: string;
  timestamp: string;
  location: string;
  values: {
    VOC?: number;
    Pb?: number;
  };
}

@Controller()
export class MqttController implements OnModuleInit {
  private readonly logger = new Logger(MqttController.name);

  constructor(
    private readonly soilQualityService: SoilQualityService,
    private readonly mqttService: MqttService,
  ) {}

  onModuleInit() {
    this.mqttService.subscribe(
      'mining/readings/soil-quality/#',
      (topic: string, message: Buffer) => {
        void this.handleSoilQualityMessage(topic, message);
      },
    );
  }

  private async handleSoilQualityMessage(
    topic: string,
    message: Buffer,
  ): Promise<void> {
    this.logger.log(`[MQTT] Message received on topic: ${topic}`);
    try {
      const rawPayload = JSON.parse(
        message.toString(),
      ) as RawSoilQualityMessage;

      const normalizedPayload: SoilQualityReadingDto = {
        sensorId: rawPayload.sensor_id,
        timestamp: rawPayload.timestamp,
        location: rawPayload.location,
        voc: rawPayload.values.VOC ?? null,
        pb: rawPayload.values.VOC ?? null,
      };

      const dto = plainToInstance(SoilQualityReadingDto, normalizedPayload);
      await validateOrReject(dto);

      const saved = await this.soilQualityService.createReading(dto);
      this.logger.log(`[MQTT] Lettura registrata con ID=${saved.id}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Errore sconosciuto';
      this.logger.error(`[MQTT] Error reading message: ${msg}`);
    }
  }
}
