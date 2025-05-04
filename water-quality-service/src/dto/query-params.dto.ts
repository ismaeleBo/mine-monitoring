import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

export class WaterQualityQueryParamsDto {
  @ApiPropertyOptional({ description: 'Sensor ID' })
  @IsOptional()
  @IsString()
  sensorId?: string;

  @ApiPropertyOptional({ description: 'Zone location' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: 'Start date (ISO 8601)' })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({ description: 'End date (ISO 8601)' })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  endDate?: Date;
}
