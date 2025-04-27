import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'air_quality_measurements' })
export class AirQualityMeasurement {
  @ApiProperty({ description: 'Unique measurement ID' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({
    description: 'ID of the sensor that took the measurement',
  })
  @Column()
  sensorId!: string;

  @ApiProperty({ description: 'Timestamp of the measurement (UTC)' })
  @Column({ type: 'timestamp' })
  timestamp!: Date;

  @ApiProperty({ description: 'Identification of the mine area' })
  @Column()
  location!: string;

  @ApiProperty({
    description: 'PM2.5 concentration in µg/m³',
    required: false,
  })
  @Column('float', { nullable: true })
  pm25!: number | null;

  @ApiProperty({ description: 'PM10 concentration in µg/m³', required: false })
  @Column('float', { nullable: true })
  pm10!: number | null;

  @ApiProperty({ description: 'NO2 concentration in ppb', required: false })
  @Column('float', { nullable: true })
  no2!: number | null;

  @ApiProperty({ description: 'CO concentration in ppm', required: false })
  @Column('float', { nullable: true })
  co!: number | null;

  @ApiProperty({ description: 'Percentage of O2 (%)', required: false })
  @Column('float', { nullable: true })
  o2!: number | null;

  @ApiProperty({ description: 'SO2 concentration in ppb', required: false })
  @Column('float', { nullable: true })
  so2!: number | null;

  @ApiProperty({ description: 'Percentage of CH4 (%)', required: false })
  @Column('float', { nullable: true })
  ch4!: number | null;

  @ApiProperty({ description: 'VOC concentration in ppb', required: false })
  @Column('float', { nullable: true })
  voc!: number | null;
}
