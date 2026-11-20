const express = require('express');
const { exigirToken } = require('../auth');
const { validarLugar, fechaHoy } = require('../validar');
const lugares = require('../data/lugares');

const router = express.Router();

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
  const mensajeError = validarLugar(req.body);
  if (mensajeError) {
    return res.status(400).json({ error: mensajeError });
  }

  const { nombre, categoria, nota, latitud, longitud } = req.body;
  const nuevo = {
    id: lugares.length + 1,
    nombre: nombre.trim(),
    categoria,
    nota: typeof nota === 'string' ? nota.trim() : '',
    fecha: fechaHoy(),
    latitud: latitud ?? null,
    longitud: longitud ?? null,
  };

  lugares.push(nuevo);
  res.status(201).json(nuevo);
});

module.exports = router;
