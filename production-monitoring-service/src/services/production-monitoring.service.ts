import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { ProductionMonitoringMeasurement } from '../entities/production-monitoring-measurement.entity';
import { ProductionMonitoringReadingDto } from '../dto/production-monitoring-reading.dto';
import { ProductionMonitoringResponseDto } from '../dto/production-monitoring-response.dto';
import { ProductionMonitoringQueryParamsDto } from '../dto/query-params.dto';
import { ProductionDailyAverageDto } from 'src/dto/daily-average.dto';

@Injectable()
export class ProductionMonitoringService {
  constructor(
    @InjectRepository(ProductionMonitoringMeasurement)
    private readonly productionRepo: Repository<ProductionMonitoringMeasurement>,
  ) {}

  async createReading(
    dto: ProductionMonitoringReadingDto,
  ): Promise<ProductionMonitoringResponseDto> {
    const entity = this.productionRepo.create({
      sensorId: dto.sensorId,
      timestamp: new Date(dto.timestamp),
      location: dto.location,
      extractedMaterial: dto.extractedMaterial ?? null,
      loadsMoved: dto.loadsMoved ?? null,
      machineOperatingHours: dto.machineOperatingHours ?? null,
    });

    const saved = await this.productionRepo.save(entity);
    return plainToInstance(ProductionMonitoringResponseDto, saved);
  }

  async getReadingById(
    id: string,
  ): Promise<ProductionMonitoringResponseDto | null> {
    const parsedId = Number(id);
    if (isNaN(parsedId)) return null;

    const reading = await this.productionRepo.findOne({
      where: { id: parsedId },
    });
    return reading
      ? plainToInstance(ProductionMonitoringResponseDto, reading)
      : null;
  }

  async search(
    query: ProductionMonitoringQueryParamsDto,
  ): Promise<ProductionMonitoringResponseDto[]> {
    const qb = this.productionRepo.createQueryBuilder('reading');

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
    return results.map((r) =>
      plainToInstance(ProductionMonitoringResponseDto, r),
    );
  }

  async getDailyAverages(
    startDate: Date,
    endDate: Date,
    sensorId?: string,
    location?: string,
  ): Promise<ProductionDailyAverageDto[]> {
    const adjustedEnd = new Date(endDate);
    adjustedEnd.setHours(23, 59, 59, 999);

    const qb = this.productionRepo
      .createQueryBuilder('reading')
      .select('DATE(reading.timestamp)', 'date')
      .addSelect('AVG(reading.extractedMaterial)', 'avgExtractedMaterial')
      .addSelect('AVG(reading.loadsMoved)', 'avgLoadsMoved')
      .addSelect(
        'AVG(reading.machineOperatingHours)',
        'avgMachineOperatingHours',
      )
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
      avgExtractedMaterial: string | null;
      avgLoadsMoved: string | null;
      avgMachineOperatingHours: string | null;
    }[] = await qb.getRawMany();

    return raw.map((r) => ({
      date: r.date,
      avgLoadsMoved:
        r.avgLoadsMoved !== null ? parseFloat(r.avgLoadsMoved) : undefined,
      avgMachineOperatingHours:
        r.avgMachineOperatingHours !== null
          ? parseFloat(r.avgMachineOperatingHours)
          : undefined,
      avgExtractedMaterial:
        r.avgExtractedMaterial !== null
          ? parseFloat(r.avgExtractedMaterial)
          : undefined,
    }));
  }

  async getDailyMeasurements(date: Date, location?: string): Promise<any[]> {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const qb = this.productionRepo
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
      extractedMaterial: r.extractedMaterial,
      machineOperatingHours: r.machineOperatingHours,
      loadsMoved: r.loadsMoved,
    }));
  }
}
