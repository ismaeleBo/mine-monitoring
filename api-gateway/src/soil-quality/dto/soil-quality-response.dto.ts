import { ApiProperty } from '@nestjs/swagger';

export class SoilQualityResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  sensorId!: string;

  @ApiProperty()
  timestamp!: Date;

  @ApiProperty()
  location!: string;

  @ApiProperty({ required: false })
  voc?: number;

  @ApiProperty({ required: false })
  pb?: number;
}
