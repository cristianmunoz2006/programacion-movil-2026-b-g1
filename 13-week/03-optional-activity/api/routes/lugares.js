const express = require('express');
const { exigirToken } = require('../auth');
const lugares = require('../data/lugares');

const router = express.Router();

const CATEGORIAS = ['Restaurante', 'Parque', 'Museo', 'Playa', 'Otro'];

// Fecha de hoy (hora local del servidor) en formato AAAA-MM-DD
function hoy() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

// Todas las rutas de /lugares exigen token
router.use(exigirToken);

// GET /lugares - lista todos los lugares
router.get('/', (req, res) => {
  res.json(lugares);
});

// GET /lugares/:id - un lugar puntual
router.get('/:id', (req, res) => {
  const lugar = lugares.find(l => l.id === Number(req.params.id));
  if (!lugar) {
    return res.status(404).json({ error: 'Lugar no encontrado' });
  }
  res.json(lugar);
});

// POST /lugares - guarda un lugar nuevo (la fecha la pone el servidor)
router.post('/', (req, res) => {
  const { nombre, categoria, nota, latitud, longitud } = req.body;

  if (typeof nombre !== 'string' || nombre.trim() === '') {
    return res.status(400).json({ error: "El campo 'nombre' es obligatorio" });
  }
  if (!CATEGORIAS.includes(categoria)) {
    return res.status(400).json({ error: 'La categoría no es válida' });
  }

  // La ubicacion (GPS) es opcional, pero si viene debe ser valida
  const hayUbicacion = latitud !== undefined && latitud !== null;
  if (hayUbicacion) {
    const latitudValida = typeof latitud === 'number' && latitud >= -90 && latitud <= 90;
    const longitudValida = typeof longitud === 'number' && longitud >= -180 && longitud <= 180;
    if (!latitudValida || !longitudValida) {
      return res.status(400).json({ error: 'La ubicación no es válida' });
    }
  }

  const nuevo = {
    id: lugares.length + 1,
    nombre: nombre.trim(),
    categoria,
    nota: typeof nota === 'string' ? nota.trim() : '',
    fecha: hoy(),
    latitud: hayUbicacion ? latitud : null,
    longitud: hayUbicacion ? longitud : null,
  };

  lugares.push(nuevo);
  res.status(201).json(nuevo);
});

module.exports = router;
