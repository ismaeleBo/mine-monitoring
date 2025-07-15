import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  // Configuring the TCP microservice to communicate with the Gateway API
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 4002,
    },
  });

  // Global DTO validation configuration
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Swagger configuration for API documentation
  const config = new DocumentBuilder()
    .setTitle('Air Quality Monitoring API')
    .setDescription("API for air quality monitoring")
    .setVersion('1.0')
    .addTag('air-quality')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.startAllMicroservices();
  logger.log('Microservices started');

  await app.listen(3002);
  logger.log(`(air-quality) HTTP server running on port 3002`);
}
bootstrap();
