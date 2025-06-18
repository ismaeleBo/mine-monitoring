import { ApiProperty } from '@nestjs/swagger';

export class DailyMeasurementsResponse {
  @ApiProperty({ example: '2025-04-30T12:00:00Z' })
  timestamp!: Date;

  @ApiProperty({ example: 'tailings-pond' })
  location!: string;

  @ApiProperty({ example: 'SOIL-001' })
  sensorId!: string;

  @ApiProperty({ required: false, example: 7.4 })
  voc?: number;

  @ApiProperty({ required: false, example: 6.5 })
  pb?: number;
}
