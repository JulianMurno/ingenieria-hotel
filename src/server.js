require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API disponible en http://localhost:${PORT}/api/v1`);
  console.log(`Docs Swagger en http://localhost:${PORT}/api/docs`);
});
