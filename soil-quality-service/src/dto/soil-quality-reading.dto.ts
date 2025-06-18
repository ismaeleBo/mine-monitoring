import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional, IsNumber } from 'class-validator';

export class SoilQualityReadingDto {
  @ApiProperty({ description: 'Sensor ID' })
  @IsString()
  sensorId!: string;

  @ApiProperty({ description: 'Timestamp of the reading (ISO 8601)' })
  @IsDateString()
  timestamp!: string;

  @ApiProperty({ description: 'Location of the sensor' })
  @IsString()
  location!: string;

  @ApiProperty({ description: 'VOC concentration in ppb', required: false })
  @IsOptional()
  @IsNumber()
  voc?: number | null;

  @ApiProperty({ description: 'Pb concentration in mg/kg', required: false })
  @IsOptional()
  @IsNumber()
  pb?: number | null;
}
