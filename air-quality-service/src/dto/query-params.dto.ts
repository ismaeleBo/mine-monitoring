import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

export class AirQualityQueryParamsDto {
  @ApiPropertyOptional({ description: 'Sensor ID' })
  @IsOptional()
  @IsString()
  sensorId?: string;

  @ApiPropertyOptional({
    description: 'Zone identifier (e.g., openpit-sector)',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: 'Start date (ISO 8601)' })
  @IsOptional()
  @Transform(({ value }: { value: string }) => new Date(value), {
    toClassOnly: true,
  })
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({ description: 'End Date (ISO 8601)' })
  @IsOptional()
  @Transform(({ value }: { value: string }) => new Date(value), {
    toClassOnly: true,
  })
  @IsDate()
  endDate?: Date;
}
