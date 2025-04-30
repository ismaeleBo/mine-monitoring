import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alarm } from '../entities/alarm.entity';
import { CreateAlarmDto } from '../dto/create-alarm.dto';
import { ClientProxy } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { AlarmResponseDto } from 'src/dto/alarm-response.dto';
import { AlarmQueryDto } from 'src/dto/alarm-query.dto';

@Injectable()
export class AlarmService {
  constructor(
    @InjectRepository(Alarm)
    private readonly alarmRepository: Repository<Alarm>,

    @Inject('ALARM_NOTIFIER')
    private readonly client: ClientProxy,
  ) {}

  async create(createAlarmDto: CreateAlarmDto): Promise<Alarm> {
    const alarm = this.alarmRepository.create({
      ...createAlarmDto,
      timestamp: new Date(createAlarmDto.timestamp),
    });

    const saved = await this.alarmRepository.save(alarm);

    const responseDto = plainToInstance(AlarmResponseDto, saved);
    this.client.emit('alarm_created', responseDto);

    return saved;
  }

  async findAll(): Promise<Alarm[]> {
    return this.alarmRepository.find({
      order: { timestamp: 'DESC' },
    });
  }

  async findById(id: number): Promise<Alarm | null> {
    return this.alarmRepository.findOne({ where: { id } });
  }

  async findByFilters(query: AlarmQueryDto): Promise<Alarm[]> {
    const qb = this.alarmRepository.createQueryBuilder('alarm');

    if (query.location) {
      qb.andWhere('alarm.location = :location', { location: query.location });
    }

    if (query.sensorId) {
      qb.andWhere('alarm.sensorId = :sensorId', { sensorId: query.sensorId });
    }

    if (query.severity) {
      qb.andWhere('alarm.severity = :severity', { severity: query.severity });
    }

    if (query.startDate && query.endDate) {
      qb.andWhere('alarm.timestamp BETWEEN :start AND :end', {
        start: new Date(query.startDate),
        end: new Date(query.endDate),
      });
    } else if (query.startDate) {
      qb.andWhere('alarm.timestamp >= :start', {
        start: new Date(query.startDate),
      });
    } else if (query.endDate) {
      qb.andWhere('alarm.timestamp <= :end', {
        end: new Date(query.endDate),
      });
    }

    return qb.orderBy('alarm.timestamp', 'DESC').getMany();
  }
}
