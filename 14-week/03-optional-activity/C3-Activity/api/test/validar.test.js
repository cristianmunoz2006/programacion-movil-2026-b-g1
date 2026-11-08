const test = require('node:test');
const assert = require('node:assert');
const { validarLugar, fechaHoy } = require('../validar');

test('validarLugar rechaza un nombre vacío o solo con espacios', () => {
  // Arrange
  const lugar = { nombre: '   ', categoria: 'Parque' };
  // Act
  const resultado = validarLugar(lugar);
  // Assert
  assert.strictEqual(resultado, "El campo 'nombre' es obligatorio");
});

test('validarLugar acepta un lugar válido, con y sin ubicación', () => {
  const sinUbicacion = { nombre: 'Parque Central', categoria: 'Parque' };
  const conUbicacion = { ...sinUbicacion, latitud: 2.9273, longitud: -75.2819 };

  assert.strictEqual(validarLugar(sinUbicacion), null);
  assert.strictEqual(validarLugar(conUbicacion), null);
});

test('validarLugar rechaza una categoría inexistente y coordenadas fuera de rango', () => {
  const categoriaMala = { nombre: 'Sitio', categoria: 'Discoteca' };
  const latitudMala = { nombre: 'Sitio', categoria: 'Otro', latitud: 120, longitud: 10 };

  assert.strictEqual(validarLugar(categoriaMala), 'La categoría no es válida');
  assert.strictEqual(validarLugar(latitudMala), 'La latitud no es válida');
});

test('fechaHoy da el formato AAAA-MM-DD con ceros a la izquierda', () => {
  const fecha = new Date(2026, 0, 5); // 5 de enero de 2026

  assert.strictEqual(fechaHoy(fecha), '2026-01-05');
});
