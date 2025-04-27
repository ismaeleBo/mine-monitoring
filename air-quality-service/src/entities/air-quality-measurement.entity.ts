import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'air_quality_measurements' })
export class AirQualityMeasurement {
  @ApiProperty({ description: 'ID univoco della misurazione' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({
    description: 'ID del sensore che ha effettuato la misurazione',
  })
  @Column()
  sensorId!: string;

  @ApiProperty({ description: 'Timestamp della misurazione (UTC)' })
  @Column({ type: 'timestamp' })
  timestamp!: Date;

  @ApiProperty({ description: 'Identificativo della zona della miniera' })
  @Column()
  location!: string;

  @ApiProperty({
    description: 'Concentrazione PM2.5 in µg/m³',
    required: false,
  })
  @Column('float', { nullable: true })
  pm25!: number | null;

  @ApiProperty({ description: 'Concentrazione PM10 in µg/m³', required: false })
  @Column('float', { nullable: true })
  pm10!: number | null;

  @ApiProperty({ description: 'Concentrazione NO2 in ppb', required: false })
  @Column('float', { nullable: true })
  no2!: number | null;

  @ApiProperty({ description: 'Concentrazione CO in ppm', required: false })
  @Column('float', { nullable: true })
  co!: number | null;

  @ApiProperty({ description: 'Percentuale di O2 (%)', required: false })
  @Column('float', { nullable: true })
  o2!: number | null;

  @ApiProperty({ description: 'Concentrazione SO2 in ppb', required: false })
  @Column('float', { nullable: true })
  so2!: number | null;

  @ApiProperty({ description: 'Percentuale di CH4 (%)', required: false })
  @Column('float', { nullable: true })
  ch4!: number | null;

  @ApiProperty({ description: 'Concentrazione VOC in ppb', required: false })
  @Column('float', { nullable: true })
  voc!: number | null;
}
