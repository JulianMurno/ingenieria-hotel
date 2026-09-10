const prisma = require('../lib/prisma');

function create(data) {
  return prisma.guest.create({ data });
}

function findByDni(dni) {
  return prisma.guest.findUnique({ where: { dni } });
}

function findById(id) {
  return prisma.guest.findUnique({ where: { id } });
}

function findMany({ dni, nombre }) {
  return prisma.guest.findMany({
    where: {
      dni: dni ? { contains: dni } : undefined,
      nombre: nombre ? { contains: nombre } : undefined,
    },
    orderBy: { id: 'asc' },
  });
}

module.exports = { create, findByDni, findById, findMany };
