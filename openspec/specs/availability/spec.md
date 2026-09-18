# Availability Specification

## Purpose

Permite consultar qué habitaciones del hotel están disponibles para un rango de fechas y un tipo dados, calculando la disponibilidad a partir de las reservas confirmadas y no de un estado fijo de la habitación.

## Requirements

### Requirement: Consulta de disponibilidad
El sistema SHALL permitir consultar las habitaciones disponibles para un rango `[checkIn, checkOut)` y, opcionalmente, filtrar por tipo. Una habitación NO disponible si existe una reserva confirmada que se solapa, es decir, si `reserva.checkIn < checkOut` y `checkIn < reserva.checkOut`. Se permite el recambio el mismo día: `checkOut` igual al `checkIn` de otra reserva no impide la disponibilidad. Un rango inválido (checkIn >= checkOut, fechas ausentes o malformadas) se rechaza con `422`.

#### Scenario: Rango con disponibilidad
- **WHEN** un usuario autenticado consulta `/api/v1/availability?checkIn=...&checkOut=...` sin reservas que solapen el rango
- **THEN** el sistema responde `200` con la lista de habitaciones disponibles en ese rango

#### Scenario: Rango sin disponibilidad
- **WHEN** un usuario autenticado consulta `/api/v1/availability` con un rango totalmente cubierto por reservas confirmadas
- **THEN** el sistema responde `200` con una lista vacía de habitaciones disponibles

#### Scenario: Filtrado por tipo
- **WHEN** un usuario autenticado consulta `/api/v1/availability` indicando un `type`
- **THEN** el sistema devuelve solo las habitaciones disponibles de ese tipo

#### Scenario: Recambio el mismo día
- **WHEN** el `checkIn` consultado coincide con el `checkOut` de una reserva confirmada existente
- **THEN** el sistema considera esa habitación disponible para el nuevo rango

#### Scenario: Rango de fechas inválido
- **WHEN** un usuario autenticado consulta `/api/v1/availability` con `checkIn` igual o posterior a `checkOut`, o con fechas faltantes o malformadas
- **THEN** el sistema responde `422` con un error de validación