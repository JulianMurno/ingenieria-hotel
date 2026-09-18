# tasks.md — Implementación del MVP de reservas

> Checklist ordenado para el change `add-hotel-reservation-mvp`. opencode toma la primera
> tarea sin marcar, la implementa en su propia rama con tests y abre un PR. No pasar a la
> siguiente hasta que la anterior esté mergeada con CI en verde.

## 0. Preparación

- [x] Inicializar el proyecto Node + Express y la estructura de carpetas de `project.md`.
- [x] Configurar ESLint, Prettier y Jest.
- [x] Configurar Prisma con SQLite y crear el `schema.prisma` (Guest, Room, Reservation, User).
- [x] Generar la primera migración y el cliente de Prisma.
- [x] Configurar Swagger UI en `/api/docs`.

## 1. Infraestructura transversal

- [x] Middleware de manejo de errores con el formato de error uniforme.
- [x] Middleware de validación con Zod.
- [x] Middleware de autenticación (verificación de JWT) y de autorización por rol.
- [x] Utilidades de negocio: cálculo de noches, cálculo de total, detección de solapamiento (con tests unitarios).

## 2. Autenticación (capacidad: auth)

- [x] `POST /auth/login` con emisión de JWT.
- [x] Seed inicial de un usuario Recepcionista y uno Administrador.
- [x] Tests: login válido, credenciales inválidas, acceso denegado por rol.

## 3. Huéspedes (capacidad: guests)

- [x] `POST /guests` con validación de email y unicidad de DNI.
- [x] `GET /guests` con filtros por DNI y nombre.
- [x] `GET /guests/{id}`.
- [x] Tests: alta exitosa, DNI duplicado (409), datos inválidos (422).

## 4. Habitaciones (capacidad: rooms)

- [x] `POST /rooms` (solo Administrador).
- [x] `GET /rooms`.
- [x] `PATCH /rooms/{id}` y `DELETE /rooms/{id}` (solo Administrador).
- [x] Tests: alta, número duplicado (409), acceso denegado a recepcionista (403).

## 5. Disponibilidad (capacidad: availability)

- [x] `GET /availability?checkIn=&checkOut=&type=` calculando desde las reservas.
- [x] Tests: con disponibilidad, sin disponibilidad (lista vacía), rango inválido (422).

## 6. Reservas (capacidad: reservations)

- [x] `POST /reservations`: valida disponibilidad, calcula noches y total, persiste como CONFIRMADA, dentro de una transacción.
- [x] `GET /reservations` con filtros (DNI, roomId, fecha, estado, guestId) y paginación.
- [x] `GET /reservations/{id}`.
- [x] `PATCH /reservations/{id}`: revalida disponibilidad y recalcula noches y total.
- [x] `POST /reservations/{id}/cancel`: pasa a CANCELADA y libera disponibilidad.
- [x] Tests: reserva exitosa, solape rechazado (409), recambio el mismo día permitido, modificación con conflicto, cancelación.

## 7. Cierre

- [x] Verificar que la doc OpenAPI refleje todos los endpoints.
- [x] README con instrucciones de arranque y de despliegue.
- [x] Confirmar que el pipeline de CI corre lint + tests + build en cada PR.
