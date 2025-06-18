import json
import datetime

class AlarmManager:
    def __init__(self, mqtt_client, cooldown_seconds=60):
        self.mqtt_client = mqtt_client
        self.cooldown_seconds = cooldown_seconds
        self.last_triggered = {}  # {(sensor_id, parameter): datetime}
        self.thresholds = {
            # Air Quality
            "PM2_5":        {"LOW": 35, "MEDIUM": 50, "HIGH": 75, "CRITICAL": 100},           # µg/m³
            "PM10":         {"LOW": 50, "MEDIUM": 80, "HIGH": 120, "CRITICAL": 150},          # µg/m³
            "CO":           {"LOW": 2, "MEDIUM": 5, "HIGH": 10, "CRITICAL": 30},              # ppm
            "NO2":          {"LOW": 30, "MEDIUM": 50, "HIGH": 75, "CRITICAL": 100},           # ppb
            "SO2":          {"LOW": 10, "MEDIUM": 25, "HIGH": 50, "CRITICAL": 75},            # ppb
            "CH4":          {"LOW": 1.0, "MEDIUM": 1.5, "HIGH": 2.0, "CRITICAL": 2.5},        # %
            "O2":           {"LOW": 20.0, "MEDIUM": 19.5, "HIGH": 19.0, "CRITICAL": 18.5},    # %
            "VOC_air":      {"LOW": 150, "MEDIUM": 250, "HIGH": 350, "CRITICAL": 500},        # ppb (workshop/fuel)

            # Water Quality
            "pH":           {"LOW": 6.0, "MEDIUM": 5.5, "HIGH": 9.0, "CRITICAL": 9.5},        # normale: 6.5–8.5
            "Conductivity": {"LOW": 800, "MEDIUM": 1000, "HIGH": 1500, "CRITICAL": 2000},     # µS/cm
            "DO":           {"LOW": 4.0, "MEDIUM": 3.0, "HIGH": 2.5, "CRITICAL": 2.0},        # mg/L
            "As":           {"LOW": 0.005, "MEDIUM": 0.01, "HIGH": 0.05, "CRITICAL": 0.1},    # mg/L

            # Soil Quality
            "Pb":           {"LOW": 60, "MEDIUM": 100, "HIGH": 200, "CRITICAL": 400},         # mg/kg
            "VOC_soil":     {"LOW": 150, "MEDIUM": 300, "HIGH": 400, "CRITICAL": 600},        # ppb (suolo contaminato)

            # Production Metrics
            "EXTRACTED_MATERIAL":       {"LOW": 70, "MEDIUM": 60, "HIGH": 40, "CRITICAL": 20}, # t/h
            "LOADS_MOVED":              {"LOW": 6, "MEDIUM": 4, "HIGH": 3, "CRITICAL": 2},     # u/h
            "MACHINE_OPERATING_HOURS": {"LOW": 17, "MEDIUM": 15, "HIGH": 13, "CRITICAL": 10}  # h/d
        }

    def evaluate(self, sensor_data):
        if not sensor_data or "values" not in sensor_data:
            print("[ALARM MANAGER] Missing or malformed payload:", sensor_data)
            return

        sensor_type = sensor_data.get("type", "")

        for parameter, value in sensor_data["values"].items():
            param_key = parameter
            if parameter == "VOC":
                if sensor_type == "air_quality":
                    param_key = "VOC_air"
                elif sensor_type == "soil_quality":
                    param_key = "VOC_soil"

            if param_key not in self.thresholds:
                continue

            if not isinstance(value, (int, float)):
                print(f"[ALARM MANAGER] Non-numeric value for {parameter}: {value}")
                continue

            severity = self.check_severity(param_key, value)
            if severity:
                threshold = self.thresholds[param_key].get(severity)
                if threshold is None:
                    print(f"[ALARM MANAGER] No threshold '{severity}' for {parameter}")
                    continue

                alarm = self.generate_alarm(
                    sensor_data, parameter, value, severity, threshold
                )
                self.publish_alarm(alarm)

    def check_severity(self, parameter_key, value):
        param_thresholds = self.thresholds.get(parameter_key)
        if not param_thresholds or not isinstance(param_thresholds, dict):
            return None

        # Determine threshold direction
        is_increasing = list(param_thresholds.values())[0] < list(param_thresholds.values())[-1]

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