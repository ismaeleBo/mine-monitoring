import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { WaterQualityMeasurement } from '../entities/water-quality-measurement.entity';
import { WaterQualityReadingDto } from '../dto/water-quality-reading.dto';
import { WaterQualityResponseDto } from '../dto/water-quality-response.dto';
import { WaterQualityQueryParamsDto } from '../dto/query-params.dto';
import { WaterDailyAverageDto } from 'src/dto/daily-average.dto';

@Injectable()
export class WaterQualityService {
  constructor(
    @InjectRepository(WaterQualityMeasurement)
    private readonly waterRepo: Repository<WaterQualityMeasurement>,
  ) {}

  async createReading(
    dto: WaterQualityReadingDto,
  ): Promise<WaterQualityResponseDto> {
    const entity = this.waterRepo.create({
      sensorId: dto.sensorId,
      timestamp: new Date(dto.timestamp),
      location: dto.location,
      pH: dto.pH ?? null,
      dissolvedOxygen: dto.dissolvedOxygen ?? null,
      conductivity: dto.conductivity ?? null,
      arsenic: dto.arsenic ?? null,
    });

    const saved = await this.waterRepo.save(entity);
    return plainToInstance(WaterQualityResponseDto, saved);
  }

  async getReadingById(id: string): Promise<WaterQualityResponseDto | null> {
    const parsedId = Number(id);
    if (isNaN(parsedId)) return null;

    const reading = await this.waterRepo.findOne({ where: { id: parsedId } });
    return reading ? plainToInstance(WaterQualityResponseDto, reading) : null;
  }

  async search(
    query: WaterQualityQueryParamsDto,
  ): Promise<WaterQualityResponseDto[]> {
    const qb = this.waterRepo.createQueryBuilder('reading');

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
    return results.map((r) => plainToInstance(WaterQualityResponseDto, r));
  }

  async getDailyAverages(
    startDate: Date,
    endDate: Date,
    sensorId?: string,
    location?: string,
  ): Promise<WaterDailyAverageDto[]> {
    const adjustedEnd = new Date(endDate);
    adjustedEnd.setHours(23, 59, 59, 999);

    const qb = this.waterRepo
      .createQueryBuilder('reading')
      .select('DATE(reading.timestamp)', 'date')
      .addSelect('AVG(reading.pH)', 'avgPh')
      .addSelect('AVG(reading.dissolvedOxygen)', 'avgDo')
      .addSelect('AVG(reading.conductivity)', 'avgConductivity')
      .addSelect('AVG(reading.arsenic)', 'avgAs')
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
      avgPh: string | null;
      avgDo: string | null;
      avgConductivity: string | null;
      avgAs: string | null;
    }[] = await qb.getRawMany();

    return raw.map((r) => ({
      date: r.date,
      avgPh: r.avgPh !== null ? parseFloat(r.avgPh) : undefined,
      avgDo: r.avgDo !== null ? parseFloat(r.avgDo) : undefined,
      avgConductivity:
        r.avgConductivity !== null ? parseFloat(r.avgConductivity) : undefined,
      avgAs: r.avgAs !== null ? parseFloat(r.avgAs) : undefined,
    }));
  }

  async getDailyMeasurements(date: Date, location?: string): Promise<any[]> {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const qb = this.waterRepo
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
      ph: r.pH,
      do: r.dissolvedOxygen,
      conductivity: r.conductivity,
      as: r.arsenic,
    }));
  }
}
