import { ApiProperty } from '@nestjs/swagger';

export class ProductionDailyAverageDto {
  @ApiProperty()
  date!: string;

  @ApiProperty({ required: false })
  avgExtractedMaterial?: number;

  @ApiProperty({ required: false })
  avgMachineOperatingHours?: number;

  @ApiProperty({ required: false })
  avgLoadsMoved?: number;
}
