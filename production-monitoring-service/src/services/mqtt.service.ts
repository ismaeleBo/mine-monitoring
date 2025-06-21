import { Injectable } from '@nestjs/common';
import * as mqtt from 'mqtt';
import * as fs from 'fs';

@Injectable()
export class MqttService {
  private client!: mqtt.MqttClient;
  private clientReady!: Promise<void>;
  private resolveReady!: () => void;

  constructor() {
    const url = process.env.MQTT_HOST || 'localhost';

    this.clientReady = new Promise((resolve) => {
      this.resolveReady = resolve;
    });

    this.client = mqtt.connect({
      hostname: url,
      clientId: `production-monitoring-service-${Math.random().toString(16).slice(3)}`,
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
      console.log('[MQTT] Connected to broker:', url);
      this.resolveReady();
    });

    this.client.on('error', (err) => {
      console.error('[MQTT] Error:', err.message);
    });
  }

  async subscribe(
    topic: string,
    handler: (topic: string, message: Buffer) => void,
  ): Promise<void> {
    await this.clientReady;

    this.client.subscribe(topic, (err) => {
      if (err) {
        console.error(
          `[MQTT] Error subscribing to topic: ${topic}:`,
          err.message,
        );
        throw err;
      }
      console.log(`[MQTT] Sottoscritto al topic: ${topic}`);
    });

    this.client.on('message', (receivedTopic, message) => {
      if (mqttMatchTopic(topic, receivedTopic)) {
        handler(receivedTopic, message);
      }
    });
  }
}

function mqttMatchTopic(
  subscriptionTopic: string,
  receivedTopic: string,
): boolean {
  if (subscriptionTopic.endsWith('/#')) {
    const base = subscriptionTopic.slice(0, -2);
    return receivedTopic.startsWith(base);
  }
  return subscriptionTopic === receivedTopic;
}
