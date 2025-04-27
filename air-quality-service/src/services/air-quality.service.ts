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

    if (query.startDate) {
      qb.andWhere('reading.timestamp >= :startDate', {
        startDate: query.startDate,
      });
    }

    if (query.endDate) {
      qb.andWhere('reading.timestamp <= :endDate', { endDate: query.endDate });
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
    const qb = this.airQualityRepository
      .createQueryBuilder('reading')
      .select('DATE(reading.timestamp)', 'date')
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
        endDate,
      });

    if (sensorId) {
      qb.andWhere('reading.sensorId = :sensorId', { sensorId });
    }

    if (location) {
      qb.andWhere('reading.location = :location', { location });
    }

    qb.groupBy('DATE(reading.timestamp)').orderBy(
      'DATE(reading.timestamp)',
      'ASC',
    );

    const rawResults: Array<{
      date: string;
      avgPm25: string;
      avgPm10: string;
      avgNo2: string;
      avgCo: string;
      avgO2: string;
      avgSo2: string;
      avgCh4: string;
      avgVoc: string;
    }> = await qb.getRawMany();

    return rawResults.map((result) => ({
      date: result.date,
      avgPm25: parseFloat(result.avgPm25),
      avgPm10: parseFloat(result.avgPm10),
      avgNo2: parseFloat(result.avgNo2),
      avgCo: parseFloat(result.avgCo),
      avgO2: parseFloat(result.avgO2),
      avgSo2: parseFloat(result.avgSo2),
      avgCh4: parseFloat(result.avgCh4),
      avgVoc: parseFloat(result.avgVoc),
    }));
  }
}
