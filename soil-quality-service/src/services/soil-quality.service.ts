import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { SoilQualityMeasurement } from '../entities/soil-quality-measurement.entity';
import { SoilQualityReadingDto } from '../dto/soil-quality-reading.dto';
import { SoilQualityResponseDto } from '../dto/soil-quality-response.dto';
import { SoilQualityQueryParamsDto } from '../dto/query-params.dto';
import { SoilDailyAverageDto } from 'src/dto/daily-average.dto';

@Injectable()
export class SoilQualityService {
  constructor(
    @InjectRepository(SoilQualityMeasurement)
    private readonly soilRepo: Repository<SoilQualityMeasurement>,
  ) {}

  async createReading(
    dto: SoilQualityReadingDto,
  ): Promise<SoilQualityResponseDto> {
    const entity = this.soilRepo.create({
      sensorId: dto.sensorId,
      timestamp: new Date(dto.timestamp),
      location: dto.location,
      voc: dto.voc ?? null,
      pb: dto.pb ?? null,
    });

    const saved = await this.soilRepo.save(entity);
    return plainToInstance(SoilQualityResponseDto, saved);
  }

  async getReadingById(id: string): Promise<SoilQualityResponseDto | null> {
    const parsedId = Number(id);
    if (isNaN(parsedId)) return null;

    const reading = await this.soilRepo.findOne({ where: { id: parsedId } });
    return reading ? plainToInstance(SoilQualityResponseDto, reading) : null;
  }

  async search(
    query: SoilQualityQueryParamsDto,
  ): Promise<SoilQualityResponseDto[]> {
    const qb = this.soilRepo.createQueryBuilder('reading');

    if (query.sensorId) {
      qb.andWhere('reading.sensorId = :sensorId', { sensorId: query.sensorId });
    }

    if (query.location) {
      qb.andWhere('reading.location = :location', { location: query.location });
    }

    if (query.startDate && query.endDate) {
      qb.andWhere('reading.timestamp BETWEEN :start AND :end', {
        start: query.startDate,
        end: query.endDate,
      });
    } else if (query.startDate) {
      qb.andWhere('reading.timestamp >= :start', { start: query.startDate });
    } else if (query.endDate) {
      qb.andWhere('reading.timestamp <= :end', { end: query.endDate });
    }

    const results = await qb.orderBy('reading.timestamp', 'ASC').getMany();
    return results.map((r) => plainToInstance(SoilQualityResponseDto, r));
  }

  async getDailyAverages(
    startDate: Date,
    endDate: Date,
    sensorId?: string,
    location?: string,
  ): Promise<SoilDailyAverageDto[]> {
    const adjustedEnd = new Date(endDate);
    adjustedEnd.setHours(23, 59, 59, 999);

    const qb = this.soilRepo
      .createQueryBuilder('reading')
      .select('DATE(reading.timestamp)', 'date')
      .addSelect('AVG(reading.voc)', 'avgVoc')
      .addSelect('AVG(reading.pb)', 'avgPb')
      .where('reading.timestamp BETWEEN :start AND :end', {
        start: startDate,
        end: adjustedEnd,
      });

    if (sensorId) {
      qb.andWhere('reading.sensorId = :sensorId', { sensorId });
    }

    if (location) {
      qb.andWhere('reading.location = :location', { location });
    }

    qb.groupBy('DATE(reading.timestamp)').orderBy('date', 'ASC');

    const raw: {
      date: string;
      avgVoc: string | null;
      avgPb: string | null;
    }[] = await qb.getRawMany();

    return raw.map((r) => ({
      date: r.date,
      avgVoc: r.avgVoc !== null ? parseFloat(r.avgVoc) : undefined,
      avgPb: r.avgPb !== null ? parseFloat(r.avgPb) : undefined,
    }));
  }

  async getDailyMeasurements(date: Date, location?: string): Promise<any[]> {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const qb = this.soilRepo
      .createQueryBuilder('reading')
      .where('reading.timestamp BETWEEN :start AND :end', { start, end });

    if (location) {
      qb.andWhere('reading.location = :location', { location });
    }

    const results = await qb.orderBy('reading.timestamp', 'ASC').getMany();

    return results.map((r) => ({
      timestamp: r.timestamp,
      sensorId: r.sensorId,
      location: r.location,
      voc: r.voc,
      pb: r.pb,
    }));
  }
}
