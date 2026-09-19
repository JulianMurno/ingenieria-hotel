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

  test('capacidad inválida responde 422', async () => {
  const res = await request(app)
    .post('/api/v1/rooms')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ numero: '101', tipo: 'SINGLE', tarifa: 5000, capacidad: 0 });

  expect(res.status).toBe(422);
  expect(res.body.error.code).toBe('VALIDATION_ERROR');
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
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].numero).toBe('101');
  });

  test('filtra por tipo', async () => {
  await request(app).post('/api/v1/rooms').set('Authorization', `Bearer ${adminToken}`).send({ numero: '101', tipo: 'SINGLE', tarifa: 5000 });
  await request(app).post('/api/v1/rooms').set('Authorization', `Bearer ${adminToken}`).send({ numero: '102', tipo: 'DOBLE', tarifa: 8000 });

  const res = await request(app)
    .get('/api/v1/rooms')
    .set('Authorization', `Bearer ${adminToken}`)
    .query({ tipo: 'DOBLE' });

  expect(res.status).toBe(200);
  expect(res.body.data).toHaveLength(1);
  expect(res.body.data[0].tipo).toBe('DOBLE');
});

test('filtra por rango de tarifa', async () => {
  await request(app).post('/api/v1/rooms').set('Authorization', `Bearer ${adminToken}`).send({ numero: '101', tipo: 'SINGLE', tarifa: 3000 });
  await request(app).post('/api/v1/rooms').set('Authorization', `Bearer ${adminToken}`).send({ numero: '102', tipo: 'DOBLE', tarifa: 9000 });

  const res = await request(app)
    .get('/api/v1/rooms')
    .set('Authorization', `Bearer ${adminToken}`)
    .query({ tarifaMin: 5000, tarifaMax: 10000 });

  expect(res.status).toBe(200);
  expect(res.body.data).toHaveLength(1);
  expect(res.body.data[0].numero).toBe('102');
});

test('filtra por disponible excluyendo mantenimiento y reservadas', async () => {
  const libre = (await request(app).post('/api/v1/rooms').set('Authorization', `Bearer ${adminToken}`).send({ numero: '101', tipo: 'SINGLE', tarifa: 5000 })).body;
  const mantenimiento = (await request(app).post('/api/v1/rooms').set('Authorization', `Bearer ${adminToken}`).send({ numero: '102', tipo: 'DOBLE', tarifa: 8000 })).body;

  await request(app)
    .patch(`/api/v1/rooms/${mantenimiento.id}`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ estado: 'MANTENIMIENTO' });

  const res = await request(app)
    .get('/api/v1/rooms')
    .set('Authorization', `Bearer ${adminToken}`)
    .query({ disponible: 'true' });

  expect(res.status).toBe(200);
  expect(res.body.data.find((r) => r.id === libre.id)).toBeDefined();
  expect(res.body.data.find((r) => r.id === mantenimiento.id)).toBeUndefined();
});

test('pagina correctamente los resultados', async () => {
  for (let i = 1; i <= 15; i += 1) {
    await request(app)
      .post('/api/v1/rooms')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ numero: `20${i}`, tipo: 'SINGLE', tarifa: 5000 });
  }

  const res = await request(app)
    .get('/api/v1/rooms')
    .set('Authorization', `Bearer ${adminToken}`)
    .query({ page: 2, limit: 10 });

  expect(res.status).toBe(200);
  expect(res.body.data).toHaveLength(5);
  expect(res.body.pagination.page).toBe(2);
  expect(res.body.pagination.total).toBe(15);
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

test('edición por recepcionista responde 403', async () => {
  const created = await request(app)
    .post('/api/v1/rooms')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ numero: '101', tipo: 'SINGLE', tarifa: 5000 });

  const res = await request(app)
    .patch(`/api/v1/rooms/${created.body.id}`)
    .set('Authorization', `Bearer ${recepcionistaToken}`)
    .send({ tarifa: 6500 });

  expect(res.status).toBe(403);
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
