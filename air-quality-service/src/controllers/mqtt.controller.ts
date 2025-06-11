import { Controller, Logger, OnModuleInit } from '@nestjs/common';
import { AirQualityService } from '../services/air-quality.service';
import { MqttService } from '../services/mqtt.service';
import { AirQualityReadingDto } from '../dto/air-quality-reading.dto';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

interface RawAirQualityMessage {
  sensor_id: string;
  timestamp: string;
  location: string;
  values: {
    PM2_5?: number;
    PM10?: number;
    NO2?: number;
    CO?: number;
    O2?: number;
    SO2?: number;
    CH4?: number;
    VOC?: number;
  };
}

@Controller()
export class MqttController implements OnModuleInit {
  private readonly logger = new Logger(MqttController.name);

  constructor(
    private readonly airQualityService: AirQualityService,
    private readonly mqttService: MqttService,
  ) {}

  onModuleInit() {
    // Subscribe to topic
    this.mqttService.subscribe(
      'mining/readings/air-quality/#',
      (topic: string, message: Buffer) => {
        void this.handleAirQualityMessage(topic, message);
      },
    );
  }

  private async handleAirQualityMessage(
    topic: string,
    message: Buffer,
  ): Promise<void> {
    this.logger.log(`[MQTT] Message received on topic: ${topic}`);
    try {
      const rawPayload = JSON.parse(message.toString()) as RawAirQualityMessage;

      const normalizedPayload: AirQualityReadingDto = {
        sensorId: rawPayload.sensor_id,
        timestamp: rawPayload.timestamp,
        location: rawPayload.location,
        pm25: rawPayload.values.PM2_5 ?? null,
        pm10: rawPayload.values.PM10 ?? null,
        no2: rawPayload.values.NO2 ?? null,
        co: rawPayload.values.CO ?? null,
        o2: rawPayload.values.O2 ?? null,
        so2: rawPayload.values.SO2 ?? null,
        ch4: rawPayload.values.CH4 ?? null,
        voc: rawPayload.values.VOC ?? null,
      };

      // DTO Validation
      const dtoInstance = plainToInstance(
        AirQualityReadingDto,
        normalizedPayload,
      );
      await validateOrReject(dtoInstance);

      const saved = await this.airQualityService.createReading(dtoInstance);

      this.logger.log(`[MQTT] Reading registered with ID=${saved.id}`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Errore sconosciuto';
      this.logger.error(`[MQTT] Error reading message: ${errorMessage}`);
    }
  }
}
