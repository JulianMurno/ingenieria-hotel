const request = require('supertest');
const { app, resetDb, tokenFor } = require('../helpers/db');

beforeEach(resetDb);

describe('Huéspedes', () => {
  let token;

  beforeEach(async () => {
    token = await tokenFor('admin');
  });

  test('alta exitosa responde 201', async () => {
    const res = await request(app)
      .post('/api/v1/guests')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Juan Pérez', email: 'juan@example.com', dni: '30123456' });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.dni).toBe('30123456');
  });

  test('DNI duplicado responde 409', async () => {
    await request(app)
      .post('/api/v1/guests')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Juan Pérez', email: 'juan@example.com', dni: '30123456' });

    const res = await request(app)
      .post('/api/v1/guests')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Otro Juan', email: 'otro@example.com', dni: '30123456' });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('CONFLICT');
  });

  test('datos inválidos responden 422', async () => {
    const res = await request(app)
      .post('/api/v1/guests')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: '', email: 'no-es-un-email', dni: '' });

    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.details.length).toBeGreaterThan(0);
  });

  test('listado con filtro por nombre', async () => {
    await request(app)
      .post('/api/v1/guests')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Ana García', email: 'ana@example.com', dni: '30111111' });
    await request(app)
      .post('/api/v1/guests')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Luis López', email: 'luis@example.com', dni: '30222222' });

    const res = await request(app)
      .get('/api/v1/guests')
      .set('Authorization', `Bearer ${token}`)
      .query({ nombre: 'Ana' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].nombre).toBe('Ana García');
  });

  test('detalle de huésped existente responde 200', async () => {
    const created = await request(app)
      .post('/api/v1/guests')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Juan Pérez', email: 'juan@example.com', dni: '30123456' });

    const res = await request(app)
      .get(`/api/v1/guests/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.dni).toBe('30123456');
  });

  test('detalle de huésped inexistente responde 404', async () => {
    const res = await request(app)
      .get('/api/v1/guests/999999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});
