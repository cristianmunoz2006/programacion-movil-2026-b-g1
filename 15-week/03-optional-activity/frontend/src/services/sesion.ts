import { Preferences } from '@capacitor/preferences';

const CLAVE_TOKEN = 'token';

// El token se guarda con Capacitor Preferences: en el celular usa el almacenamiento
// propio de la app (no el localStorage del navegador).
export async function guardarToken(token: string): Promise<void> {
  await Preferences.set({ key: CLAVE_TOKEN, value: token });
}

export async function obtenerToken(): Promise<string | null> {
  const { value } = await Preferences.get({ key: CLAVE_TOKEN });
  return value;
}

export async function borrarToken(): Promise<void> {
  await Preferences.remove({ key: CLAVE_TOKEN });
}

// Mensaje que se muestra en la pantalla de login cuando la app manda al usuario
// ahi (por ejemplo, "Tu sesion vencio").
let avisoLogin = '';

export function guardarAviso(mensaje: string): void {
  avisoLogin = mensaje;
}

export function leerAviso(): string {
  return avisoLogin;
}

export function limpiarAviso(): void {
  avisoLogin = '';
}
