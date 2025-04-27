import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  // Configurazione del microservizio MQTT per comunicare con i dispositivi IoT
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      url: process.env.MQTT_URL || 'mqtt://localhost:1883',
      clientId: `air-quality-service-${Math.random().toString(16).slice(3)}`,
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
    },
  });

  // Configurazione del microservizio TCP per comunicare con l'API Gateway
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3001,
    },
  });

  // Configurazione validazione DTO globale
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Configurazione Swagger per documentazione API
  const config = new DocumentBuilder()
    .setTitle('Air Quality Monitoring API')
    .setDescription("API per il monitoraggio della qualità dell'aria")
    .setVersion('1.0')
    .addTag('air-quality')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Avvio microservizi
  await app.startAllMicroservices();
  logger.log('Microservizi avviati');

  // Avvio server HTTP
  await app.listen(3001);
  logger.log(`(air-quality) Server HTTP avviato sulla porta 3001`);
}
bootstrap();
