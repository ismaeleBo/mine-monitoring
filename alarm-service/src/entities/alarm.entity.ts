import { AlarmSeverity } from 'src/dto/create-alarm.dto';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'alarms' })
export class Alarm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sensorId: string;

  @Column()
  timestamp: Date;

  @Column()
  location: string;

  @Column()
  parameter: string;

  @Column('float')
  measuredValue: number;

  @Column('float')
  thresholdExceeded: number;

  @Column({
    type: 'enum',
    enum: AlarmSeverity,
  })
  severity: AlarmSeverity;

  @CreateDateColumn()
  createdAt: Date;
}
