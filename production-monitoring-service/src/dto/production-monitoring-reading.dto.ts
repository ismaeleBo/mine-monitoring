import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional, IsNumber } from 'class-validator';

export class ProductionMonitoringReadingDto {
  @ApiProperty({ description: 'Sensor ID' })
  @IsString()
  sensorId!: string;

  @ApiProperty({ description: 'Timestamp of the reading (ISO 8601)' })
  @IsDateString()
  timestamp!: string;

  @ApiProperty({ description: 'Location of the sensor' })
  @IsString()
  location!: string;

  @ApiProperty({ description: 'Extracted material in t/h', required: false })
  @IsOptional()
  @IsNumber()
  extractedMaterial?: number | null;

  @ApiProperty({ description: 'Loads moved in u/h', required: false })
  @IsOptional()
  @IsNumber()
  loadsMoved?: number | null;

  @ApiProperty({
    description: 'Machine operating hours in h/d',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  machineOperatingHours?: number | null;
}
