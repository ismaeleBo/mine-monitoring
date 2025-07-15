import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('AlarmService');

  const app = await NestFactory.create(AppModule);

  // ✅ Microservizio TCP per API Gateway
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 4003,
    },
  });

  // ✅ DTO Validation globale
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // ✅ Swagger docs
  const config = new DocumentBuilder()
    .setTitle('Alarm Service API')
    .setDescription('Environmental alarm management service')
    .setVersion('1.0')
    .addTag('alarms')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // ✅ Avvio
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3003);

  logger.log(
    `Alarm Service HTTP listening on port ${process.env.PORT ?? 3003}`,
  );
  logger.log(`Alarm Service TCP microservice running on port 4003`);
}
bootstrap();
