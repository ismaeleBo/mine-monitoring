import { ApiProperty } from '@nestjs/swagger';

export enum AlarmSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
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

  @ApiProperty({ example: 'PM10' })
  parameter: string;

  @ApiProperty({ example: 151.16 })
  measuredValue: number;

  @ApiProperty({ example: 150 })
  thresholdExceeded: number;

  @ApiProperty({ enum: AlarmSeverity, example: AlarmSeverity.MEDIUM })
  severity: AlarmSeverity;
}
