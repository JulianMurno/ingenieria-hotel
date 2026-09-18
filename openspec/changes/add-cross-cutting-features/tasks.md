# tasks.md — add-cross-cutting-features

## 1. Modelo de datos

- [ ] 1.1 Crear `Payment { id, reservationId FK, monto Int, metodo, pagadoEn DateTime, createdAt }` y `AuditLog { id, userId FK, accion, recurso, recursoId, detalle String?, createdAt }` en `prisma/schema.prisma`; verificar que `npm run prisma:migrate` y `npm run prisma:generate` corren sin errores.
- [ ] 1.2 Agregar `@@index([pagadoEn])` en `Payment` y `@@index([createdAt])` en `AuditLog`; verificar que la migración los incluye.

## 2. Pagos y factura

- [ ] 2.1 Implementar `POST /reservations/{id}/payments` validando `monto > 0`, método y fecha; verificar tests de pago total (`PAGADA`) y pago parcial (saldo pendiente).
- [ ] 2.2 Derivar en el detalle de la reserva el estado de pago (`PENDIENTE`/`PARCIAL`/`PAGADA`) y el saldo; verificar test con sumas de pagos.
- [ ] 2.3 Implementar `GET /reservations/{id}/invoices` generando la factura a partir de noches, tarifa, total y pagos; verificar tests `200` y `404` para reserva inexistente.

## 3. Reportes

- [ ] 3.1 Implementar `GET /reports/ocupacion` con rango de fechas (noches ocupadas y porcentaje); verificar tests `200` y `422` para rango inválido.
- [ ] 3.2 Implementar `GET /reports/ingresos` sumando pagos por `pagadoEn` en el rango; verificar test `200`.
- [ ] 3.3 Implementar `GET /reports/reservas-por-tipo` con desglose por tipo de habitación; verificar test `200`.
- [ ] 3.4 Contar solo reservas en estados vigentes (`CONFIRMADA`/`EN_CURSO`/`FINALIZADA`) en los reportes; verificar test de tolerancia a estados del ciclo de vida.

## 4. Salud y auditoría

- [ ] 4.1 Implementar `GET /health` público que verifique la base con `SELECT 1`; verificar test `200` y simulación de base caída con `503`.
- [ ] 4.2 Implementar el helper `audit()` y llamarlo en operaciones sensibles (crear/modificar/cancelar reservas y gestionar habitaciones/usuarios); verificar test que registra autor, acción, recurso y fecha.
- [ ] 4.3 Implementar `GET /audit` (solo `ADMINISTRADOR`) con filtros por usuario/acción/rango y paginación; verificar tests `200` y `403` a recepcionista.

## 5. Cierre

- [ ] 5.1 Documentar en `src/docs/index.js` los módulos de pagos, reportes, salud y auditoría; verificar que `/api/docs` los refleja.
- [ ] 5.2 Actualizar README; verificar que `npm run lint`, `npm test` y `npm run build` corren en verde.