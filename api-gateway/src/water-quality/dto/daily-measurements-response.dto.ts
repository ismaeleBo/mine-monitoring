import { ApiProperty } from '@nestjs/swagger';

export class DailyMeasurementsResponse {
  @ApiProperty({ example: '2025-04-30T12:00:00Z' })
  timestamp!: Date;

  @ApiProperty({ example: 'tailings-pond' })
  location!: string;

  @ApiProperty({ example: 'WATER-001' })
  sensorId!: string;

  @ApiProperty({ required: false, example: 7.4 })
  ph?: number;

  @ApiProperty({ required: false, example: 750 })
  conductivity?: number;

  @ApiProperty({ required: false, example: 6.5 })
  do?: number;

  @ApiProperty({ required: false, example: 0.008 })
  as?: number;
}
