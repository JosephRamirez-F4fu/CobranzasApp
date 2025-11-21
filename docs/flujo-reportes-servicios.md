# Flujo – Reportes y Servicios Complementarios

## Diagrama

```mermaid
flowchart TD
    A[Usuario interno] -->|GET /reportes/*| B[Generar reporte]
    B --> C[Descarga/Visualización]

    A -->|POST /scoring/calcular| D[Procesos agregados de scoring]
    D --> E[Respuesta con resultados]

    Sistemas externos -->|Webhook SendGrid/Twilio| F[Webhooks procesados]
    F --> G[Actualizar métricas/reportes]
```

## Endpoints destacados

- `reporting_router.py`: consultas y generación de reportes (endpoints específicos según archivo).
- `scoring_router.py`: operaciones agregadas (ej. recalcular scoring global).
- Webhooks (`sendgrid_webhook_router.py`, `twilio_webhook_router.py`) se integran con módulos de notificación/reporting.

## Tareas programadas

- [ ] Exponer documentación detallada de parámetros de filtros para reportes.
- [ ] Automatizar envío programado de reportes clave (corridas nocturnas).
- [ ] Consolidar métricas de webhooks en dashboards de observabilidad.
