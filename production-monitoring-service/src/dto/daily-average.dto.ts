import { ApiProperty } from '@nestjs/swagger';

export class ProductionDailyAverageDto {
  @ApiProperty()
  date!: string;

  @ApiProperty({
    description: 'Average Extracted Material t/h',
    required: false,
  })
  avgExtractedMaterial?: number;

  @ApiProperty({
    description: 'Average Machine Operating Hours (h/d)',
    required: false,
  })
  avgMachineOperatingHours?: number;

  @ApiProperty({
    description: 'Average Loads Moved (u/h)',
    required: false,
  })
  avgLoadsMoved?: number;
}
