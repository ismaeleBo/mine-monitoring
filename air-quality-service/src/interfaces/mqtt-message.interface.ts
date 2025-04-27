export interface MqttAirQualityReading {
  device_id: string;
  latitude: number;
  longitude: number;
  readings: {
    co2: number;
    methane: number;
    pm25: number;
    pm10: number;
    ozone: number;
    no2: number;
  };
  battery: number;
  signal_strength: number;
  firmware_version: string;
  timestamp: string; // ISO 8601 formatted date
}

export interface MqttDeviceStatus {
  device_id: string;
  status: 'online' | 'offline' | 'maintenance' | 'error';
  battery: number;
  signal_strength: number;
  ip_address?: string;
  last_calibration?: string; // ISO 8601 formatted date
  error_code?: string;
  message?: string;
  timestamp: string; // ISO 8601 formatted date
}

export interface MqttCalibrationRequest {
  device_id: string;
  calibration_type: 'automatic' | 'manual';
  reference_values?: {
    co2?: number;
    methane?: number;
    pm25?: number;
    pm10?: number;
    ozone?: number;
    no2?: number;
  };
  requester?: string;
  timestamp: string; // ISO 8601 formatted date
}

export interface MqttCalibrationResponse {
  device_id: string;
  status: 'accepted' | 'rejected' | 'completed' | 'failed';
  message?: string;
  new_calibration_date?: string; // ISO 8601 formatted date
  timestamp: string; // ISO 8601 formatted date
}

// Aggiungiamo una classe di utility per convertire i messaggi MQTT nei nostri DTO
export class MqttMessageConverter {
  static toAirQualityReadingDto(mqttMessage: MqttAirQualityReading): any {
    return {
      deviceId: mqttMessage.device_id,
      latitude: mqttMessage.latitude,
      longitude: mqttMessage.longitude,
      co2Level: mqttMessage.readings.co2,
      methaneLevel: mqttMessage.readings.methane,
      pm25Level: mqttMessage.readings.pm25,
      pm10Level: mqttMessage.readings.pm10,
      ozoneLevel: mqttMessage.readings.ozone,
      no2Level: mqttMessage.readings.no2,
      timestamp: new Date(mqttMessage.timestamp),
    };
  }
}
