import { ApiProperty } from '@nestjs/swagger';

export class DailyAverageDto {
  @ApiProperty({
    description: 'Date of the daily average (YYYY-MM-DD format)',
  })
  date!: string;

  @ApiProperty({ description: 'Average PM2.5 in µg/m³', required: false })
  avgPm25!: number;

  @ApiProperty({ description: 'Average PM10 in µg/m³', required: false })
  avgPm10!: number;

  @ApiProperty({ description: 'Average NO2 in ppb', required: false })
  avgNo2!: number;

  @ApiProperty({ description: 'Average CO in ppm', required: false })
  avgCo!: number;

  @ApiProperty({
    description: 'Average O2 as a percentage (%)',
    required: false,
  })
  avgO2!: number;

  @ApiProperty({ description: 'Average SO2 in ppb', required: false })
  avgSo2!: number;

  @ApiProperty({
    description: 'Average CH4 as a percentage (%)',
    required: false,
  })
  avgCh4!: number;

  @ApiProperty({ description: 'Average VOC in ppb', required: false })
  avgVoc!: number;
}
