const express = require('express');
const router = express.Router();
const reservas = require('../data/reservas');

// GET /reservas - lista todas las reservas
router.get('/', (req, res) => {
  res.json(reservas);
});

// GET /reservas/:id - una reserva puntual
router.get('/:id', (req, res) => {
  const reserva = reservas.find(r => r.id === Number(req.params.id));
  if (!reserva) {
    return res.status(404).json({ error: 'Reserva no encontrada' });
  }
  res.json(reserva);
});

// POST /reservas - crea una reserva nueva
router.post('/', (req, res) => {
  const { servicio, fecha, hora } = req.body;

  if (typeof servicio !== 'string' || servicio.trim() === '') {
    return res.status(400).json({ error: "El campo 'servicio' es obligatorio" });
  }

  const nueva = {
    id: reservas.length + 1,
    servicio: servicio.trim(),
    fecha: fecha || '',
    hora: hora || '',
    estado: 'confirmada',
  };

  reservas.push(nueva);
  res.status(201).json(nueva);
});

module.exports = router;
