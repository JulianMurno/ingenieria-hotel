require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = bcrypt.hashSync(process.env.SEED_PASSWORD || '123456', 10);

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', password, rol: 'ADMINISTRADOR' },
  });

  await prisma.user.upsert({
    where: { username: 'recepcionista' },
    update: {},
    create: { username: 'recepcionista', password, rol: 'RECEPCIONISTA' },
  });

  console.log('Usuarios sembrados: admin (ADMINISTRADOR) y recepcionista (RECEPCIONISTA)');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
