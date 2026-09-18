# Auth Specification

## Purpose

Permite que el personal del hotel se autentique con credenciales y reciba un token JWT para acceder a la API protegida, distinguiendo roles de recepcionista y administrador.

## Requirements

### Requirement: Autenticación de usuario
El sistema SHALL permitir a un usuario registrado iniciar sesión enviando sus credenciales y obtener un token JWT (header `Authorization: Bearer <token>`) para consumir la API protegida. Las credenciales se verifican con hash seguro (bcrypt). Se proporciona un usuario de rol `RECEPCIONISTA` y uno de rol `ADMINISTRADOR` sembrados al inicializar el sistema.

#### Scenario: Login exitoso
- **WHEN** un usuario envía credenciales válidas a `/api/v1/auth/login`
- **THEN** el sistema responde `200` con un token JWT que identifica al usuario y su rol

#### Scenario: Credenciales inválidas
- **WHEN** un usuario envía credenciales incorrectas a `/api/v1/auth/login`
- **THEN** el sistema responde `401` con un error y NO emite token

### Requirement: Protección de la API por token
El sistema SHALL rechazar las peticiones a rutas protegidas que no incluyan un token JWT válido en el header `Authorization`.

#### Scenario: Petición sin token
- **WHEN** se llama a una ruta protegida sin header `Authorization`
- **THEN** el sistema responde `401` sin procesar la petición

#### Scenario: Petición con token inválido o vencido
- **WHEN** se llama a una ruta protegida con un token inválido o expirado
- **THEN** el sistema responde `401` y no otorga acceso

### Requirement: Control de acceso por rol
El sistema SHALL verificar el rol del usuario autenticado antes de permitir las operaciones restringidas, denegando las que exijan un rol superior al del usuario.

#### Scenario: Acceso denegado por rol
- **WHEN** un usuario autenticado con rol `RECEPCIONISTA` invoca una operación reservada al rol `ADMINISTRADOR`
- **THEN** el sistema responde `403` con un error de autorización