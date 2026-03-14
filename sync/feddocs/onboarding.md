# Título — Notibot Onboarding

## Bienvenida a Notibot
Notibot es un servicio de notificaciones multicanal construido en NestJS. Expone utilidades para enviar mensajes a través de WhatsApp y Telegram, apoyándose en un sistema de colas (Bull/Redis) para asegurar la entrega.

## Estructura
El proyecto sigue principios de Clean Architecture o puertos y adaptadores:
- `src/adapters/in/rest-api/`: Controladores REST, puedes ver endpoints completos en el openapi.
- `src/application/`: Casos de uso de notificaciones.
- `src/infrastructure/`: Servicios de infraestructura como WhatsApp, Telegram, colas.

Conoce más sobre cómo se integran las capas en [Architecture](./architecture.md).
