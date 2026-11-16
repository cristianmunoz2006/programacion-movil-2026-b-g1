// Funciones puras (sin Express) para poder probarlas con pruebas unitarias.

const CATEGORIAS = ['Restaurante', 'Parque', 'Museo', 'Playa', 'Otro'];

// Devuelve el mensaje de error si el lugar no es valido, o null si esta bien.
function validarLugar(body) {
  const { nombre, categoria, latitud, longitud } = body || {};

  if (typeof nombre !== 'string' || nombre.trim() === '') {
    return "El campo 'nombre' es obligatorio";
  }
  if (!CATEGORIAS.includes(categoria)) {
    return 'La categoría no es válida';
  }

  // La ubicacion es opcional, pero si viene debe venir completa y en rango
  const hayLatitud = latitud !== undefined && latitud !== null;
  const hayLongitud = longitud !== undefined && longitud !== null;
  if (hayLatitud !== hayLongitud) {
    return 'La latitud y la longitud deben venir juntas';
  }
  if (hayLatitud) {
    if (typeof latitud !== 'number' || latitud < -90 || latitud > 90) {
      return 'La latitud no es válida';
    }
    if (typeof longitud !== 'number' || longitud < -180 || longitud > 180) {
      return 'La longitud no es válida';
    }
  }
  return null;
}

// Fecha en formato AAAA-MM-DD (hora local del servidor)
function fechaHoy(fecha = new Date()) {
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

module.exports = { CATEGORIAS, validarLugar, fechaHoy };
