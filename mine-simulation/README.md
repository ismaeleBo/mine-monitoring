# Mine Simulation

This folder contains a Python-based simulator designed to emulate sensor data for testing the mine monitoring platform in the absence of real hardware. It simulates environmental and operational dynamics within multiple zones of a mining site, periodically publishing messages to an MQTT broker for consumption by the corresponding microservices.

## Features

- Simulates air, water, soil and production-related metrics using virtual sensors
- Dynamically triggers random **events** (e.g. gas leak, contamination) and **operations** (e.g. excavation, drilling) that impact sensor values
- Evaluates thresholds and publishes real-time **alarms** via MQTT messages
- Modular and extensible architecture with clean object-oriented design

## UML Class Diagram

The following diagram outlines the internal structure and relationships between the main simulation components:

![UML Diagram](https://github.com/ismaeleBo/mine-monitoring/blob/master/docs/class_diagram_simulator.png)

## Requirements

- Python 3.10+
- A reachable MQTT broker on `localhost:1883` (default)  
  (you can modify `broker_address` and `broker_port` in `main.py`)

Install dependencies using:

```bash
pip install -r requirements.txt
```

## Running the Simulation

Launch the simulator with:

```bash
python main.py
```

By default, it emits new readings every 5 seconds. You can modify the `tick_interval` and `site_id` inside `main.py` for different configurations or stress testing.

## Published Topics

- **Sensor Readings**

  ```
  mining/readings/<service>/<site_id>/<zone_id>/<sensor_id>
  ```

- **Alarms**

  ```
  mining/alerts/<zone_id>/<severity>/<sensor_id>
  ```

Where `<service>` can be one of:
`air-quality`, `water-quality`, `soil-quality`, `production-monitoring`

## File Overview

- `engine.py` – main simulation engine with clock and world state
- `world_builder.py` – defines zones, sensors and structure of the simulated mine
- `sensor.py`, `event.py`, `operation.py` – core domain objects representing sensors and activity
- `alarm_manager.py` – evaluates generated values and issues MQTT-based alarms
- `main.py` – entry point script to configure and run the simulation loop
