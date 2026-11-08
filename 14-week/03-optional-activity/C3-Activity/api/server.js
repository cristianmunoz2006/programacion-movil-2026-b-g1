const express = require('express');
const cors = require('cors');
const { login } = require('./auth');
const lugaresRoutes = require('./routes/lugares');

const app = express();
app.use(cors());         // permite que la app llame a la API desde otro puerto
app.use(express.json()); // permite leer el cuerpo JSON de las peticiones

app.post('/login', login);              // publica: entrega el token
app.use('/lugares', lugaresRoutes);     // protegida: exige token

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API de Huella Viajera corriendo en http://localhost:${PORT}`);
});
