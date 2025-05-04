import { ApiProperty } from '@nestjs/swagger';

export enum AlarmSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum AlarmParameter {
  PM2_5 = 'PM2_5',
  PM10 = 'PM10',
  CO = 'CO',
  NO2 = 'NO2',
  O2 = 'O2',
  pH = 'pH',
  CONDUCTIVITY = 'Conductivity',
  DO = 'DO',
  AS = 'As',
  PB = 'Pb',
  VOC = 'VOC',
  EXTRACTED_MATERIAL = 'EXTRACTED_MATERIAL',
  LOADS_MOVED = 'LOADS_MOVED',
  MACHINE_OPERATING_HOURS = 'MACHINE_OPERATING_HOURS',
}

export class AlarmResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'AIR-005' })
  sensorId: string;

  @ApiProperty({ example: '2025-04-30T10:38:03.250Z' })
  timestamp: string;

  @ApiProperty({ example: 'stockpile-area' })
  location: string;

  @ApiProperty({ enum: AlarmParameter, example: AlarmParameter.PM10 })
  parameter: AlarmParameter;

  @ApiProperty({ example: 151.16 })
  measuredValue: number;

  @ApiProperty({ example: 150 })
  thresholdExceeded: number;

  @ApiProperty({ enum: AlarmSeverity, example: AlarmSeverity.MEDIUM })
  severity: AlarmSeverity;
}
