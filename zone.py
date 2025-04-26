from sensor import Sensor

class Zone:
    def __init__(self, zone_id, name):
        self.zone_id = zone_id
        self.name = name
        self.sensors = []
        self.status = "Idle"  # Idle, Active, Emergency
        self.events_active = []
        self.operations_active = []

    def add_sensor(self, sensor: Sensor):
        self.sensors.append(sensor)

    def trigger_event(self, event):
        self.events_active.append(event)
        self.status = "Emergency"

    def trigger_operation(self, operation):
        self.operations_active.append(operation)
        self.status = "Active"

    def resolve_events(self):
        """Rimuove eventi scaduti"""
        self.events_active = [e for e in self.events_active if not e.is_expired()]
        if not self.events_active:
            self.status = "Active" if self.operations_active else "Idle"

    def update_sensors(self):
        """Richiede a tutti i sensori di generare un nuovo dato"""
        data_packets = []
        for sensor in self.sensors:
            packet = sensor.generate_data()
            data_packets.append(packet)
        return data_packets
