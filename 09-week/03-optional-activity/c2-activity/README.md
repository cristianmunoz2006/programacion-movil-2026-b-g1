# Corte 2 · App de Reservas: app Ionic React conectada a su API

**Asignatura:** Programación Móvil

## Descripción

Esta entrega conecta de punta a punta el registro de reservas de citas: una API REST con Express que guarda y entrega las reservas en JSON, y una app Ionic React que las lista, permite crear una nueva desde un formulario y abre cada una en una pantalla de detalle.

La app no tiene datos escritos en el código. Todo lo que muestra lo pide a la API con `fetch`, y si la API no responde, lo avisa en pantalla en vez de quedarse en blanco.

## Estructura

```
corte2-reservas/
├── api/                              -> backend con Node.js + Express
│   ├── package.json
│   ├── server.js                     -> configura y enciende el servidor
│   ├── routes/
│   │   └── reservas.js               -> endpoints GET y POST de /reservas
│   └── data/
│       └── reservas.js               -> datos de prueba en memoria
└── app/                              -> app Ionic React
    └── src/
        ├── App.tsx                   -> rutas: /home y /detalle/:id
        ├── services/
        │   └── reservasApi.ts        -> todas las llamadas fetch a la API
        ├── components/
        │   ├── FormularioReserva.tsx -> formulario para crear una reserva
        │   ├── ListaReservas.tsx     -> lista de reservas
        │   └── MensajeError.tsx      -> mensaje de error con botón "Reintentar"
        └── pages/
            ├── Home.tsx              -> pantalla principal: formulario + lista
            └── Detalle.tsx           -> pantalla de detalle de una reserva
```

Cada carpeta tiene una sola responsabilidad: `routes` recibe las peticiones, `data` guarda la información, `services` es el único lugar de la app donde aparece `fetch`, `components` son piezas reutilizables y `pages` son las pantallas completas.

## Architecture

This project is split into two independent parts: a REST API built with Node.js and Express, and a mobile app built with Ionic React. The API exposes the `Reserva` entity through three endpoints, and every request and response body is JSON. `GET /reservas` returns the full list of bookings with status `200`, and `GET /reservas/:id` returns a single booking, or `404` with an error message if that id does not exist. `POST /reservas` receives a body like `{ "servicio": "...", "fecha": "...", "hora": "..." }`, lets the server assign the `id` and the `estado`, and answers `201` with the new booking; if `servicio` is missing or empty, it answers `400` with an error message instead.

The app never calls `fetch` from its screens directly. All the HTTP calls live in `services/reservasApi.ts`, which offers three functions, one for each endpoint. The Home page calls the list function when it opens and stores the result with `useState`, so React draws the list again whenever that state changes. When the user submits the form, Home sends the new booking to the API and adds the record returned by the server to the list, which means the app always shows exactly what the server saved. Tapping an item navigates to `/detalle/:id`, where the Detail page reads the id from the URL and asks the API for that single booking, and any network or validation error is caught and shown with a retry button instead of crashing the screen.

## Endpoints

| Método | Ruta | Cuerpo (JSON) | Respuesta |
|---|---|---|---|
| GET | `/reservas` | — | `200` con la lista de reservas |
| GET | `/reservas/:id` | — | `200` con una reserva, o `404` con `{ "error": "Reserva no encontrada" }` |
| POST | `/reservas` | `{ "servicio": "...", "fecha": "...", "hora": "..." }` | `201` con la reserva creada |
| POST | `/reservas` sin `servicio` | `{ "servicio": "" }` | `400` con `{ "error": "El campo 'servicio' es obligatorio" }` |

## Manejo de errores

`fetch` solo avisa de un tipo de fallo: cuando no logra conectarse. **No** avisa cuando el servidor responde con un código 400 o 404. Por eso la función `pedir` de `reservasApi.ts` revisa las dos cosas y siempre lanza un error legible, que las pantallas capturan con `try/catch` y muestran con el componente `MensajeError` (con botón de reintentar cuando aplica).

## Cómo ejecutarlo

**1. API** (en una terminal):

```bash
cd api
npm install
npm start
```

Queda corriendo en `http://localhost:3000`.

**2. App** (en otra terminal, con la API encendida):

```bash
cd app
npm install
ionic serve
```

Se abre en `http://localhost:8100`.
