const API_URL = 'http://localhost:3000';

export interface Reserva {
  id: number;
  servicio: string;
  fecha: string;
  hora: string;
  estado: string;
}

// Une las dos formas en que una peticion puede fallar: sin conexion,
// o con el servidor respondiendo un error (400, 404, 500...).
async function pedir<T>(ruta: string, opciones?: RequestInit): Promise<T> {
  let resp: Response;
  try {
    resp = await fetch(`${API_URL}${ruta}`, opciones);
  } catch {
    throw new Error('No se pudo conectar con el servidor');
  }

  const datos = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    throw new Error(datos.error || `Error del servidor (${resp.status})`);
  }
  return datos;
}

export function listarReservas(): Promise<Reserva[]> {
  return pedir<Reserva[]>('/reservas');
}

export function obtenerReserva(id: string): Promise<Reserva> {
  return pedir<Reserva>(`/reservas/${id}`);
}

export function crearReserva(servicio: string, fecha: string, hora: string): Promise<Reserva> {
  return pedir<Reserva>('/reservas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ servicio, fecha, hora }),
  });
}
