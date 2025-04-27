import { ApiProperty } from '@nestjs/swagger';

export class AirQualityResponseDto {
  @ApiProperty({ description: 'Unique measurement ID' })
  id!: number;

  @ApiProperty({
    description: 'ID of the sensor that took the measurement',
  })
  sensorId!: string;

  @ApiProperty({ description: 'Timestamp of the measurement (UTC)' })
  timestamp!: Date;

  @ApiProperty({ description: 'Identification of the mine area' })
  location!: string;

  @ApiProperty({
    description: 'PM2.5 concentration in µg/m³',
    required: false,
  })
  pm25?: number | null;

  @ApiProperty({ description: 'PM10 concentration in µg/m³', required: false })
  pm10?: number | null;

  @ApiProperty({ description: 'NO2 concentration in ppb', required: false })
  no2?: number | null;

  @ApiProperty({ description: 'CO concentration in ppm', required: false })
  co?: number | null;

  @ApiProperty({ description: 'Percentage of O2 (%)', required: false })
  o2?: number | null;

  @ApiProperty({ description: 'SO2 concentration in ppb', required: false })
  so2?: number | null;

  @ApiProperty({ description: 'Percentage of CH4 (%)', required: false })
  ch4?: number | null;

  @ApiProperty({ description: 'VOC concentration in ppb', required: false })
  voc?: number | null;
}
