# Semana 13 — Autenticación con token y conectividad (Huella Viajera)

**App:** Huella Viajera (lugares visitados) · Ionic React + API Express

## Qué se agregó en esta semana

A la app de la Semana 12 (que ya tenía el GPS con permisos) se le agregó:

- **Login con token (JWT):** la app envía correo y clave a `POST /login` y recibe un token.
- **Petición protegida:** todas las rutas de `/lugares` exigen la cabecera `Authorization: Bearer <token>`.
- **Manejo de 401 y de falta de red**, con mensajes claros para el usuario.
- **Servicio centralizado de API:** las pantallas nunca usan `fetch` ni arman el token.

## Flujo

1. El usuario escribe su correo y su clave en la pantalla de login.
2. La app los envía a `POST /login`. Si son correctos, la API responde con un token que dura 1 hora.
3. La app guarda el token en el dispositivo (Capacitor Preferences).
4. En cada petición a `/lugares`, el servicio central agrega `Authorization: Bearer <token>`.
5. La API valida la firma del token en cada petición, sin guardar sesión en el servidor.

**Usuario de prueba** (fijo en la API): `viajero@huella.com` / `1234`.

## Dónde está en el código

| Qué | Archivo |
|---|---|
| Login y token en la API | `api/auth.js` (`login` y `exigirToken`) |
| Rutas protegidas | `api/routes/lugares.js` (`router.use(exigirToken)`) |
| **Servicio centralizado**: URL, token, `fetch` y errores | `app/src/services/lugaresApi.ts` (función `pedir`) |
| Guardar, leer y borrar el token | `app/src/services/sesion.ts` |
| Pantalla de login | `app/src/pages/Login.tsx` |
| Redirigir al login con un aviso | `app/src/hooks/useIrALogin.ts` |

## Cómo se manejan los errores

`pedir()` distingue tres casos con la clase `ErrorApi`:

| Caso | Cómo se detecta | Qué hace la app |
|---|---|---|
| **Sin red** | `fetch` lanza error antes de recibir respuesta | Mensaje "No se pudo conectar con el servidor..." con botón **Reintentar**. La sesión sigue abierta |
| **401** (token inválido o vencido) | La API responde 401 | Borra el token, lleva al login y muestra "Tu sesión venció. Inicia sesión de nuevo." |
| **Error del servidor** (400, 404, 500) | La respuesta no es correcta | Muestra el mensaje que devuelve la API |

Si no hay token guardado, la app ni siquiera llama a la API: va directo al login.

## Cómo ejecutarlo

**API** (terminal 1):

```bash
cd api
npm install
npm start
```

**App** (terminal 2):

```bash
cd app
npm install
npm install @capacitor/core@8.6.0 @capacitor/cli@8.6.0 @capacitor/android@8.6.0 @capacitor/geolocation@8.2.4 @capacitor/preferences@8.0.1
ionic serve
```

Los paquetes de Capacitor se instalan juntos y con la misma versión; si no, npm da un error de dependencias.

## Cómo probar cada caso

| Caso | Cómo probarlo | Resultado esperado |
|---|---|---|
| Login correcto | Entra con `viajero@huella.com` y `1234` | Aparece la lista de lugares |
| Login incorrecto | Escribe una clave equivocada | "Correo o clave incorrectos" |
| Petición protegida | En el navegador abre `http://localhost:3000/lugares` a mano | `{"error":"Falta iniciar sesión"}` (el navegador no envía el token; la app sí) |
| Guardar con sesión | Guarda un lugar nuevo | Aparece en la lista |
| **401** | Apaga la API (`Ctrl + C`) y enciéndela con otro secreto: `$env:JWT_SECRET="otro"; npm start`. Recarga la página | Lleva al login con "Tu sesión venció. Inicia sesión de nuevo." |
| **Sin red** | Apaga la API y recarga | "No se pudo conectar con el servidor..." con "Reintentar"; no cierra la sesión |
| Cerrar sesión | Toca "Salir" | Vuelve al login y borra el token |

Después de la prueba del 401, quita el secreto: `Ctrl + C`, `Remove-Item Env:JWT_SECRET` y `npm start`.

## Notas y límites

- **Almacenamiento del token:** se usa Capacitor Preferences. En un celular guarda en el almacenamiento propio de la app; en el navegador usa `localStorage`, así que ahí no es seguro. Una app publicada debería usar un plugin de almacenamiento cifrado.
- El usuario y la clave de prueba están fijos en el código de la API, y el secreto del token también (se puede cambiar con la variable `JWT_SECRET`). En un proyecto real irían en una base de datos y en variables de entorno.
- Esta semana **no** incluye caché local ni cola de cambios para trabajar sin conexión; solo se detecta la falta de red y se avisa al usuario.

## Entrega

```bash
git add .
git commit -m "Entrega semana 13"
git push
```
