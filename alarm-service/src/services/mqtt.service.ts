import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { matches } from 'mqtt-pattern';

@Injectable()
export class MqttService implements OnModuleDestroy {
  private readonly logger = new Logger(MqttService.name);
  private client: mqtt.MqttClient;
  private subscriptions: Array<{
    topic: string;
    callback: (topic: string, message: Buffer) => void;
  }> = [];

  constructor() {
    this.client = mqtt.connect(
      process.env.MQTT_URL || 'mqtt://localhost:1883',
      {
        clientId: `alarm-service-${Math.random().toString(16).slice(2)}`,
        username: process.env.MQTT_USERNAME,
        password: process.env.MQTT_PASSWORD,
      },
    );

    this.client.on('connect', () => {
      this.logger.log('[MQTT] Connesso al broker MQTT');
    });

    this.client.on('error', (error) => {
      this.logger.error(`[MQTT] Errore di connessione: ${error.message}`);
    });

    this.client.on('message', (incomingTopic, message) => {
      for (const sub of this.subscriptions) {
        if (matches(sub.topic, incomingTopic)) {
          sub.callback(incomingTopic, message);
        }
      }
    });
  }

  subscribe(
    topic: string,
    callback: (topic: string, message: Buffer) => void,
  ): void {
    this.client.subscribe(topic, (err) => {
      if (err) {
        this.logger.error(`[MQTT] Errore nella sottoscrizione a ${topic}`);
      } else {
        this.logger.log(`[MQTT] Sottoscritto al topic: ${topic}`);
      }
    });

    this.subscriptions.push({ topic, callback });
  }

  publish(topic: string, message: string): void {
    this.client.publish(topic, message, {}, (err) => {
      if (err) {
        this.logger.error(
          `[MQTT] Errore pubblicazione su ${topic}: ${err.message}`,
        );
      }
    });
  }

  onModuleDestroy() {
    this.client.end();
  }
}
