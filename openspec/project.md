# project.md — Sistema de Reservas de Hotel

> Contexto y convenciones del proyecto para OpenSpec y para el agente (opencode).
> La verdad funcional vive en `openspec/specs/` y en los `changes/`. Este archivo describe
> **cómo** se construye, no **qué** se construye.

## Stack

- **Lenguaje / runtime:** Node.js (LTS).
- **Framework API:** Express.
- **ORM:** Prisma.
- **Base de datos:** SQLite (archivo local para el MVP; migrable a PostgreSQL sin cambiar el código de negocio).
- **Validación de entrada:** Zod.
- **Autenticación:** JWT (`Authorization: Bearer <token>`); contraseñas con bcrypt.
- **Documentación de API:** OpenAPI + Swagger UI (`/api/docs`).
- **Tests:** Jest + Supertest.
- **Calidad:** ESLint + Prettier.

## Estructura del repositorio

```
.
├── openspec/                 # specs y propuestas de cambio (fuente de la verdad)
├── prisma/
│   ├── schema.prisma         # modelo de datos (Guest, Room, Reservation, User)
│   └── migrations/
├── src/
│   ├── app.js                # configuración de Express
│   ├── server.js             # arranque
│   ├── routes/               # define rutas y las conecta a controllers
│   ├── controllers/          # traduce HTTP <-> servicios (sin lógica de negocio)
│   ├── services/             # lógica de negocio (noches, total, solapamiento)
│   ├── repositories/         # acceso a datos vía Prisma
│   ├── middlewares/          # auth, manejo de errores, validación
│   └── schemas/              # esquemas Zod por recurso
├── tests/                    # unitarios + de integración (Supertest)
├── .github/workflows/ci.yml  # pipeline de CI
└── AGENTS.md                 # instrucciones para opencode (apunta a openspec/)
```

## Convenciones de arquitectura

- **Capas:** `route → controller → service → repository`. La lógica de negocio va **solo**
  en `services/`. Los controllers no calculan ni acceden a la base directo.
- **Regla de disponibilidad:** la disponibilidad se calcula desde `Reservation`
  (reservas `CONFIRMADA` que se solapan), no desde `Room.estado`.
- **Solapamiento:** una reserva ocupa `[checkIn, checkOut)`. Dos reservas se solapan si
  `a.checkIn < b.checkOut && b.checkIn < a.checkOut`. Recambio el mismo día = permitido.
- **Dinero:** enteros en la unidad base de la moneda; nunca `float`.
- **Fechas:** tipo fecha (sin hora) para el cálculo de noches; formato ISO `YYYY-MM-DD`.
- **Concurrencia:** la verificación de disponibilidad y el alta de la reserva ocurren dentro
  de una **transacción** para cumplir RNF03 (integridad).

## Convenciones de API

- Prefijo de versión: `/api/v1`.
- Recursos en plural (`/guests`, `/rooms`, `/reservations`).
- Códigos: `200/201`, `400`, `401`, `403`, `404`, `409` (conflicto: duplicado o solape),
  `422` (validación).
- Formato de error uniforme:
  ```json
  { "error": { "code": "STRING_CODE", "message": "texto", "details": [] } }
  ```
- Toda ruta protegida exige token; las de gestión de habitaciones exigen rol `ADMINISTRADOR`.

## Convenciones de código

- ESLint + Prettier deben pasar sin errores antes de mergear.
- Nombres de archivos en `kebab-case`; clases/servicios en `PascalCase`.
- Cada endpoint nuevo requiere: validación Zod, manejo de error, y al menos un test de integración.

## Testing

- Unitarios para la lógica de `services/` (cálculo de noches, total, detección de solape).
- Integración con Supertest para cada endpoint (camino feliz + al menos un error).
- Los tests corren sobre una base SQLite temporal, aislada por test.

## Flujo de versionado colaborativo (Git)

- Rama `main` protegida; no se hace push directo.
- Una rama por tarea: `feat/<capacidad>-<tarea>` (ej. `feat/reservations-crear`).
- Cada tarea entra por **pull request**; requiere revisión de al menos un compañero y CI en verde.
- Mensajes de commit en formato convencional (`feat:`, `fix:`, `test:`, `docs:`).

## Cómo trabaja opencode aquí

1. Lee las specs en `openspec/specs/` y `openspec/changes/`.
2. Toma la siguiente tarea sin completar de `tasks.md`.
3. La implementa en su propia rama, agrega tests, y abre un PR.
4. El CI valida; recién con CI en verde se mergea.
