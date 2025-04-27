import { AirQualityMeasurement } from 'src/entities/air-quality-measurement.entity';
import { Repository } from 'typeorm';

export class AirQualityRepository extends Repository<AirQualityMeasurement> {
  async findLatestBySensorId(
    sensorId: string,
  ): Promise<AirQualityMeasurement | null> {
    return this.createQueryBuilder('reading')
      .where('reading.sensorId = :sensorId', { sensorId })
      .orderBy('reading.timestamp', 'DESC')
      .getOne();
  }

  async findBetweenDates(
    startDate: Date,
    endDate: Date,
    sensorId?: string,
    location?: string,
  ): Promise<AirQualityMeasurement[]> {
    const qb = this.createQueryBuilder('reading').where(
      'reading.timestamp BETWEEN :startDate AND :endDate',
      { startDate, endDate },
    );

    if (sensorId) {
      qb.andWhere('reading.sensorId = :sensorId', { sensorId });
    }

    if (location) {
      qb.andWhere('reading.location = :location', { location });
    }

    return qb.orderBy('reading.timestamp', 'ASC').getMany();
  }
}
