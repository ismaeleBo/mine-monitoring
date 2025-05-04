import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'water_quality_measurements' })
export class WaterQualityMeasurement {
  @ApiProperty({ description: 'Unique ID of the measurement' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ description: 'ID of the sensor' })
  @Column()
  sensorId!: string;

  @ApiProperty({ description: 'Timestamp of the measurement (UTC)' })
  @Column({ type: 'timestamp' })
  timestamp!: Date;

  @ApiProperty({ description: 'Location in the mining area' })
  @Column()
  location!: string;

  @ApiProperty({ description: 'pH value', required: false })
  @Column('float', { nullable: true })
  pH!: number | null;

  @ApiProperty({ description: 'Dissolved Oxygen (mg/L)', required: false })
  @Column('float', { nullable: true })
  dissolvedOxygen!: number | null;

  @ApiProperty({
    description: 'Electrical Conductivity (µS/cm)',
    required: false,
  })
  @Column('float', { nullable: true })
  conductivity!: number | null;

  @ApiProperty({ description: 'Arsenic concentration (mg/L)', required: false })
  @Column('float', { nullable: true })
  arsenic!: number | null;
}
