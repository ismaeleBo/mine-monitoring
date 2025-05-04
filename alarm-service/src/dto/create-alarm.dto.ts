import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDateString, IsEnum } from 'class-validator';

export enum AlarmSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export class CreateAlarmDto {
  @ApiProperty({ example: 'AIR-001' })
  @IsString()
  sensorId: string;

  @ApiProperty({ example: '2025-04-29T10:34:23Z' })
  @IsDateString()
  timestamp: string;

  @ApiProperty({ example: 'openpit-sector' })
  @IsString()
  location: string;

  @ApiProperty({ example: 'PM2_5' })
  @IsString()
  parameter: string;

  @ApiProperty({ example: 152.7 })
  @IsNumber()
  measuredValue: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  thresholdExceeded: number;

  @ApiProperty({ enum: AlarmSeverity, example: AlarmSeverity.HIGH })
  @IsEnum(AlarmSeverity)
  severity: AlarmSeverity;
}
