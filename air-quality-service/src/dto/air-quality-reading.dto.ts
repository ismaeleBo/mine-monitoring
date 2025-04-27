import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, IsDateString } from 'class-validator';

export class AirQualityReadingDto {
  @ApiProperty({ description: 'ID del sensore che ha inviato la lettura' })
  @IsString()
  sensorId!: string;

  @ApiProperty({ description: 'Timestamp della lettura (formato ISO 8601)' })
  @IsDateString()
  timestamp!: string;

  @ApiProperty({ description: 'Identificativo della zona della miniera' })
  @IsString()
  location!: string;

  @ApiProperty({
    description: 'Concentrazione PM2.5 in µg/m³',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  pm25?: number | null;

  @ApiProperty({ description: 'Concentrazione PM10 in µg/m³', required: false })
  @IsOptional()
  @IsNumber()
  pm10?: number | null;

  @ApiProperty({ description: 'Concentrazione NO2 in ppb', required: false })
  @IsOptional()
  @IsNumber()
  no2?: number | null;

  @ApiProperty({ description: 'Concentrazione CO in ppm', required: false })
  @IsOptional()
  @IsNumber()
  co?: number | null;

  @ApiProperty({ description: 'Percentuale di O2 (%)', required: false })
  @IsOptional()
  @IsNumber()
  o2?: number | null;

  @ApiProperty({ description: 'Concentrazione SO2 in ppb', required: false })
  @IsOptional()
  @IsNumber()
  so2?: number | null;

  @ApiProperty({ description: 'Percentuale di CH4 (%)', required: false })
  @IsOptional()
  @IsNumber()
  ch4?: number | null;

  @ApiProperty({ description: 'Concentrazione VOC in ppb', required: false })
  @IsOptional()
  @IsNumber()
  voc?: number | null;
}
