import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AirQualityReadingDto } from '../dto/air-quality-reading.dto';
import { AirQualityResponseDto } from '../dto/air-quality-response.dto';
import { DailyAverageDto } from '../dto/daily-average.dto';
import { plainToInstance } from 'class-transformer';
import { AirQualityMeasurement } from '../entities/air-quality-measurement.entity';
import { AirQualityQueryParamsDto } from '../dto/query-params.dto';

@Injectable()
export class AirQualityService {
  constructor(
    @InjectRepository(AirQualityMeasurement)
    readonly airQualityRepository: Repository<AirQualityMeasurement>,
  ) {}

  async createReading(
    readingDto: AirQualityReadingDto,
  ): Promise<AirQualityResponseDto> {
    const measurement: AirQualityMeasurement = this.airQualityRepository.create(
      {
        sensorId: readingDto.sensorId,
        timestamp: new Date(readingDto.timestamp),
        location: readingDto.location,
        pm25: readingDto.pm25 ?? null,
        pm10: readingDto.pm10 ?? null,
        no2: readingDto.no2 ?? null,
        co: readingDto.co ?? null,
        o2: readingDto.o2 ?? null,
        so2: readingDto.so2 ?? null,
        ch4: readingDto.ch4 ?? null,
        voc: readingDto.voc ?? null,
      },
    );

    const saved: AirQualityMeasurement =
      await this.airQualityRepository.save(measurement);

    return plainToInstance(AirQualityResponseDto, saved);
  }

  async getReadingById(id: string): Promise<AirQualityResponseDto | null> {
    const parsedId = Number(id);
    if (isNaN(parsedId)) {
      return null;
    }

    const reading: AirQualityMeasurement | null =
      await this.airQualityRepository.findOne({
        where: { id: parsedId },
      });

    if (!reading) {
      return null;
    }

    return plainToInstance(AirQualityResponseDto, reading);
  }

  async search(
    query: AirQualityQueryParamsDto,
  ): Promise<AirQualityResponseDto[]> {
    const qb = this.airQualityRepository.createQueryBuilder('reading');

    if (query.sensorId) {
      qb.andWhere('reading.sensorId = :sensorId', { sensorId: query.sensorId });
    }

    if (query.location) {
      qb.andWhere('reading.location = :location', { location: query.location });
    }

    if (query.startDate && query.endDate) {
      const startDate = new Date(query.startDate);
      const endDate = new Date(query.endDate);

      if (startDate.toDateString() === endDate.toDateString()) {
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
      }

      qb.andWhere('reading.timestamp BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    } else if (query.startDate) {
      qb.andWhere('reading.timestamp >= :startDate', {
        startDate: query.startDate,
      });
    } else if (query.endDate) {
      qb.andWhere('reading.timestamp <= :endDate', {
        endDate: query.endDate,
      });
    }

    const results: AirQualityMeasurement[] = await qb
      .orderBy('reading.timestamp', 'ASC')
      .getMany();

    return results.map((reading: AirQualityMeasurement) =>
      plainToInstance(AirQualityResponseDto, reading),
    );
  }

  async getDailyAverages(
    startDate: Date,
    endDate: Date,
    sensorId?: string,
    location?: string,
  ): Promise<DailyAverageDto[]> {
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setHours(23, 59, 59, 999);

    const qb = this.airQualityRepository
      .createQueryBuilder('reading')
      .select('MIN(reading.timestamp)', 'date')
      .addSelect('AVG(reading.pm25)', 'avgPm25')
      .addSelect('AVG(reading.pm10)', 'avgPm10')
      .addSelect('AVG(reading.no2)', 'avgNo2')
      .addSelect('AVG(reading.co)', 'avgCo')
      .addSelect('AVG(reading.o2)', 'avgO2')
      .addSelect('AVG(reading.so2)', 'avgSo2')
      .addSelect('AVG(reading.ch4)', 'avgCh4')
      .addSelect('AVG(reading.voc)', 'avgVoc')
      .where('reading.timestamp BETWEEN :startDate AND :endDate', {
        startDate,
        endDate: adjustedEndDate,
      });

    if (sensorId) {
      qb.andWhere('reading.sensorId = :sensorId', { sensorId });
    }

    if (location) {
      qb.andWhere('reading.location = :location', { location });
    }

    qb.groupBy('DATE(reading.timestamp)').orderBy(
      'MIN(reading.timestamp)',
      'ASC',
    );

    const rawResults = await qb.getRawMany<{
      date: string;
      avgPm25: string | null;
      avgPm10: string | null;
      avgNo2: string | null;
      avgCo: string | null;
      avgO2: string | null;
      avgSo2: string | null;
      avgCh4: string | null;
      avgVoc: string | null;
    }>();

    return rawResults.map((row) => ({
      date: row.date,
      avgPm25: row.avgPm25 !== null ? parseFloat(row.avgPm25) : undefined,
      avgPm10: row.avgPm10 !== null ? parseFloat(row.avgPm10) : undefined,
      avgNo2: row.avgNo2 !== null ? parseFloat(row.avgNo2) : undefined,
      avgCo: row.avgCo !== null ? parseFloat(row.avgCo) : undefined,
      avgO2: row.avgO2 !== null ? parseFloat(row.avgO2) : undefined,
      avgSo2: row.avgSo2 !== null ? parseFloat(row.avgSo2) : undefined,
      avgCh4: row.avgCh4 !== null ? parseFloat(row.avgCh4) : undefined,
      avgVoc: row.avgVoc !== null ? parseFloat(row.avgVoc) : undefined,
    }));
  }

  async getDailyMeasurements(
    date: Date,
    location?: string,
  ): Promise<
    {
      timestamp: Date;
      location: string;
      sensorId: string;
      pm25?: number;
      pm10?: number;
      no2?: number;
      co?: number;
      o2?: number;
      so2?: number;
      ch4?: number;
      voc?: number;
    }[]
  > {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const qb = this.airQualityRepository
      .createQueryBuilder('reading')
      .where('reading.timestamp BETWEEN :startOfDay AND :endOfDay', {
        startOfDay,
        endOfDay,
      });

    if (location) {
      qb.andWhere('reading.location = :location', { location });
    }

    const results = await qb.orderBy('reading.timestamp', 'ASC').getMany();

    return results.map((reading) => ({
      timestamp: reading.timestamp,
      location: reading.location,
      sensorId: reading.sensorId,
      pm25: reading.pm25 ?? undefined,
      pm10: reading.pm10 ?? undefined,
      no2: reading.no2 ?? undefined,
      co: reading.co ?? undefined,
      o2: reading.o2 ?? undefined,
      so2: reading.so2 ?? undefined,
      ch4: reading.ch4 ?? undefined,
      voc: reading.voc ?? undefined,
    }));
  }
}
