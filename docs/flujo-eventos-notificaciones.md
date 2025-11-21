# Flujo – Eventos y Notificaciones

## Diagrama

```mermaid
flowchart TD
    A[Sistema interno] -->|POST /eventos/*| B[Eventos registrados]
    B --> C[GET /eventos/*]
    C --> D[PUT/PATCH/DELETE /eventos/{id}]

    B --> E[POST /notificaciones/campanias]
    E --> F[GET /notificaciones/pendientes]
    F --> G[POST /notificaciones/enviar]
    G --> H{Webhook externo?}
    H -- SendGrid --> I[/sendgrid/webhook]
    H -- Twilio --> J[/twilio/webhook]
    I --> K[Actualizar estado notificación]
    J --> K
```

## Endpoints destacados

- `eventos_router.py`: CRUD de eventos de demanda, marcas especiales, etc.
- `notificacion_router.py`: campañas, plantillas, resultados de envío.
- `sendgrid_webhook_router.py`, `twilio_webhook_router.py`: recepción de callbacks externos.

## Tareas programadas

- [ ] Documentar payloads esperados en los webhooks para validar firmas.
- [ ] Centralizar reglas de envío (prioridades, ventanas horarias) en un servicio común.
- [ ] Añadir métricas y alertas ante fallos de procesamiento de webhooks.
