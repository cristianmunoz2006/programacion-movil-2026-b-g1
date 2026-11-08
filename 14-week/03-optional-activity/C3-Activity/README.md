# Semana 14 — App con hardware y conectividad (Huella Viajera)

**App:** Huella Viajera (lugares visitados) · Ionic React + API Express

## Qué incluye

| Requisito de la actividad | Dónde está |
|---|---|
| Plugin de Capacitor (GPS) con permisos | `app/src/services/ubicacion.ts` y el botón "Usar mi ubicación" de `FormularioLugar.tsx` |
| Login por token y petición protegida | `POST /login` y todas las rutas `/lugares` (`api/auth.js`, `api/routes/lugares.js`); en la app, `Login.tsx` |
| Manejo de 401 y de falta de red | `pedir()` en `app/src/services/lugaresApi.ts` (servicio centralizado) |
| UX: navegación clara y tres estados | `Home.tsx`: cargando, datos, error y vacío; navegación tipo stack |
| 1 prueba unitaria | `api/test/validar.test.js` (4 pruebas, se ejecutan con `npm test`) |
| README "Quality & connectivity" (EN) | al final de este archivo |

## Cómo funciona

- **Usuario de prueba:** `viajero@huella.com` / `1234` (fijo en la API, suficiente para esta actividad).
- `POST /login` devuelve un token (JWT) que dura 1 hora.
- `GET /lugares`, `GET /lugares/:id` y `POST /lugares` exigen la cabecera `Authorization: Bearer <token>`. Sin token o con uno inválido o vencido responden **401**.
- La app guarda el token con Capacitor Preferences y lo envía desde un solo lugar, la función `pedir()` de `lugaresApi.ts`. Las pantallas nunca usan `fetch` directamente.
- Si llega un 401, la app borra el token, lleva al login y explica que la sesión venció. Si no hay red, muestra un mensaje con el botón "Reintentar" y **no** cierra la sesión.
- "Usar mi ubicación" revisa el permiso, lo pide si falta y muestra latitud y longitud. Si el usuario lo niega, aparece un mensaje y aun así puede guardar el lugar sin ubicación.

## Cómo ejecutarlo

**API** (terminal 1):

```bash
cd api
npm install
npm start
```

**Pruebas unitarias** (en la carpeta `api`):

```bash
npm test
```

**App** (terminal 2):

```bash
cd app
npm install
ionic serve
```

Se abre en `http://localhost:8100`.

## Cómo probar cada caso

| Caso | Cómo probarlo | Resultado esperado |
|---|---|---|
| Login correcto | Entra con `viajero@huella.com` y `1234` | Aparece la lista de lugares |
| Login incorrecto | Escribe una clave equivocada | Mensaje "Correo o clave incorrectos" |
| Petición protegida | Con sesión iniciada, guarda un lugar nuevo | Aparece en la lista, con la fecha de hoy |
| **401** | Apaga la API (`Ctrl + C`) y enciéndela con otro secreto: `$env:JWT_SECRET="otro"; npm start`. Recarga la página | Lleva al login con el aviso "Tu sesión venció. Inicia sesión de nuevo." |
| **Sin red** | Apaga la API y recarga | Mensaje "No se pudo conectar con el servidor..." con botón "Reintentar" |
| Permiso concedido | En "Nuevo lugar" toca "Usar mi ubicación" y acepta | Se muestran latitud y longitud |
| Permiso denegado | Toca el botón y elige "Bloquear" o "No permitir" | Mensaje rojo; el lugar se puede guardar sin ubicación |

Para repetir la prueba del permiso en el navegador: clic en el candado junto a la dirección, restablece el permiso de ubicación y recarga.

## Prueba unitaria

`api/test/validar.test.js` prueba las dos funciones puras de la API (`api/validar.js`) con el patrón Arrange-Act-Assert:

1. Rechaza un nombre vacío o solo con espacios.
2. Acepta un lugar válido, con y sin ubicación.
3. Rechaza una categoría inexistente y coordenadas fuera de rango.
4. `fechaHoy` da el formato `AAAA-MM-DD` con ceros a la izquierda.

Resultado: 4 pruebas, todas pasan con `npm test`.

## Quality & connectivity

The app asks for the location permission only when the user taps "Usar mi ubicación": it first checks the current status and requests the permission only if it has not been granted yet. If the user denies it, the app shows a clear message and still lets the user save the place without coordinates, so a denied permission never blocks the main feature. The login sends the email and password to `POST /login` and receives a JWT, which the app stores with Capacitor Preferences and attaches as an `Authorization: Bearer` header from a single central API service. Every route under `/lugares` is protected, so a missing, invalid or expired token produces a 401 response; in that case the app deletes the token, explains that the session expired and sends the user back to the login screen. A network failure is handled differently, because `fetch` throws before receiving any response: the app shows a "could not connect" message with a Retry button and keeps the session open. Other server errors, such as a 400 for a place without a name, show the message returned by the API. One limitation is that Capacitor Preferences is not encrypted storage (and it falls back to localStorage in the browser), so a production app should use a dedicated secure storage plugin.

## Entrega

```bash
git add .
git commit -m "Entrega semana 14"
git push
```
