import json
import datetime

class AlarmManager:
    def __init__(self, mqtt_client, cooldown_seconds=60):
        self.mqtt_client = mqtt_client
        self.cooldown_seconds = cooldown_seconds
        self.last_triggered = {}  # {(sensor_id, parameter): datetime}
        self.thresholds = {
            "PM2_5": {"LOW": 50, "MEDIUM": 100, "HIGH": 150, "CRITICAL": 200},       # µg/m³
            "PM10": {"LOW": 70, "MEDIUM": 150, "HIGH": 200, "CRITICAL": 300},        # µg/m³
            "CO": {"LOW": 5, "MEDIUM": 15, "HIGH": 30, "CRITICAL": 50},              # ppm
            "NO2": {"LOW": 40, "MEDIUM": 80, "HIGH": 120, "CRITICAL": 160},          # ppb
            "O2": {"LOW": 19.5, "MEDIUM": 19.0, "HIGH": 18.5, "CRITICAL": 18.0},     # % (desc)
            "pH": {"LOW": 6.0, "MEDIUM": 6.5, "HIGH": 9.0, "CRITICAL": 9.5},         # safe: 6.5–8.5
            "Conductivity": {"LOW": 300, "MEDIUM": 600, "HIGH": 1000, "CRITICAL": 1200},  # µS/cm
            "DO": {"LOW": 4, "MEDIUM": 3, "HIGH": 2.5, "CRITICAL": 2},               # mg/L (desc)
            "As": {"LOW": 0.01, "MEDIUM": 0.05, "HIGH": 0.1, "CRITICAL": 0.2},       # mg/L
            "Pb": {"LOW": 50, "MEDIUM": 100, "HIGH": 300, "CRITICAL": 500},          # mg/kg
            "VOC": {"LOW": 100, "MEDIUM": 200, "HIGH": 300, "CRITICAL": 500},        # ppb

            # Production metrics
            "EXTRACTED_MATERIAL": {"LOW": 60, "MEDIUM": 40, "HIGH": 30, "CRITICAL": 20},  # t/h
            "LOADS_MOVED": {"LOW": 6, "MEDIUM": 4, "HIGH": 3, "CRITICAL": 2},             # units/h
            "MACHINE_OPERATING_HOURS": {"LOW": 16, "MEDIUM": 14, "HIGH": 13, "CRITICAL": 12}  # h/day
        }
    def evaluate(self, sensor_data):
        if not sensor_data or "values" not in sensor_data:
            print("[ALARM MANAGER] Missing or malformed payload:", sensor_data)
            return

        for parameter, value in sensor_data["values"].items():
            if parameter not in self.thresholds:
                continue  # ignora parametri non monitorati

            if not isinstance(value, (int, float)):
                print(f"[ALARM MANAGER] Non-numeric value for {parameter}: {value}")
                continue

            severity = self.check_severity(parameter, value)
            if severity:
                threshold = self.thresholds[parameter].get(severity)
                if threshold is None:
                    print(f"[ALARM MANAGER] No threshold '{severity}' for {parameter}")
                    continue

                alarm = self.generate_alarm(
                    sensor_data, parameter, value, severity, threshold
                )
                self.publish_alarm(alarm)

    def check_severity(self, parameter, value):
        param_thresholds = self.thresholds.get(parameter)
        if not param_thresholds or not isinstance(param_thresholds, dict):
            return None

        # Determine if increasing thresholds are worse or better
        is_increasing = list(param_thresholds.values())[0] < list(param_thresholds.values())[-1]

        # Sort thresholds from most to least severe
        sorted_thresholds = (
            reversed(param_thresholds.items()) if is_increasing else param_thresholds.items()
        )

        for severity, threshold in sorted_thresholds:
            if is_increasing and value >= threshold:
                return severity
            elif not is_increasing and value <= threshold:
                return severity

        return None

    def generate_alarm(self, sensor_data, parameter, value, severity, threshold):
        return {
            "sensor_id": sensor_data["sensor_id"],
            "timestamp": sensor_data["timestamp"],
            "location": sensor_data["location"],
            "parameter": parameter,
            "measured_value": value,
            "threshold_exceeded": threshold,
            "severity": severity
        }
    
    def publish_alarm(self, alarm_payload):
        topic = f"mining/alerts/{alarm_payload['location']}/{alarm_payload['severity']}/{alarm_payload['sensor_id']}"
        self.mqtt_client.publish(topic, json.dumps(alarm_payload))
        print(f"[ALARM] {alarm_payload['severity']} - {alarm_payload['parameter']} = {alarm_payload['measured_value']} in {alarm_payload['location']} (Sensor {alarm_payload['sensor_id']})")
