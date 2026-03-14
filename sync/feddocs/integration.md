# Título — Notibot Integration

## Consumiendo Notibot
Notibot dispone de una API REST que gestiona peticiones de envío a múltiples canales de forma asíncrona.

## Ejemplos de Integración

Enviar un mensaje simple por WhatsApp:

```typescript
fetch('http://notibot/api/v1/notifications/whatsapp/send/single', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    phone: "1234567890",
    agent: "agent_1",
    payload: { text: "Hola, este es un mensaje!" }
  })
});
```

El endpoint devuelve un `202 Accepted` con un Transaction ID al instante para no truncar la petición, enviándolo en background en segundo plano a Redis.

Para conocer cómo operar el servicio mira la sección de [Operations](./operations.md).
