import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { requestLoggerMiddleware } from './common/logger/request-logger';
import { NextFunction, Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((req: Request, res: Response, next: NextFunction) => {
    const allowedOrigins = process.env.ORIGIN?.split(',').map((o) => o.trim());

    // Si no hay ORIGIN definida en entorno, bloquea todo
    if (!allowedOrigins || allowedOrigins.length === 0) {
      return res
        .status(403)
        .json({ error: 'Access blocked: ORIGIN not defined' });
    }

    const origin = req.headers.origin;
    const host = req.headers.host;

    // Permitir solo si Origin o Host están explícitamente autorizados
    const isAllowed =
      (origin && allowedOrigins.includes(origin)) ||
      (host && allowedOrigins.includes(`http://${host}`)) ||
      (host && allowedOrigins.includes(`https://${host}`));

    if (!isAllowed) {
      return res
        .status(403)
        .json({ error: 'Access blocked: origin or host not allowed' });
    }

    next();
  });

  // Habilitar CORS solo si ORIGIN existe
  if (process.env.ORIGIN) {
    app.enableCors({
      origin: process.env.ORIGIN.split(','),
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
    });
  }
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
