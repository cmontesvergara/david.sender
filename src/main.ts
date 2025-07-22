import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { startBaileys } from './whatsapp/baileys.client';
import { WhatsappGateway } from './whatsapp/whatsapp.gateway';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Quita propiedades que no están en el DTO
      forbidNonWhitelisted: true, // Lanza error si se envían campos no permitidos
      transform: true, // Transforma automáticamente los datos entrante
    }),
  );

  const whatsappGateway = app.get(WhatsappGateway);
  await startBaileys(whatsappGateway);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
