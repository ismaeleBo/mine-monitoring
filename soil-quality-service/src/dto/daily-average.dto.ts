import { ApiProperty } from '@nestjs/swagger';

export class SoilDailyAverageDto {
  @ApiProperty()
  date!: string;

  @ApiProperty({
    description: 'Average VOC concentration (ppb)',
    required: false,
  })
  avgVoc?: number;

  @ApiProperty({
    description: 'Average Pb concentration (mg/kg)',
    required: false,
  })
  avgPb?: number;
}
