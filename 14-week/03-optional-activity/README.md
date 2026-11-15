# Semana 14 — Optimización y pruebas (Huella Viajera)

**App:** Huella Viajera (lugares visitados) · Ionic React + API Express

## Qué se hizo

A la app de la Semana 13 (login con token, 401, falta de red y GPS) se le agregó:

1. **Una optimización medida:** evitar peticiones repetidas a la API en la pantalla de la lista.
2. **Pruebas unitarias** de la lógica de validación de la API (4 pruebas, todas pasan).

## La mejora: evitar peticiones repetidas

**Qué pasaba antes.** La pantalla "Lugares visitados" volvía a pedir toda la lista a la API cada vez que aparecía: al abrir la app, al volver desde el detalle de un lugar y al volver de "Nuevo lugar" aunque no se hubiera guardado nada. Además, la pantalla de detalle pedía el lugar a la API aunque ya estaba en la lista.

**Qué se cambió.** En `app/src/services/lugaresApi.ts` la lista se guarda en memoria durante 1 minuto:

- `listarLugares()` devuelve la lista guardada si sigue vigente; si no, la pide a la API.
- `obtenerLugar(id)` busca primero en la lista guardada.
- La lista guardada se descarta al guardar un lugar nuevo, al iniciar o cerrar sesión y cuando la API responde 401.

Las pantallas no cambiaron: la mejora vive en el servicio centralizado.

**Interruptor para comparar.** La constante `USAR_CACHE` (al inicio de `lugaresApi.ts`) vale `true` en la versión optimizada. Con `false` la app se comporta como antes, y así se puede medir el "antes" con el mismo código.

## Cómo se midió

La API imprime una línea en su terminal por cada petición que recibe (`GET /lugares`, `GET /lugares/1`, etc.), y así se cuentan sin ambigüedad (los `OPTIONS` que el navegador envía solos no se cuentan). Para cada medición:

1. Apagar la API (`Ctrl + C`), encenderla (`npm start`) y limpiar la terminal (`Clear-Host`).
2. En el navegador, con la sesión iniciada, abrir `http://localhost:8100/home` y presionar `F5`.
3. Hacer siempre la misma secuencia: abrir "Restaurante La Esquina", volver; abrir "Parque Central", volver; tocar "Nuevo lugar" y volver sin guardar.
4. Contar en la terminal de la API las líneas que empiezan por `GET /lugares`.

Se hizo una vez con `USAR_CACHE = false` (antes) y otra con `USAR_CACHE = true` (después).

## Resultados

| Medición (misma secuencia de navegación) | Antes (`USAR_CACHE = false`) | Después (`USAR_CACHE = true`) |
|---|---|---|
| Peticiones `GET /lugares` (lista) | [completar] | [completar] |
| Peticiones `GET /lugares/<id>` (detalle) | [completar] | [completar] |
| **Total de peticiones a la API** | [completar] | [completar] |

[completar: una o dos frases con la conclusión, por ejemplo cuántas peticiones menos se hicieron.]

**Límites de esta mejora.** La lista guardada puede estar hasta 1 minuto desactualizada, y se pierde al recargar la página. No se midió el tiempo de dibujo de la pantalla, porque con pocos lugares no es un cuello de botella.

## Pruebas unitarias

Están en `api/test/validar.test.js` y prueban funciones puras de `api/validar.js`, con el patrón Arrange-Act-Assert. Se ejecutan con `npm test` dentro de la carpeta `api`.

| Prueba | Qué comprueba | Por qué es útil |
|---|---|---|
| Nombre vacío o solo con espacios | `validarLugar` lo rechaza con el mensaje del campo obligatorio | Evita guardar lugares sin nombre |
| Lugar válido, con y sin ubicación | `validarLugar` lo acepta (devuelve `null`) | La ubicación es opcional y no debe bloquear el guardado |
| Categoría inexistente y coordenadas fuera de rango | `validarLugar` rechaza cada caso con su mensaje | Protege la lista de categorías y los datos del GPS |
| Formato de la fecha | `fechaHoy` devuelve `AAAA-MM-DD` con ceros a la izquierda | Una fecha mal formada rompería el orden y la lectura |

Resultado: 4 pruebas, 4 que pasan.

## Cómo ejecutarlo

**API** (terminal 1):

```bash
cd api
npm install
npm start
```

**Pruebas** (en la carpeta `api`):

```bash
npm test
```

**App** (terminal 2):

```bash
cd app
npm install
npm install @capacitor/core@8.6.0 @capacitor/cli@8.6.0 @capacitor/android@8.6.0 @capacitor/geolocation@8.2.4 @capacitor/preferences@8.0.1
ionic serve
```

Usuario de prueba: `viajero@huella.com` / `1234`.

## Entrega

```bash
git add .
git commit -m "Entrega semana 14"
git push
```
