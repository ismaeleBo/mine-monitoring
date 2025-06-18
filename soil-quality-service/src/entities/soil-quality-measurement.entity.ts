import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'soil_quality_measurements' })
export class SoilQualityMeasurement {
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

  @ApiProperty({ description: 'VOC value', required: false })
  @Column('float', { nullable: true })
  voc!: number | null;

  @ApiProperty({ description: 'Pb (mg/kg)', required: false })
  @Column('float', { nullable: true })
  pb!: number | null;
}
