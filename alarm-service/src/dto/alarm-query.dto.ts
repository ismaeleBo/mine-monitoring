import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { AlarmSeverity } from './create-alarm.dto';

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

export class AlarmQueryDto {
  @ApiPropertyOptional({ example: 'stockpile-area' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: 'AIR-001' })
  @IsOptional()
  @IsString()
  sensorId?: string;

  @ApiPropertyOptional({ example: AlarmParameter.PM10 })
  @IsOptional()
  @IsEnum(AlarmParameter)
  parameter?: AlarmParameter;

  @ApiPropertyOptional({
    enum: AlarmSeverity,
    example: AlarmSeverity.HIGH,
  })
  @IsOptional()
  @IsEnum(AlarmSeverity)
  severity?: AlarmSeverity;

  @ApiPropertyOptional({ example: '2025-04-30T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2025-04-30T23:59:59Z' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
