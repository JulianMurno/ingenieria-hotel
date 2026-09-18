## Purpose

Permite al personal administrador gestionar el catálogo de habitaciones del hotel (alta, listado, edición y borrado), manteniéndolo como referencia para la disponibilidad y las reservas.

## ADDED Requirements

### Requirement: Alta de habitación restringida
El sistema SHALL permitir registrar una habitación (número, tipo y tarifa) únicamente a un usuario con rol `ADMINISTRADOR`. Un número de habitación duplicado se rechaza con conflicto.

#### Scenario: Alta autorizada
- **WHEN** un usuario con rol `ADMINISTRADOR` envía datos válidos a `/api/v1/rooms`
- **THEN** el sistema crea la habitación y responde `201` con sus datos

#### Scenario: Número duplicado
- **WHEN** se intenta registrar una habitación con un número ya existente
- **THEN** el sistema responde `409` con un código de conflicto y no crea la habitación

#### Scenario: Acceso denegado a recepcionista
- **WHEN** un usuario con rol `RECEPCIONISTA` intenta registrar una habitación
- **THEN** el sistema responde `403` y no crea la habitación

### Requirement: Listado de habitaciones
El sistema SHALL permitir consultar el listado de habitaciones del hotel.

#### Scenario: Listado exitoso
- **WHEN** un usuario autenticado consulta `/api/v1/rooms`
- **THEN** el sistema responde `200` con las habitaciones del hotel

### Requirement: Edición de habitación restringida
El sistema SHALL permitir modificar una habitación (p. ej. tipo o tarifa) únicamente a un usuario con rol `ADMINISTRADOR`. Si la habitación no existe, el sistema responde `404`.

#### Scenario: Edición autorizada
- **WHEN** un usuario con rol `ADMINISTRADOR` actualiza `/api/v1/rooms/{id}` de una habitación existente
- **THEN** el sistema aplica los cambios y responde con los datos actualizados

#### Scenario: Edición inexistente
- **WHEN** se intenta modificar una habitación cuyo id no existe
- **THEN** el sistema responde `404`

### Requirement: Borrado de habitación restringido
El sistema SHALL permitir eliminar una habitación únicamente a un usuario con rol `ADMINISTRADOR`. Si la habitación no existe, el sistema responde `404`.

#### Scenario: Borrado autorizado
- **WHEN** un usuario con rol `ADMINISTRADOR` elimina `/api/v1/rooms/{id}` de una habitación existente
- **THEN** el sistema elimina la habitación y responde confirmando la eliminación

#### Scenario: Borrado inexistente
- **WHEN** se intenta eliminar una habitación cuyo id no existe
- **THEN** el sistema responde `404`