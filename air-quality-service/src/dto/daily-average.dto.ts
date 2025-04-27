import { ApiProperty } from '@nestjs/swagger';

export class DailyAverageDto {
  @ApiProperty({
    description: 'Date of the daily average (format YYYY-MM-DD)',
    example: '2025-04-27',
  })
  date!: string;

  @ApiProperty({
    description: 'Average PM2.5 concentration (μg/m³)',
    required: false,
  })
  avgPm25?: number;

  @ApiProperty({
    description: 'Average PM10 concentration (μg/m³)',
    required: false,
  })
  avgPm10?: number;

  @ApiProperty({
    description: 'Average NO₂ concentration (ppb)',
    required: false,
  })
  avgNo2?: number;

  @ApiProperty({
    description: 'Average CO concentration (ppm)',
    required: false,
  })
  avgCo?: number;

  @ApiProperty({ description: 'Average O₂ concentration (%)', required: false })
  avgO2?: number;

  @ApiProperty({
    description: 'Average SO₂ concentration (ppb)',
    required: false,
  })
  avgSo2?: number;

  @ApiProperty({
    description: 'Average CH₄ concentration (ppm)',
    required: false,
  })
  avgCh4?: number;

  @ApiProperty({
    description: 'Average VOC concentration (ppb)',
    required: false,
  })
  avgVoc?: number;
}
