# Flujo – Compromisos y Exoneraciones

## Diagrama

```mermaid
flowchart LR
    A[Agente de cobranzas] -->|POST /compromisos| B[Compromiso creado]
    B --> C[GET /compromisos]
    C --> D[GET /compromisos/{id}]
    D --> E[PUT /compromisos/{id}]
    D --> F[PATCH /compromisos/{id}]
    D --> G[DELETE /compromisos/{id}]
    G --> H{¿Exoneración cerrada?}
    H -- Sí --> I[Actualizar estado en cuenta]
```

## Endpoints destacados

- `/compromisos` (POST, GET) para altas y listados.
- `/compromisos/{id}` (GET, PUT, PATCH, DELETE) para gestión completa usando `CompromisoExoneracionResponse`.

## Tareas programadas

- [ ] Validar reglas de negocio (monto, fechas) antes de permitir PUT/PATCH.
- [ ] Integrar notificaciones automáticas cuando un compromiso cambie de estado.
- [ ] Agregar auditoría de usuario que modifica cada compromiso.
