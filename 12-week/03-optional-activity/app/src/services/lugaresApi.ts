import type { Coordenadas } from './ubicacion';

// Para probar en el celular, cambia 'localhost' por la IP de tu computador (ipconfig).
const IP_DEL_PC = '192.168.101.11';

const API_URL = `http://${IP_DEL_PC}:3000`;

export const CATEGORIAS = ['Restaurante', 'Parque', 'Museo', 'Playa', 'Otro'];

export interface Lugar {
  id: number;
  nombre: string;
  categoria: string;
  nota: string;
  fecha: string;
  latitud?: number | null;
  longitud?: number | null;
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

export function crearLugar(
  nombre: string,
  categoria: string,
  nota: string,
  coords?: Coordenadas | null
): Promise<Lugar> {
  return pedir<Lugar>('/lugares', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre,
      categoria,
      nota,
      latitud: coords?.latitud,
      longitud: coords?.longitud,
    }),
  });
}
