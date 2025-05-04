import { ApiProperty } from '@nestjs/swagger';

export class WaterDailyAverageDto {
  @ApiProperty()
  date!: string;

  @ApiProperty({ required: false })
  avgPH?: number;

  @ApiProperty({ required: false })
  avgDissolvedOxygen?: number;

  @ApiProperty({ required: false })
  avgConductivity?: number;

  @ApiProperty({ required: false })
  avgArsenic?: number;
}
