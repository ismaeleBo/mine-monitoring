import { ApiProperty } from '@nestjs/swagger';

export class DailyMeasurementsResponse {
  @ApiProperty({
    example: '2025-04-26T14:30:00.000Z',
    description: 'Timestamp of the measurement',
  })
  timestamp: string;

  @ApiProperty({
    example: 'AIR-001',
    description: 'Sensor ID where the measurement was taken',
  })
  sensorId: string;

  @ApiProperty({
    example: 'openpit-sector',
    description: 'Location where the measurement was taken',
  })
  location: string;

  @ApiProperty({
    example: 36.5,
    description: 'Measured PM2.5 value in μg/m³',
    required: false,
    nullable: true,
  })
  pm25?: number;

  @ApiProperty({
    example: 58.2,
    description: 'Measured PM10 value in μg/m³',
    required: false,
    nullable: true,
  })
  pm10?: number;

  @ApiProperty({
    example: 45.1,
    description: 'Measured NO₂ value in ppb',
    required: false,
    nullable: true,
  })
  no2?: number;

  @ApiProperty({
    example: 1.4,
    description: 'Measured CO value in ppm',
    required: false,
    nullable: true,
  })
  co?: number;

  @ApiProperty({
    example: 20.9,
    description: 'Measured O₂ value in %',
    required: false,
    nullable: true,
  })
  o2?: number;

  @ApiProperty({
    example: 15.6,
    description: 'Measured SO₂ value in ppb',
    required: false,
    nullable: true,
  })
  so2?: number;

  @ApiProperty({
    example: 0.8,
    description: 'Measured CH₄ value in %',
    required: false,
    nullable: true,
  })
  ch4?: number;

  @ApiProperty({
    example: 150.7,
    description: 'Measured VOC value in ppb',
    required: false,
    nullable: true,
  })
  voc?: number;
}
