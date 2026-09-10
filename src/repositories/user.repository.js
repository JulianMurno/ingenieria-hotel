const prisma = require('../lib/prisma');

function findByUsername(username) {
  return prisma.user.findUnique({ where: { username } });
}

function create(data) {
  return prisma.user.create({ data });
}

module.exports = { findByUsername, create };
