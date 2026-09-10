const { execSync } = require('child_process');

module.exports = () => {
  process.env.DATABASE_URL = 'file:./test.db';
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
};
