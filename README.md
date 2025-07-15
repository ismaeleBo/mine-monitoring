# Mine Monitoring Platform

This repository contains the full source code for a mining site monitoring platform developed as part of my Bachelor's thesis.
The system is designed to collect, process, and visualize environmental and production data from an open-pit mine using a modular microservices architecture.
It includes services for collecting environmental data, a gateway API, a dashboard front‑end, and a simulator that generates sample readings.

## Features

- Modular architecture based on NestJS microservices and Next.js frontend
- Real-time monitoring of air, water, soil quality and production performance
- Alarm generation and notification via MQTT and WebSocket
- Responsive dashboard with filtering, time range selection, and alert notifications
- Built-in simulator for generating test data
- Fully orchestrated using Docker Compose

## System Architecture

Below is a high-level view of the system architecture, showing the flow of data from edge devices to cloud microservices and the dashboard frontend.

## Services Overview

- **Air Quality Service** – Monitors PM2.5, PM10, CO, NO₂, SO₂, CH₄, and O₂.
- **Water Quality Service** – Monitors pH, conductivity, dissolved oxygen, and heavy metals.
- **Soil Quality Service** – Monitors Pb concentration and volatile organic compounds.
- **Production Monitoring Service** – Reports on material throughput, load counts, and machinery activity.
- **Alarm Service** – Evaluates sensor readings and emits real-time alerts.
- **API Gateway** – Routes all HTTP requests from the client to microservices.
- **Dashboard** – A Next.js frontend to explore data and interact with the platform.
- **Mine Simulation** – Python OOP project to simulate and publish environmental and production sensor readings via MQTT.

Each service uses its own PostgreSQL database and communicates via lightweight protocols like MQTT and TCP.

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- Python 3 (to run simulator locally)
- Node.js and npm (to run services and dashboard locally)

### Environment Configuration

Each service includes a `.env.example` file. Copy and customize it:

```bash
cp air-quality-service/.env.example air-quality-service/.env
```

For database initialization, define variables in `dbinit.env` (e.g. `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`).

### Running the Platform

Start all services from the repository root:

```bash
docker compose up -d --build
```

To stop services:

```bash
docker compose down -v --remove-orphans
```

Accessible endpoints (default, customizable via .env files):

- **Dashboard** – `http://localhost:3000`
- **API Gateway** – `http://localhost:3010`
- **Swagger Docs**:

  - Air Quality – `http://localhost:3002/api`
  - Water Quality – `http://localhost:3004/api`
  - Soil Quality – `http://localhost:3005/api`
  - Production Monitoring – `http://localhost:3006/api`
  - Alarm Service – `http://localhost:3003/api`

### Simulating Sensor Data

Generate sample data by running the simulator:

```bash
cd mine-simulation
pip install -r requirements.txt
python main.py
```

To allow microservices to receive sensor data published by the simulation script, MQTT communication must be properly configured.

## Directory Structure

```
├── air-quality-service
├── water-quality-service
├── soil-quality-service
├── production-monitoring-service
├── alarm-service
├── api-gateway
├── dashboard             # Next.js frontend
├── mine-simulation       # Python-based data generator
└── docker-compose.yml    # Orchestrates the full system
```

## Notes

- Authentication is not implemented but planned as a future service (Auth Service).
- All external requests from the frontend go through the API Gateway for secure routing.
- Passwords (in future auth service) would be stored as secure cryptographic hashes (e.g., bcrypt).
- Designed with cloud-native scalability in mind; tested on AWS environments.

## License

This project is shared for educational and demonstration purposes. No production license is currently defined.
