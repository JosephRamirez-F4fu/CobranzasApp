# Flujo – Gestión de Instituciones y Clientes

## Diagrama

```mermaid
flowchart LR
    A[Gestor/Admin Backend] -->|POST /instituciones/| B{Institución creada?}
    B -- Sí --> C[GET /instituciones/]
    C --> D[PUT/PATCH /instituciones/{id}]
    B -- No --> A

    C --> E[POST /instituciones/{id}/cronogramas]
    E --> F[GET /instituciones/{id}/cronogramas]
    F --> G[PUT/PATCH/DELETE /cronogramas/{id}]

    C --> H[POST /instituciones/{id}/responsables]
    H --> I[POST /responsables/{id}/dispositivos]
    H --> J[POST /responsables/{id}/cuentas]
    J --> K[POST /cuentas/{id}/estudiantes]
    K --> L[PUT/PATCH/DELETE sobre cada recurso]
```

## Endpoints destacados

- `/instituciones/` (POST, GET paginado).
- `/instituciones/{id}` (GET, PUT, PATCH, DELETE).
- `/instituciones/{id}/cronogramas`, `/cronogramas/{id}` para planes de cobranza.
- `/responsables/`, `/responsables/{id}/dispositivos`, `/cuentas/`, `/estudiantes/` para dominios cliente.

## Tareas programadas

- [ ] Persistir `gestor_id` responsable por institución para auditoría.
- [ ] Automatizar pruebas end-to-end que creen instituciones y clientes asociados.
- [ ] Documentar contratos de API en OpenAPI y sincronizarlos con el frontend.
