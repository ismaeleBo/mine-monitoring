import { Controller, Logger, OnModuleInit } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { ProductionMonitoringService } from '../services/production-monitoring.service';
import { MqttService } from '../services/mqtt.service';
import { ProductionMonitoringReadingDto } from '../dto/production-monitoring-reading.dto';

interface RawProductionMonitoringMessage {
  sensor_id: string;
  timestamp: string;
  location: string;
  values: {
    EXTRACTED_MATERIAL?: number;
    LOADS_MOVED?: number;
    MACHINE_OPERATING_HOURS?: number;
  };
}

@Controller()
export class MqttController implements OnModuleInit {
  private readonly logger = new Logger(MqttController.name);

  constructor(
    private readonly productionMonitoringService: ProductionMonitoringService,
    private readonly mqttService: MqttService,
  ) {}

  onModuleInit() {
    this.mqttService.subscribe(
      'mining/readings/production-monitoring/#',
      (topic: string, message: Buffer) => {
        void this.handleProductionMonitoringMessage(topic, message);
      },
    );
  }

  private async handleProductionMonitoringMessage(
    topic: string,
    message: Buffer,
  ): Promise<void> {
    this.logger.log(`[MQTT] Message received on topic: ${topic}`);
    try {
      const rawPayload = JSON.parse(
        message.toString(),
      ) as RawProductionMonitoringMessage;

      const normalizedPayload: ProductionMonitoringReadingDto = {
        sensorId: rawPayload.sensor_id,
        timestamp: rawPayload.timestamp,
        location: rawPayload.location,
        extractedMaterial: rawPayload.values.EXTRACTED_MATERIAL ?? null,
        loadsMoved: rawPayload.values.LOADS_MOVED ?? null,
        machineOperatingHours:
          rawPayload.values.MACHINE_OPERATING_HOURS ?? null,
      };

      const dto = plainToInstance(
        ProductionMonitoringReadingDto,
        normalizedPayload,
      );
      await validateOrReject(dto);

      const saved = await this.productionMonitoringService.createReading(dto);
      this.logger.log(`[MQTT] Reading recorded with ID=${saved.id}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Errore sconosciuto';
      this.logger.error(`[MQTT] Error reading message: ${msg}`);
    }
  }
}
