import { Geolocation } from '@capacitor/geolocation';
import type { PermissionStatus } from '@capacitor/geolocation';

export interface Coordenadas {
  latitud: number;
  longitud: number;
}

export type ResultadoUbicacion =
  | { ok: true; coords: Coordenadas }
  | { ok: false; motivo: 'denegado' | 'error' };

// En Android 12+ el usuario puede dar solo ubicacion aproximada: tambien cuenta como permiso.
function concedido(permiso: PermissionStatus): boolean {
  return permiso.location === 'granted' || permiso.coarseLocation === 'granted';
}

export async function obtenerUbicacion(): Promise<ResultadoUbicacion> {
  // 1. Revisar el permiso y, si falta, pedirlo.
  try {
    let permiso = await Geolocation.checkPermissions();
    if (!concedido(permiso)) {
      permiso = await Geolocation.requestPermissions();
    }
    if (!concedido(permiso)) {
      return { ok: false, motivo: 'denegado' };
    }
  } catch {
    // En el navegador "requestPermissions" no existe: se sigue de largo y el cuadro
    // de permiso aparece al pedir la posicion en el paso 2.
  }

  // 2. Pedir la posicion.
  try {
    const posicion = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    });
    return {
      ok: true,
      coords: {
        latitud: posicion.coords.latitude,
        longitud: posicion.coords.longitude,
      },
    };
  } catch (e) {
    const codigo = (e as { code?: number | string }).code;
    // 1 = permiso denegado en el navegador; OS-PLUG-GLOC-0003 = denegado en el celular
    const denegado = codigo === 1 || codigo === 'OS-PLUG-GLOC-0003';
    return { ok: false, motivo: denegado ? 'denegado' : 'error' };
  }
}
