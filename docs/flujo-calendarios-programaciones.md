# Flujo – Calendarios y Programaciones

## Diagrama

```mermaid
flowchart TD
    A[Operador Backoffice] -->|POST /calendarios/| B{Creación OK?}
    B -- Sí --> C[GET /calendarios/?page=..]
    C --> D[PUT/PATCH /calendarios/{id}]
    D --> E[DELETE /calendarios/{id}]

    C --> F[POST /estados-cuenta/]
    F --> G[GET /estados-cuenta/]
    G --> H[PATCH/DELETE /estados-cuenta/{id}]

    C --> I[POST /fechas-feriados/]
    I --> J[GET /fechas-feriados/]
    J --> K[PATCH/DELETE /fechas-feriados/{id}]

    C --> L[POST /historial-eventos/]
    L --> M[GET /historial-eventos/]

    C --> N[POST /resultados-envio/], O[POST /riesgos-cliente/], P[POST /tipos-{deuda,envio,evento}/]
```

## Endpoints destacados

- `/calendarios/` + `/calendarios/{id}`: CRUD de programas.
- `/estados-cuenta/`, `/fechas-feriados/`, `/historial-eventos/`, `/resultados-envio/`, `/riesgos-cliente/`, `/tipos-*`: catálogos complementarios.
- Listados paginados mediante `PaginationDep`.

## Tareas programadas

- [ ] Consolidar catálogos (`tipos_*`) en un módulo configurable para evitar repetir endpoints.
- [ ] Añadir validaciones cruzadas (ej. feriados duplicados, solapes de calendarios).
- [ ] Generar dashboards de monitoreo para resultados de envío y riesgos.
