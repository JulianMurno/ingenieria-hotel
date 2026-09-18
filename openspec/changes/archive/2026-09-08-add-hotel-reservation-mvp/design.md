# Design: MVP de sistema de reservas de hotel

## Context

Se construye un sistema nuevo de cero: no existe aún código ni specs en `openspec/specs/`. El stack es Node.js + Express + Prisma + SQLite, con validación Zod, autenticación JWT, docs OpenAPI y tests Jest + Supertest (ver `openspec/project.md`). Las cinco capacidades (auth, guests, rooms, availability, reservations) son nuevas. Ver proposal.md para la motivación.

Las restricciones de negocio que condicionan el diseño:
- La disponibilidad se calcula desde las reservas confirmadas (no de un campo `estado` de la habitación).
- Solapamiento: una reserva ocupa `[checkIn, checkOut)`. Dos reservas se solapan si `a.checkIn < b.checkOut && b.checkIn < a.checkOut`. El recambio el mismo día está permitido.
- Dinero en enteros (unidad base); fechas como tipo fecha ISO `YYYY-MM-DD`.
- Toda la API protegida por JWT; la gestión de habitaciones exige rol `ADMINISTRADOR`.

## Goals / Non-Goals

**Goals:**
- Separación de capas clara (`route → controller → service → repository`) que mantenga la lógica de negocio aislada en `services/` y testable.
- Disponibilidad y creación/modificación de reservas dentro de transacciones para cumplir la integridad (RNF03).
- Error handling uniforme, validación de entrada centralizada y control de roles reutilizable.
- Tests: unitarios para la lógica de negocio e integración (Supertest) por endpoint sobre una base SQLite aislada.

**Non-Goals:**
- Migración a PostgreSQL en este hito (se deja el modelo agnóstico a la DB).
- Reservas en tiempo real, cobros/pagos, gestión de precios dinámicos, multiusuario masivo o frontend.
- Rol de "cliente final" auto-registrado; los usuarios son de personal (recepcionista / administrador).

## Decisions

- **Prisma como ORM con SQLite**: schema único con modelos `User`, `Guest`, `Room`, `Reservation`. Alternativa considerada: raw SQL / Knex → más fricción de migraciones y validación en el código de negocio. El modelo es portable a PostgreSQL.
- **Rol como campo sobre `User`**: `RECEPCIONISTA` y `ADMINISTRADOR`. Middleware único de auth (verifica JWT) + middleware de autorización por rol. Alternativa: JSON Web Token con claims de rol → más débil ante rotación de roles en runtime.
- **Disponibilidad derivada de reservas activas en vez de campo `Room.estado`**: fuente única de verdad, evita estados inconsistentes tras cancelaciones. Coste: consulta de intersección de rangos en cada disponibilidad / creación / modificación (aceptable en el volumen MVP).
- **Transacción Prisma que combina verificación de solape + escritura** para la reserva y su revalidación, mitigando carreras. Alternativa: validar fuera de la transacción → riesgo de doble bookeo.
- **Cálculo de noches/total y solapamiento como funciones puras aisladas en `services/`**: independientes de la DB, cubiertas con tests unitarios, y reutilizadas por creación y modificación.
- **Moneda en enteros**: evita errores de coma flotante; el total se deriva de noches × tarifa por tipo de habitación, normalizado a la unidad base.
- **Formato de error y respuestas documentados en OpenAPI** generado/ajustado contra los endpoints reales del MVP.

## Risks / Trade-offs

- [SQLite bajo concurrencia de escrituras] → El MVP asume bajo volumen; la transacción aísla la reserva. Migración a PostgreSQL sin cambiar lógica de negocio.
- [Recambio el mismo día puede producir solapamiento aparente] → Se modela el intervalo como `[checkIn, checkOut)` y se permite `checkOut == siguiente checkIn`, documentándolo en escenarios de `availability` y `reservations`.
- [JWT en stateless: revocación inmediata limitada] → Para el MVP basta la expiración del token; si se requiere revocación urgente se incorporará una deny-list en `User`.
- [Disponibilidad calculada por consulta puede degradarse con muchas reservas] → Se indexan `checkIn/checkOut` y `Room.type`; aceptable en este hito.

## Migration Plan

- El proyecto se inicializa desde cero: `prisma migrate dev` genera la primera migración sobre SQLite local.
- Seed crea un usuario `RECEPCIONISTA` y uno `ADMINISTRADOR` (contraseñas en variables de entorno, hasheadas con bcrypt).
- Despliegue: build + arranque de `server.js`, con CI (lint + tests + build) en cada PR y `main` protegida con revisión de pares.
- Rollback: al ser un sistema nuevo sin datos de producción previos, el rollback equivale a revertir el commit/PR del hito.

## Open Questions

- Ajuste exacto de tarifas (por tipo de habitación) y moneda destino: no cambia las specs; se define en configuración al implementar.
- Detalle del payload del JWT (claims adicionales más allá de `userId` y `rol`): se resuelve en la implementación de `auth`.