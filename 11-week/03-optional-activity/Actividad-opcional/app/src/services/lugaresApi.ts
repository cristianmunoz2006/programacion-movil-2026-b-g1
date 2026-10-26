// Por ahora la app se prueba en el navegador, asi que "localhost" funciona.
// En la semana 12 (celular) esta linea se cambia por la IP del computador.
const IP_DEL_PC = 'localhost';

const API_URL = `http://${IP_DEL_PC}:3000`;

export const CATEGORIAS = ['Restaurante', 'Parque', 'Museo', 'Playa', 'Otro'];

export interface Lugar {
  id: number;
  nombre: string;
  categoria: string;
  nota: string;
  fecha: string;
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

export function listarLugares(): Promise<Lugar[]> {
  return pedir<Lugar[]>('/lugares');
}

export function obtenerLugar(id: string): Promise<Lugar> {
  return pedir<Lugar>(`/lugares/${id}`);
}

export function crearLugar(nombre: string, categoria: string, nota: string): Promise<Lugar> {
  return pedir<Lugar>('/lugares', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, categoria, nota }),
  });
}
