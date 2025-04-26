import json

class AlarmManager:
    def __init__(self, mqtt_client):
        self.mqtt_client = mqtt_client
        self.thresholds = {
            "PM2.5": {"LOW": 50, "MEDIUM": 100, "HIGH": 150, "CRITICAL": 200},  # µg/m³
            "PM10": {"LOW": 70, "MEDIUM": 150, "HIGH": 200, "CRITICAL": 300},    # µg/m³
            "CO": {"LOW": 5, "MEDIUM": 15, "HIGH": 30, "CRITICAL": 50},          # ppm
            "NO₂": {"LOW": 40, "MEDIUM": 80, "HIGH": 120, "CRITICAL": 160},      # ppb
            "O₂": {"LOW": 19.5, "CRITICAL": 18.0},                               # %, soglie verso il basso
            "pH": {"LOW": 6.0, "HIGH": 9.0},                                     # range sicuro
            "Conducibilità": {"LOW": 300, "HIGH": 1200},                         # µS/cm
            "Ossigeno disciolto": {"LOW": 4, "CRITICAL": 2},                     # mg/L
            "Arsenico": {"LOW": 0.01, "MEDIUM": 0.05, "HIGH": 0.1, "CRITICAL": 0.2}, # mg/L
            "Piombo": {"LOW": 50, "MEDIUM": 100, "HIGH": 300, "CRITICAL": 500},  # mg/kg
            "VOC": {"LOW": 100, "MEDIUM": 200, "HIGH": 300, "CRITICAL": 500},    # ppb
            # Produzione
            "Materiale estratto": {"LOW": 60, "MEDIUM": 40, "CRITICAL": 20},     # t/h, più basso = peggio
            "Carichi movimentati": {"LOW": 6, "MEDIUM": 4, "CRITICAL": 2},       # unità/h
            "Ore macchina operative": {"LOW": 16, "CRITICAL": 12}               # h/giorno
        }
    def evaluate(self, sensor_data):
        for parameter, value in sensor_data["values"].items():
            if parameter in self.thresholds:
                severity = self.check_severity(parameter, value)
                if severity:
                    alarm = self.generate_alarm(sensor_data, parameter, value, severity, self.thresholds[parameter][severity])
                    self.publish_alarm(alarm)

    def check_severity(self, parameter, value):
        param_thresholds = self.thresholds.get(parameter)
        if isinstance(param_thresholds, dict):
            for severity, threshold in reversed(param_thresholds.items()):
                if value >= threshold:
                    return severity
        return None

    def generate_alarm(self, sensor_data, parameter, value, severity, threshold):
        return {
            "sensor_id": sensor_data["sensor_id"],
            "timestamp": sensor_data["timestamp"],
            "zone": sensor_data["location"],
            "parameter": parameter,
            "measured_value": value,
            "threshold_exceeded": threshold,
            "severity": severity
        }
    
    def publish_alarm(self, alarm_payload):
        topic = f"mining/site-a/alerts/{alarm_payload['zone']}/{alarm_payload['severity']}/{alarm_payload['sensor_id']}"
        self.mqtt_client.publish(topic, json.dumps(alarm_payload))
        print(f"[ALARM] {alarm_payload['severity']} - {alarm_payload['parameter']} = {alarm_payload['measured_value']} in {alarm_payload['zone']} (Sensor {alarm_payload['sensor_id']})")
