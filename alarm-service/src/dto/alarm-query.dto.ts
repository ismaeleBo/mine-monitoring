import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { AlarmSeverity } from './create-alarm.dto';

export class AlarmQueryDto {
  @ApiPropertyOptional({ example: 'stockpile-area' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: 'AIR-001' })
  @IsOptional()
  @IsString()
  sensorId?: string;

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
