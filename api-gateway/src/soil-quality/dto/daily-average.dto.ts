import { ApiProperty } from '@nestjs/swagger';

export class SoilDailyAverageDto {
  @ApiProperty()
  date!: string;

  @ApiProperty({ required: false })
  avgVoc?: number;

  @ApiProperty({ required: false })
  avgPb?: number;
}
