import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurazione CORS
  app.enableCors();

  // Configurazione validazione DTO globale
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Configurazione Swagger
  const config = new DocumentBuilder()
    .setTitle('Environmental Monitoring API Gateway')
    .setDescription(
      'API Gateway for environmental monitoring of mineral deposits',
    )
    .setVersion('1.0')
    .addTag('air-quality')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
  console.log(`API Gateway running on port 3000`);
}
bootstrap();
