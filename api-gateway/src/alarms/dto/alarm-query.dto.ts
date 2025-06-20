import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { AlarmParameter, AlarmSeverity } from './alarm-response.dto';

export class AlarmQueryDto {
  @ApiPropertyOptional({ example: 'stockpile-area' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: 'AIR-001' })
  @IsOptional()
  @IsString()
  sensorId?: string;

  @ApiPropertyOptional({ enum: AlarmParameter, example: AlarmParameter.PM10 })
  @IsOptional()
  @IsEnum(AlarmParameter)
  parameter?: AlarmParameter;

  @ApiPropertyOptional({ enum: AlarmSeverity, example: AlarmSeverity.HIGH })
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
