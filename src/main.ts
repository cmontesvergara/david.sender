import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { requestLoggerMiddleware } from './common/logger/request-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = process.env.ORIGIN?.split(',') || [];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
  });
  app.enableShutdownHooks();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Quita propiedades que no están en el DTO
      forbidNonWhitelisted: true, // Lanza error si se envían campos no permitidos
      transform: true, // Transforma automáticamente los datos entrante
    }),
  );
  app.use(requestLoggerMiddleware);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
