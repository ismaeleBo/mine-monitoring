import { ApiProperty } from '@nestjs/swagger';

export class AirQualityResponseDto {
  @ApiProperty({ description: 'ID univoco della misurazione' })
  id!: number;

  @ApiProperty({
    description: 'ID del sensore che ha effettuato la misurazione',
  })
  sensorId!: string;

  @ApiProperty({ description: 'Timestamp della misurazione (UTC)' })
  timestamp!: Date;

  @ApiProperty({ description: 'Identificativo della zona della miniera' })
  location!: string;

  @ApiProperty({
    description: 'Concentrazione PM2.5 in µg/m³',
    required: false,
  })
  pm25?: number | null;

  @ApiProperty({ description: 'Concentrazione PM10 in µg/m³', required: false })
  pm10?: number | null;

  @ApiProperty({ description: 'Concentrazione NO2 in ppb', required: false })
  no2?: number | null;

  @ApiProperty({ description: 'Concentrazione CO in ppm', required: false })
  co?: number | null;

  @ApiProperty({ description: 'Percentuale di O2 (%)', required: false })
  o2?: number | null;

  @ApiProperty({ description: 'Concentrazione SO2 in ppb', required: false })
  so2?: number | null;

  @ApiProperty({ description: 'Percentuale di CH4 (%)', required: false })
  ch4?: number | null;

  @ApiProperty({ description: 'Concentrazione VOC in ppb', required: false })
  voc?: number | null;
}
