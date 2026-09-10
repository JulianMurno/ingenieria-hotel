const request = require('supertest');
const { app, resetDb, tokenFor } = require('../helpers/db');

beforeEach(resetDb);

describe('Habitaciones', () => {
  let adminToken;
  let recepcionistaToken;

  beforeEach(async () => {
    adminToken = await tokenFor('admin');
    recepcionistaToken = await tokenFor('recepcionista');
  });

  test('alta por administrador responde 201', async () => {
    const res = await request(app)
      .post('/api/v1/rooms')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ numero: '101', tipo: 'SINGLE', tarifa: 5000 });

    expect(res.status).toBe(201);
    expect(res.body.tipo).toBe('SINGLE');
  });

  test('número duplicado responde 409', async () => {
    await request(app)
      .post('/api/v1/rooms')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ numero: '101', tipo: 'SINGLE', tarifa: 5000 });

    const res = await request(app)
      .post('/api/v1/rooms')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ numero: '101', tipo: 'DOBLE', tarifa: 8000 });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('CONFLICT');
  });

  test('acceso denegado a recepcionista (403)', async () => {
    const res = await request(app)
      .post('/api/v1/rooms')
      .set('Authorization', `Bearer ${recepcionistaToken}`)
      .send({ numero: '101', tipo: 'SINGLE', tarifa: 5000 });

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  test('listado responde 200 con las habitaciones', async () => {
    await request(app)
      .post('/api/v1/rooms')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ numero: '101', tipo: 'SINGLE', tarifa: 5000 });

    const res = await request(app)
      .get('/api/v1/rooms')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].numero).toBe('101');
  });

  test('edición por administrador responde 200', async () => {
    const created = await request(app)
      .post('/api/v1/rooms')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ numero: '101', tipo: 'SINGLE', tarifa: 5000 });

    const res = await request(app)
      .patch(`/api/v1/rooms/${created.body.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ tarifa: 6500 });

    expect(res.status).toBe(200);
    expect(res.body.tarifa).toBe(6500);
  });

  test('edición de habitación inexistente responde 404', async () => {
    const res = await request(app)
      .patch('/api/v1/rooms/999999')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ tarifa: 6500 });

    expect(res.status).toBe(404);
  });

  test('borrado por administrador responde 200', async () => {
    const created = await request(app)
      .post('/api/v1/rooms')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ numero: '101', tipo: 'SINGLE', tarifa: 5000 });

    const res = await request(app)
      .delete(`/api/v1/rooms/${created.body.id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBeDefined();
  });

  test('borrado de habitación inexistente responde 404', async () => {
    const res = await request(app)
      .delete('/api/v1/rooms/999999')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });
});
