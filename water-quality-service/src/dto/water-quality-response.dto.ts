import { ApiProperty } from '@nestjs/swagger';

export class WaterQualityResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  sensorId!: string;

  @ApiProperty()
  timestamp!: Date;

  @ApiProperty()
  location!: string;

  @ApiProperty({ required: false })
  pH?: number;

  @ApiProperty({ required: false })
  dissolvedOxygen?: number;

  @ApiProperty({ required: false })
  conductivity?: number;

  @ApiProperty({ required: false })
  arsenic?: number;
}
