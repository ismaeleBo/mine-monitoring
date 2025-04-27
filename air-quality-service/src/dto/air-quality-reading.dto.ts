import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, IsDateString } from 'class-validator';

export class AirQualityReadingDto {
  @ApiProperty({ description: 'ID of the sensor that sent the reading' })
  @IsString()
  sensorId!: string;

  @ApiProperty({ description: 'Timestamp of the reading (ISO 8601 format)' })
  @IsDateString()
  timestamp!: string;

  @ApiProperty({ description: 'Identification of the mine area' })
  @IsString()
  location!: string;

  @ApiProperty({
    description: 'PM2.5 concentration in µg/m³',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  pm25?: number | null;

  @ApiProperty({ description: 'PM10 concentration in µg/m³', required: false })
  @IsOptional()
  @IsNumber()
  pm10?: number | null;

  @ApiProperty({ description: 'NO2 concentration in ppb', required: false })
  @IsOptional()
  @IsNumber()
  no2?: number | null;

  @ApiProperty({ description: 'CO concentration in ppm', required: false })
  @IsOptional()
  @IsNumber()
  co?: number | null;

  @ApiProperty({ description: 'Percentage of O2 (%)', required: false })
  @IsOptional()
  @IsNumber()
  o2?: number | null;

  @ApiProperty({ description: 'SO2 concentration in ppb', required: false })
  @IsOptional()
  @IsNumber()
  so2?: number | null;

  @ApiProperty({ description: 'Percentage of CH4 (%)', required: false })
  @IsOptional()
  @IsNumber()
  ch4?: number | null;

  @ApiProperty({ description: 'VOC concentration in ppb', required: false })
  @IsOptional()
  @IsNumber()
  voc?: number | null;
}
