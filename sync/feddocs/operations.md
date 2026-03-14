# Título — Notibot Operations

## Comandos y Ejecución
Notibot es una aplicación NestJS que requiere de Redis para el control del encolamiento de mensajes con la librería Bull.

El proyecto define una serie de comandos de utilidad en su `package.json`:

- Arrancar local para desarrollo: `npm run start:dev`
- Arrancar la build compilada en producción: `npm run start:prod`
- Correr migraciones y generar cliente Prisma (usado para bases de datos): `npm run prisma-generate`

## Dependencias Operativas Claves
1. **Redis**: Utiliza `ioredis` y `@nestjs/bull` para persistir la cola de mensajes si los proveedores caen.
2. **WhatsApp**: Se basa en la librería externa Baileys. Las sesiones requieren lectura de códigos QR manual o un front dedicado si la sesión expira.

Consulta nuestras [References](./references.md) para más detalles técnicos sobre estas dependencias.
