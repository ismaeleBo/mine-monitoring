import { ApiProperty } from '@nestjs/swagger';

export class DailyAverageDto {
  @ApiProperty({
    description: 'Data della media giornaliera (formato YYYY-MM-DD)',
  })
  date!: string;

  @ApiProperty({ description: 'Media PM2.5 in µg/m³', required: false })
  avgPm25!: number;

  @ApiProperty({ description: 'Media PM10 in µg/m³', required: false })
  avgPm10!: number;

  @ApiProperty({ description: 'Media NO2 in ppb', required: false })
  avgNo2!: number;

  @ApiProperty({ description: 'Media CO in ppm', required: false })
  avgCo!: number;

  @ApiProperty({ description: 'Media O2 in percentuale (%)', required: false })
  avgO2!: number;

  @ApiProperty({ description: 'Media SO2 in ppb', required: false })
  avgSo2!: number;

  @ApiProperty({ description: 'Media CH4 in percentuale (%)', required: false })
  avgCh4!: number;

  @ApiProperty({ description: 'Media VOC in ppb', required: false })
  avgVoc!: number;
}
