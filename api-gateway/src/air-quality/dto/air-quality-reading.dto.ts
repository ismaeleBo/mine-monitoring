import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class AirQualityReadingDto {
  @ApiProperty({ description: 'Sensor ID' })
  @IsString()
  @IsNotEmpty()
  sensorId!: string;

  @ApiProperty({ description: 'Timestamp of the measurement (ISO)' })
  @IsString()
  @IsNotEmpty()
  timestamp!: string;

  @ApiProperty({ description: 'Mine area' })
  @IsString()
  @IsNotEmpty()
  location!: string;

  @ApiProperty({ description: 'PM2.5 (µg/m³)', required: false })
  @IsOptional()
  @IsNumber()
  pm25?: number;

  @ApiProperty({ description: 'PM10 (µg/m³)', required: false })
  @IsOptional()
  @IsNumber()
  pm10?: number;

  @ApiProperty({ description: 'NO2 (ppb)', required: false })
  @IsOptional()
  @IsNumber()
  no2?: number;

  @ApiProperty({ description: 'CO (ppm)', required: false })
  @IsOptional()
  @IsNumber()
  co?: number;

  @ApiProperty({ description: 'O2 (%)', required: false })
  @IsOptional()
  @IsNumber()
  o2?: number;

  @ApiProperty({ description: 'SO2 (ppb)', required: false })
  @IsOptional()
  @IsNumber()
  so2?: number;

  @ApiProperty({ description: 'CH4 (%)', required: false })
  @IsOptional()
  @IsNumber()
  ch4?: number;

  @ApiProperty({ description: 'VOC (ppb)', required: false })
  @IsOptional()
  @IsNumber()
  voc?: number;
}
