# Procesos existentes

Descripción de los procesos expuestos por la API de `cobranzasApiPy`, con los routers principales y la funcionalidad que cada uno cubre. Úsalo como referencia rápida para frontends u otros servicios.

## 1. Gestión de Instituciones y Clientes

- **Archivo:** `src/infraestructura/controller/institucion_router.py`
- **Objetivos:** CRUD de instituciones, cronogramas y dominios cliente (cuentas, estudiantes, responsables de pago y sus dispositivos).
- **Operaciones:** cada entidad tiene `POST/GET/PUT/PATCH/DELETE` delegando en casos de uso como `RegistrarInstitucion`, `ObtenerCronogramas`, `RegistrarCuenta`, etc., con paginación (`PaginationDep`) donde aplica.

## 2. Calendarios y Programaciones

- **Archivo:** `src/infraestructura/controller/calendario_router.py`
- **Objetivos:** Mantener calendarios de cobranza y catálogos asociados (estados de cuenta, feriados, historial de eventos, riesgos, tipos de deuda/envío/evento, resultados de envío).
- **Operaciones:** CRUD completo para cada sub-entidad mediante casos de uso (`RegistrarCalendario`, `RegistrarFechaFeriada`, etc.) y listados paginados (`PaginationData*`).

## 3. Compromisos y Exoneraciones

- **Archivo:** `src/infraestructura/controller/compromiso_router.py`
- **Objetivos:** Gestionar compromisos/exoneraciones sobre recibos/facturas.
- **Operaciones:** `POST /compromisos`, `GET /compromisos`, `GET /compromisos/{id}`, `PUT/PATCH/DELETE` para actualizar o cerrar disputas usando casos `RegistrarCompromisoExoneracion`, `ActualizarCompromisoExoneracion`, etc. Respuestas normalizadas con `CompromisoExoneracionResponse`.

## 4. Eventos y Notificaciones

- **Archivos:** `eventos_router.py`, `notificacion_router.py`
- **Objetivos:** Registrar y consultar eventos del sistema (demanda, marcas especiales, etc.) y orquestar notificaciones/campañas (reportes de envío, resultados).
- **Operaciones típicas:** CRUD sobre eventos, plantillas, notificaciones pendientes; integración con servicios externos (SendGrid/Twilio tiene routers dedicados `sendgrid_webhook_router.py` y `twilio_webhook_router.py` para callbacks).

## 5. Scoring (Perfiles y Variables)

- **Archivos:** `perfil_router.py`, `variable_router.py`
- **Objetivos:** Administrar catálogos de scoring (perfiles y variables) con soporte para actualizaciones parciales.
- **Operaciones:** `POST/GET/PUT/PATCH/DELETE` sobre `/perfiles/` y `/variables/`, usando casos de uso de `aplicacion/use_case/scoring/...`. Cada endpoint devuelve modelos de dominio `Perfil` o `Variable`.

## 6. Reportes, Scoring y Otros Servicios

- **Archivos:** `reporting_router.py`, `scoring_router.py`, `sendgrid_webhook_router.py`, `twilio_webhook_router.py`
- **Objetivos adicionales:**
  - Reporting: generar/consultar reportes según filtros (consultar archivo para endpoints específicos).
  - Scoring Router: operaciones agregadas de scoring fuera de perfiles/variables específicos.
  - Webhooks: recepción de eventos externos de SendGrid y Twilio para actualizar estados internos (por ejemplo, marca de entregabilidad, confirmación SMS).

---

### Cómo usar este documento

- Para cada nuevo flujo de frontend identifica el proceso correspondiente y usa los endpoints indicados.
- Cross-reference con `register_process.md` para detalles del onboarding por gestores y con `auth_process.md` para las etapas completas de autenticación.
- Mantén este archivo actualizado cuando se agreguen nuevos routers/casos de uso o cambien los existentes.
