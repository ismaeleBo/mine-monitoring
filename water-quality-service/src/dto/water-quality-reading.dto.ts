import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional, IsNumber } from 'class-validator';

export class WaterQualityReadingDto {
  @ApiProperty({ description: 'Sensor ID' })
  @IsString()
  sensorId!: string;

  @ApiProperty({ description: 'Timestamp of the reading (ISO 8601)' })
  @IsDateString()
  timestamp!: string;

  @ApiProperty({ description: 'Location of the sensor' })
  @IsString()
  location!: string;

  @ApiProperty({ description: 'pH level', required: false })
  @IsOptional()
  @IsNumber()
  pH?: number | null;

  @ApiProperty({ description: 'Dissolved Oxygen (mg/L)', required: false })
  @IsOptional()
  @IsNumber()
  dissolvedOxygen?: number | null;

  @ApiProperty({
    description: 'Electrical Conductivity (µS/cm)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  conductivity?: number | null;

  @ApiProperty({ description: 'Arsenic concentration (mg/L)', required: false })
  @IsOptional()
  @IsNumber()
  arsenic?: number | null;
}
