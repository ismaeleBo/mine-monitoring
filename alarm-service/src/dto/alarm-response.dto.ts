import { ApiProperty } from '@nestjs/swagger';
import { AlarmSeverity } from './create-alarm.dto';

export class AlarmResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'AIR-001' })
  sensorId: string;

  @ApiProperty({ example: '2025-04-29T10:34:23Z' })
  timestamp: string;

  @ApiProperty({ example: 'openpit-sector' })
  location: string;

  @ApiProperty({ example: 'PM2.5' })
  parameter: string;

  @ApiProperty({ example: 152.7 })
  measuredValue: number;

  @ApiProperty({ example: 100 })
  thresholdExceeded: number;

  @ApiProperty({ enum: AlarmSeverity, example: AlarmSeverity.HIGH })
  severity: AlarmSeverity;
}
