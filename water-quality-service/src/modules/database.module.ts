import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WaterQualityMeasurement } from 'src/entities/water-quality-measurement.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT', '5432'), 10),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [WaterQualityMeasurement],
        synchronize: true,
        // Enable for production DB
        // ssl: {
        //   rejectUnauthorized: false,
        // },
      }),
    }),
    TypeOrmModule.forFeature([WaterQualityMeasurement]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
