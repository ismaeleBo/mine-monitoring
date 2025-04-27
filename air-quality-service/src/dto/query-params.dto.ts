import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

export class AirQualityQueryParamsDto {
  @ApiPropertyOptional({ description: 'ID del sensore' })
  @IsOptional()
  @IsString()
  sensorId?: string;

  @ApiPropertyOptional({
    description: 'Identificativo della zona (es. openpit-sector)',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: 'Data di inizio (ISO 8601)' })
  @IsOptional()
  @Transform(({ value }: { value: string }) => new Date(value), {
    toClassOnly: true,
  })
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({ description: 'Data di fine (ISO 8601)' })
  @IsOptional()
  @Transform(({ value }: { value: string }) => new Date(value), {
    toClassOnly: true,
  })
  @IsDate()
  endDate?: Date;
}
