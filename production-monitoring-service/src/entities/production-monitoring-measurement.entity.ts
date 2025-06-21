import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'production_monitoring_measurements' })
export class ProductionMonitoringMeasurement {
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

  @ApiProperty({
    description: 'Machine Operating Hours (h/d)',
    required: false,
  })
  @Column('float', { nullable: true })
  machineOperatingHours!: number | null;

  @ApiProperty({ description: 'Loads Moved (u/h)', required: false })
  @Column('float', { nullable: true })
  loadsMoved!: number | null;

  @ApiProperty({ description: 'Extracted Material (t/h)', required: false })
  @Column('float', { nullable: true })
  extractedMaterial!: number | null;
}
