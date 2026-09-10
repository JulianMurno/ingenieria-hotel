const request = require('supertest');
const { app, resetDb, tokenFor } = require('../helpers/db');

beforeEach(resetDb);

describe('Auth', () => {
  test('login válido emite un token JWT', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'admin', password: '123456' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.username).toBe('admin');
    expect(res.body.user.rol).toBe('ADMINISTRADOR');
  });

  test('credenciales inválidas responden 401 sin token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'admin', password: 'incorrecta' });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
    expect(res.body.token).toBeUndefined();
  });

  test('ruta protegida sin token responde 401', async () => {
    const res = await request(app).get('/api/v1/rooms');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  test('ruta protegida con token inválido responde 401', async () => {
    const res = await request(app)
      .get('/api/v1/rooms')
      .set('Authorization', 'Bearer token-invalido');
    expect(res.status).toBe(401);
  });

  test('acceso denegado por rol: recepcionista no crea habitaciones (403)', async () => {
    const token = await tokenFor('recepcionista');
    const res = await request(app)
      .post('/api/v1/rooms')
      .set('Authorization', `Bearer ${token}`)
      .send({ numero: '101', tipo: 'SINGLE', tarifa: 5000 });

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  test('administrador sí crea habitaciones', async () => {
    const token = await tokenFor('admin');
    const res = await request(app)
      .post('/api/v1/rooms')
      .set('Authorization', `Bearer ${token}`)
      .send({ numero: '101', tipo: 'SINGLE', tarifa: 5000 });

    expect(res.status).toBe(201);
    expect(res.body.numero).toBe('101');
  });
});
