import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('GatewayBootstrap');

  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Environmental Monitoring API Gateway')
    .setDescription(
      'API Gateway for environmental monitoring of mineral deposits',
    )
    .setVersion('1.0')
    .addTag('air-quality')
    .addTag('water-quality')
    .addTag('soil-quality')
    .addTag('production-monitoring')
    .addTag('alarms')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 4000,
    },
  });

  await app.startAllMicroservices();
  logger.log('✅ Microservice listening on port 4000');
  await app.listen(3010);
  logger.log('✅ HTTP Server started on http://localhost:3010');
  logger.log('✅ Swagger available on http://localhost:3010/api-docs');
}
bootstrap();
