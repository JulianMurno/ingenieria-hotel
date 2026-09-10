const prisma = require('../lib/prisma');

function create(data) {
  return prisma.room.create({ data });
}

function findById(id) {
  return prisma.room.findUnique({ where: { id } });
}

function findByNumero(numero) {
  return prisma.room.findUnique({ where: { numero } });
}

function findMany() {
  return prisma.room.findMany({ orderBy: { numero: 'asc' } });
}

function update(id, data) {
  return prisma.room.update({ where: { id }, data });
}

function remove(id) {
  return prisma.room.delete({ where: { id } });
}

module.exports = { create, findById, findByNumero, findMany, update, remove };
