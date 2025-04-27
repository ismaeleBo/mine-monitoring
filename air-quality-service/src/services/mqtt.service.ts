import { Injectable } from '@nestjs/common';
import * as mqtt from 'mqtt';

@Injectable()
export class MqttService {
  private client!: mqtt.MqttClient;
  private clientReady!: Promise<void>;
  private resolveReady!: () => void;

  constructor() {
    const url = process.env.MQTT_URL || 'mqtt://localhost:1883';

    this.clientReady = new Promise((resolve) => {
      this.resolveReady = resolve;
    });

    this.client = mqtt.connect(url, {
      clientId: `air-quality-service-${Math.random().toString(16).slice(3)}`,
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
    });

    this.client.on('connect', () => {
      console.log('[MQTT] Connesso al broker:', url);
      this.resolveReady();
    });

    this.client.on('error', (err) => {
      console.error('[MQTT] Errore:', err.message);
    });
  }

  async subscribe(
    topic: string,
    handler: (topic: string, message: Buffer) => void,
  ): Promise<void> {
    await this.clientReady; // 🔥 Ora aspettiamo che il client sia davvero pronto!

    this.client.subscribe(topic, (err) => {
      if (err) {
        console.error(
          `[MQTT] Errore nella sottoscrizione al topic ${topic}:`,
          err.message,
        );
        throw err;
      }
      console.log(`[MQTT] Sottoscritto al topic: ${topic}`);
    });

    this.client.on('message', (receivedTopic, message) => {
      console.log(
        '[MQTT] 🔥 Ricevuto messaggio grezzo:',
        receivedTopic,
        message.toString(),
      );

      if (mqttMatchTopic(topic, receivedTopic)) {
        handler(receivedTopic, message);
      }
    });
  }
}

// Funzione di matching dei topic MQTT
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
