# Proposal: MVP de sistema de reservas de hotel

## Why

El hotel no cuenta con un sistema para gestionar reservas, huéspedes y habitaciones; la operación se maneja de forma manual, lo que genera dobles reservas y errores de disponibilidad. Se necesita un MVP con autenticación por roles, gestión de huéspedes y habitaciones, consulta de disponibilidad y reservas confiables, listo para desplegarse.

## What Changes

- **Autenticación** (nueva): `POST /api/v1/auth/login` con emisión de JWT y seed de usuarios iniciales (recepcionista y administrador).
- **Huéspedes** (nuevo): alta con validación de email y unicidad de DNI, listado con filtros y detalle por id.
- **Habitaciones** (nueva): altas, listado, edición y borrado, con operaciones de escritura restringidas al rol administrador.
- **Disponibilidad** (nueva): consulta de habitaciones disponibles por rango de fechas y tipo, calculada desde las reservas confirmadas.
- **Reservas** (nuevo): creación validando disponibilidad y calculando noches y total dentro de una transacción, listado con filtros y paginación, detalle, modificación con revalidación y cancelación.
- **Infraestructura**: middleware de errores, validación Zod, autenticación/autorización por rol y utilidades de negocio (noches, total, solapamiento) - sin cambios de comportamiento de capacidades existentes.

## Capabilities

### New Capabilities

- `auth`: autenticación de usuarios y emisión de JWT para proteger la API.
- `guests`: gestión de huéspedes (alta, listado con filtros y detalle).
- `rooms`: gestión de habitaciones (alta, listado, edición y borrado con control de roles).
- `availability`: consulta de habitaciones disponibles por rango de fechas y tipo.
- `reservations`: ciclo de vida de reservas (creación, consulta, modificación y cancelación).

### Modified Capabilities

- Ninguna (no existe aún `openspec/specs/`; todas las capacidades son nuevas).

## Impact

- **API nueva** completa bajo `/api/v1`, documentada en OpenAPI + Swagger UI (`/api/docs`).
- **Modelo de datos**: entidades `Guest`, `Room`, `Reservation`, `User` vía Prisma; base SQLite local migrable a PostgreSQL.
- **Dependencias**: Express, Prisma, Zod, JWT (jsonwebtoken + bcrypt), Jest + Supertest, ESLint + Prettier.
- **Convención clave**: la disponibilidad se deriva de las reservas confirmadas y no de un campo de estado sobre la habitación.