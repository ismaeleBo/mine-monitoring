import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { matches } from 'mqtt-pattern';
import * as fs from 'fs';

@Injectable()
export class MqttService implements OnModuleDestroy {
  private readonly logger = new Logger(MqttService.name);
  private client: mqtt.MqttClient;
  private subscriptions: Array<{
    topic: string;
    callback: (topic: string, message: Buffer) => void;
  }> = [];

  constructor() {
    const url = process.env.MQTT_HOST || 'localhost';

    this.client = mqtt.connect({
      hostname: url,
      clientId: `alarm-service-${Math.random().toString(16).slice(2)}`,
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
      protocol: 'mqtts',
      port: 8883,
      rejectUnauthorized: true,
      ca: fs.readFileSync(process.env.MQTT_CA_PATH!),
      cert: fs.readFileSync(process.env.MQTT_CERT_PATH!),
      key: fs.readFileSync(process.env.MQTT_KEY_PATH!),
    });

    this.client.on('connect', () => {
      this.logger.log('[MQTT] Connesso al broker MQTT');
    });

    this.client.on('error', (error) => {
      this.logger.error(`[MQTT] Connection error: ${error.message}`);
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
        this.logger.error(`[MQTT] Subscription error on topic: ${topic}`);
      } else {
        this.logger.log(`[MQTT] Subscribed to the topic: ${topic}`);
      }
    });

    this.subscriptions.push({ topic, callback });
  }

  publish(topic: string, message: string): void {
    this.client.publish(topic, message, {}, (err) => {
      if (err) {
        this.logger.error(
          `[MQTT] Pubblication error on ${topic}: ${err.message}`,
        );
      }
    });
  }

  onModuleDestroy() {
    this.client.end();
  }
}
