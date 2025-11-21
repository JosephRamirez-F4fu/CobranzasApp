# Flujos de Login y Registro

## Diagrama de procesos

```mermaid
flowchart TD
    subgraph Gestor
        A[Gestor: Vista LoginGestor]
        B[DashboardGestor]
        C[Vista RegistrarInstitucion]
    end

    subgraph AdminInstitucion
        D[Vista ConfirmarAdmin]
        E[Vista LoginAdmin Tradicional]
        F[Vista LoginAdmin OAuth]
    end

    subgraph UsuarioSSO
        G[Vista LoginSSO]
    end

    A -->|POST /auth/gestor/login| A2{Credenciales válidas?}
    A2 -- No --> A
    A2 -- Sí --> B
    B --> C
    C -->|POST /auth/gestor/instituciones| C2{201 recibido}
    C2 -- Sí --> D
    C2 -- Error --> C

    D -->|POST /auth/instituciones/confirmar| D2{Tokens válidos?}
    D2 -- Sí --> E
    D2 -- No --> D

    E -->|POST /auth/login/admin| E2{Credenciales válidas?}
    E2 -- Sí --> PanelAdmin
    E2 -- No --> E

    F -->|POST /auth/oauth/login| PanelAdmin

    G -->|POST /auth/login| G2{Proveedor permitido?}
    G2 -- Sí --> PanelUsuarioSSO
    G2 -- No --> G
```

## Vistas necesarias

1. **LoginGestor**: formulario email/contraseña con manejo de errores 401/403.
2. **DashboardGestor**: acceso a la acción de registrar instituciones.
3. **RegistrarInstitucion**: formulario para datos de institución y admin inicial; debe mostrar resultado (IDs) tras guardar.
4. **ConfirmarAdmin**: formulario donde el admin ingresa `institucion_id`, tokens y email.
5. **LoginAdmin Tradicional**: email/contraseña para `/auth/login/admin`.
6. **LoginAdmin OAuth**: inicia el flujo OAuth y finaliza en `/auth/oauth/login`.
7. **LoginSSO**: selector de proveedor/domino y email para `/auth/login` orientado a usuarios internos.

Cada vista debe almacenar o limpiar los tokens según el flujo y redirigir a la pantalla adecuada (`PanelGestor`, `PanelAdmin`, `PanelUsuarioSSO`).
