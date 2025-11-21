# Flujo – Scoring (Perfiles y Variables)

## Diagrama

```mermaid
flowchart LR
    A[Analista de riesgo] -->|POST /perfiles/| B[Perfil creado]
    B --> C[GET /perfiles/?page=..]
    C --> D[PUT/PATCH /perfiles/{id}]
    D --> E[DELETE /perfiles/{id}]

    A -->|POST /variables/| F[Variable creada]
    F --> G[GET /variables/?page=..]
    G --> H[PUT/PATCH /variables/{id}]
    H --> I[DELETE /variables/{id}]
```

## Endpoints destacados

- `/perfiles/` y `/perfiles/{id}` (POST/GET/PUT/PATCH/DELETE) manejados por casos como `RegistrarPerfil`, `ActualizarPerfil`, `PartialActualizarPerfil`.
- `/variables/` y `/variables/{id}` (mismos verbos) usando `RegistrarVariable`, `PartialActualizarVariable`, etc.

## Tareas programadas

- [ ] Definir versión/estado de cada perfil o variable para mantener historial.
- [ ] Implementar validaciones cruzadas (ej. variables requeridas por un perfil).
- [ ] Incorporar tests automáticos para asegurar que las APIs aceptan sólo campos válidos.
