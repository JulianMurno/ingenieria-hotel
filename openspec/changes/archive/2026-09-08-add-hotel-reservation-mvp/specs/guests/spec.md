## Purpose

Permite al personal del hotel registrar y consultar los huéspedes, garantizando la unicidad del DNI y la validez del email y dando soporte a los datos utilizados por las reservas.

## ADDED Requirements

### Requirement: Alta de huésped
El sistema SHALL permitir registrar un huésped con sus datos personales, validando el formato del email y la unicidad del DNI. El DNI duplicado se rechaza con conflicto.

#### Scenario: Alta exitosa
- **WHEN** un usuario autenticado envía datos válidos de un huésped a `/api/v1/guests`
- **THEN** el sistema crea el huésped y responde `201` con sus datos

#### Scenario: DNI duplicado
- **WHEN** se intenta registrar un huésped con un DNI ya existente
- **THEN** el sistema responde `409` con un código de conflicto y no crea el huésped

#### Scenario: Datos inválidos
- **WHEN** se envían datos inválidos (p. ej. email malformado o campos obligatorios faltantes)
- **THEN** el sistema responde `422` con el detalle de la validación y no crea el huésped

### Requirement: Listado de huéspedes con filtros
El sistema SHALL permitir consultar el listado de huéspedes, con filtros por DNI y por nombre, devolviendo los resultados coincidentes.

#### Scenario: Listado con filtros
- **WHEN** un usuario autenticado consulta `/api/v1/guests` con filtros de DNI y/o nombre
- **THEN** el sistema responde `200` con los huéspedes que coinciden con los filtros

### Requirement: Consulta de huésped por id
El sistema SHALL permitir obtener un huésped puntual por su id. Si el id no existe, el sistema responde `404`.

#### Scenario: Detalle existente
- **WHEN** un usuario autenticado consulta `/api/v1/guests/{id}` de un huésped existente
- **THEN** el sistema responde `200` con los datos del huésped

#### Scenario: Detalle inexistente
- **WHEN** un usuario autenticado consulta `/api/v1/guests/{id}` de un huésped que no existe
- **THEN** el sistema responde `404` con un error de recurso no encontrado