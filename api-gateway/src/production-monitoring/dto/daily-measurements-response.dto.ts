import { ApiProperty } from '@nestjs/swagger';

export class DailyMeasurementsResponse {
  @ApiProperty({ example: '2025-04-30T12:00:00Z' })
  timestamp!: Date;

  @ApiProperty({ example: 'machine-fleet' })
  location!: string;

  @ApiProperty({ example: 'PROD-001' })
  sensorId!: string;

  @ApiProperty({ required: false, example: 7.4 })
  machineOperatingHours?: number;

  @ApiProperty({ required: false, example: 6.5 })
  loadsMoved?: number;

  @ApiProperty({ required: false, example: 6.5 })
  extractedMaterial?: number;
}
