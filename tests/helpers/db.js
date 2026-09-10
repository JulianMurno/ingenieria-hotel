process.env.DATABASE_URL = 'file:./test.db';

const bcrypt = require('bcryptjs');
const request = require('supertest');

const prisma = require('../../src/lib/prisma');
const app = require('../../src/app');

const TEST_PASSWORD = '123456';

let cachedTokens = {};

async function resetDb() {
  await prisma.reservation.deleteMany();
  await prisma.room.deleteMany();
  await prisma.guest.deleteMany();
  await prisma.user.deleteMany();

  const password = bcrypt.hashSync(TEST_PASSWORD, 10);
  await prisma.user.createMany({
    data: [
      { username: 'admin', password, rol: 'ADMINISTRADOR' },
      { username: 'recepcionista', password, rol: 'RECEPCIONISTA' },
    ],
  });

  cachedTokens = {};
}

async function tokenFor(username) {
  if (cachedTokens[username]) return cachedTokens[username];
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({ username, password: TEST_PASSWORD });
  if (res.status !== 200) {
    throw new Error(`Login de test falló para ${username}: ${res.status}`);
  }
  cachedTokens[username] = res.body.token;
  return cachedTokens[username];
}

function authHeader(username) {
  return tokenFor(username).then((token) => `Bearer ${token}`);
}

module.exports = { app, prisma, resetDb, tokenFor, authHeader, TEST_PASSWORD };
