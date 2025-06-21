import { ApiProperty } from '@nestjs/swagger';

export class ProductionMonitoringResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  sensorId!: string;

  @ApiProperty()
  timestamp!: Date;

  @ApiProperty()
  location!: string;

  @ApiProperty({ required: false })
  extractedMaterial?: number;

  @ApiProperty({ required: false })
  machineOperatingHours?: number;

  @ApiProperty({ required: false })
  loadsMoved?: number;
}
