## Purpose

Permite al personal del hotel crear, consultar, modificar y cancelar reservas, garantizando que no se solapen y que los datos financieros y de duración se calculen correctamente a partir de las fechas.

## ADDED Requirements

### Requirement: Creación de reserva con verificación de disponibilidad
El sistema SHALL permitir crear una reserva (habitación, huésped, rango `[checkIn, checkOut)` y estado `CONFIRMADA`) verificando que la habitación esté disponible en el rango. Si existe una reserva confirmada que se solapa, el sistema responde `409`. El cálculo de noches y total se realiza a partir de las fechas y la tarifa de la habitación, y la verificación de disponibilidad con el alta ocurren dentro de una misma transacción.

#### Scenario: Reserva exitosa
- **WHEN** un usuario autenticado envía un rango válido y no conflictivo a `/api/v1/reservations`
- **THEN** el sistema crea la reserva en estado `CONFIRMADA`, calcula noches y total, y responde `201` con el detalle

#### Scenario: Solapamiento rechazado
- **WHEN** el rango solicitado se solapa con una reserva confirmada existente de la misma habitación
- **THEN** el sistema responde `409` con un código de conflicto y no crea la reserva

#### Scenario: Recambio el mismo día permitido
- **WHEN** el `checkIn` de la nueva reserva coincide con el `checkOut` de una reserva confirmada existente de la misma habitación
- **THEN** el sistema crea la reserva correctamente

### Requirement: Validación de la reserva
El sistema SHALL validar los datos de entrada de la reserva (fechas presentes y con `checkIn < checkOut`, huésped y habitación existentes) antes de crearla, respondiendo `422` ante datos inválidos.

#### Scenario: Rango de fechas inválido
- **WHEN** se envía una reserva con `checkIn` igual o posterior a `checkOut`
- **THEN** el sistema responde `422` y no crea la reserva

### Requirement: Listado de reservas con filtros y paginación
El sistema SHALL permitir listar reservas con filtros por DNI del huésped, `roomId`, fecha, estado y `guestId`, soportando paginación.

#### Scenario: Listado con filtros
- **WHEN** un usuario autenticado consulta `/api/v1/reservations` con filtros y paginación
- **THEN** el sistema responde `200` con las reservas coincidentes y los datos de paginación

### Requirement: Consulta de reserva por id
El sistema SHALL permitir obtener una reserva puntual por su id. Si el id no existe, el sistema responde `404`.

#### Scenario: Detalle existente
- **WHEN** un usuario autenticado consulta `/api/v1/reservations/{id}` de una reserva existente
- **THEN** el sistema responde `200` con el detalle de la reserva

#### Scenario: Detalle inexistente
- **WHEN** un usuario autenticado consulta `/api/v1/reservations/{id}` de una reserva que no existe
- **THEN** el sistema responde `404`

### Requirement: Modificación de reserva con revalidación
El sistema SHALL permitir modificar una reserva, recalculando noches y total, y revalidando la disponibilidad de la habitación para el nuevo rango (excluyendo la propia reserva). Un nuevo rango que se solape con otra reserva confirmada se rechaza con `409`. La revalidación y la escritura ocurren dentro de una misma transacción.

#### Scenario: Modificación válida
- **WHEN** un usuario autenticado modifica fechas u otro campo de una reserva sin generar solapamiento
- **THEN** el sistema recalcula noches y total, aplica los cambios y responde con la reserva actualizada

#### Scenario: Modificación con conflicto
- **WHEN** el cambio de rango se solapa con otra reserva confirmada de la misma habitación
- **THEN** el sistema responde `409` y no aplica la modificación

### Requirement: Cancelación de reserva
El sistema SHALL permitir cancelar una reserva, pasándola al estado `CANCELADA` y liberando así el rango para nuevas reservas. Si el id no existe, el sistema responde `404`.

#### Scenario: Cancelación exitosa
- **WHEN** un usuario autenticado cancela `/api/v1/reservations/{id}` de una reserva confirmada
- **THEN** el sistema cambia la reserva a `CANCELADA` responde confirmando la cancelación

#### Scenario: Cancelación de reserva inexistente
- **WHEN** se intenta cancelar una reserva cuyo id no existe
- **THEN** el sistema responde `404`