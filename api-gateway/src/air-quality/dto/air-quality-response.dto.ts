import { ApiProperty } from '@nestjs/swagger';

export class AirQualityResponseDto {
  @ApiProperty({ description: 'Sensor ID' })
  sensorId!: string;

  @ApiProperty({ description: 'Timestamp of the measurement (ISO)' })
  timestamp!: string;

  @ApiProperty({ description: 'Mine area' })
  location!: string;

  @ApiProperty({ description: 'PM2.5 (µg/m³)', required: false })
  pm25?: number;

  @ApiProperty({ description: 'PM10 (µg/m³)', required: false })
  pm10?: number;

  @ApiProperty({ description: 'NO2 (ppb)', required: false })
  no2?: number;

  @ApiProperty({ description: 'CO (ppm)', required: false })
  co?: number;

  @ApiProperty({ description: 'O2 (%)', required: false })
  o2?: number;

  @ApiProperty({ description: 'SO2 (ppb)', required: false })
  so2?: number;

  @ApiProperty({ description: 'CH4 (%)', required: false })
  ch4?: number;

  @ApiProperty({ description: 'VOC (ppb)', required: false })
  voc?: number;
}
