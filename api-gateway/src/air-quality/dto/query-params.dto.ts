import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class AirQualityQueryParamsDto {
  @ApiProperty({ description: 'Sensor ID', required: false })
  @IsOptional()
  @IsString()
  sensorId?: string;

  @ApiProperty({ description: 'Monitoring zone', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ description: 'Start date (ISO)', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty({ description: 'End Date (ISO)', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;
}
