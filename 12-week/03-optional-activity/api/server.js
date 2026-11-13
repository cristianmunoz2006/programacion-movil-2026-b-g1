const express = require('express');
const cors = require('cors');
const lugaresRoutes = require('./routes/lugares');

const app = express();
app.use(cors());         // permite que la app (puerto 8100) llame a la API (puerto 3000)
app.use(express.json()); // permite leer el cuerpo JSON de las peticiones

app.use('/lugares', lugaresRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API de Huella Viajera corriendo en http://localhost:${PORT}`);
});
