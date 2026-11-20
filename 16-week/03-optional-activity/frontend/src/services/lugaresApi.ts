import { guardarToken, obtenerToken, borrarToken, limpiarAviso } from './sesion';
import type { Coordenadas } from './ubicacion';

// Para probar en el celular, cambia 'localhost' por la IP de tu computador (ipconfig).
const IP_DEL_PC = 'localhost';

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

// ---------------------------------------------------------------------------
// OPTIMIZACION (semana 14): guardar la lista en memoria para no repetir peticiones.
//   true  = version optimizada (usa la lista guardada)
//   false = version anterior (pide todo a la API cada vez); solo sirve para comparar
// ---------------------------------------------------------------------------
const USAR_CACHE = true;
const VIGENCIA_MS = 60000; // la lista guardada se considera vigente durante 1 minuto

let cacheLista: { datos: Lugar[]; momento: number } | null = null;

// Devuelve la lista guardada si existe y sigue vigente; si no, null.
function listaVigente(): Lugar[] | null {
  if (!USAR_CACHE || !cacheLista) return null;
  if (Date.now() - cacheLista.momento > VIGENCIA_MS) return null;
  return cacheLista.datos;
}

// Los tres tipos de fallo que la app distingue
export type TipoError = 'sin-red' | 'sesion' | 'servidor';

export class ErrorApi extends Error {
  tipo: TipoError;

  constructor(tipo: TipoError, mensaje: string) {
    super(mensaje);
    this.name = 'ErrorApi';
    this.tipo = tipo;
  }
}

export function comoErrorApi(e: unknown): ErrorApi {
  return e instanceof ErrorApi ? e : new ErrorApi('servidor', 'Ocurrió un error inesperado');
}

// Unico lugar de la app donde se usa fetch, se arma la URL y se pone el token.
async function pedir<T>(ruta: string, opciones: RequestInit = {}, conToken = true): Promise<T> {
  const headers: Record<string, string> = { ...(opciones.headers as Record<string, string>) };

  if (conToken) {
    const token = await obtenerToken();
    if (!token) {
      throw new ErrorApi('sesion', 'Inicia sesión para continuar.');
    }
    headers['Authorization'] = `Bearer ${token}`;
  }

  let resp: Response;
  try {
    resp = await fetch(`${API_URL}${ruta}`, { ...opciones, headers });
  } catch {
    // fetch solo lanza error cuando no logra conectarse (sin red o servidor apagado)
    throw new ErrorApi('sin-red', 'No se pudo conectar con el servidor. Revisa tu conexión a internet.');
  }

  const datos = await resp.json().catch(() => ({}));

  // 401: el token es invalido o vencio -> se borra y se avisa
  if (resp.status === 401 && conToken) {
    await borrarToken();
    cacheLista = null; // sin sesion no se deben conservar datos
    throw new ErrorApi('sesion', 'Tu sesión venció. Inicia sesión de nuevo.');
  }
  if (!resp.ok) {
    throw new ErrorApi('servidor', datos.error || `Error del servidor (${resp.status})`);
  }
  return datos;
}

export async function iniciarSesion(correo: string, clave: string): Promise<void> {
  const { token } = await pedir<{ token: string }>(
    '/login',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, clave }),
    },
    false // el login no lleva token
  );
  await guardarToken(token);
  cacheLista = null;
  limpiarAviso();
}

export async function cerrarSesion(): Promise<void> {
  await borrarToken();
  cacheLista = null;
  limpiarAviso();
}

// Pide la lista a la API solo si no hay una guardada y vigente.
export async function listarLugares(): Promise<Lugar[]> {
  const guardada = listaVigente();
  if (guardada) return guardada;

  const datos = await pedir<Lugar[]>('/lugares');
  cacheLista = { datos, momento: Date.now() };
  return datos;
}

// Si el lugar ya esta en la lista guardada, no hace otra peticion.
export async function obtenerLugar(id: string): Promise<Lugar> {
  const guardada = listaVigente();
  const enLista = guardada?.find(l => String(l.id) === id);
  if (enLista) return enLista;

  return pedir<Lugar>(`/lugares/${id}`);
}

export async function crearLugar(
  nombre: string,
  categoria: string,
  nota: string,
  coords?: Coordenadas | null
): Promise<Lugar> {
  const nuevo = await pedir<Lugar>('/lugares', {
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
  cacheLista = null; // hay un lugar nuevo: la lista guardada ya no sirve
  return nuevo;
}
