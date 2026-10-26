# Semana 11 — Rediseño UX de una pantalla (Huella Viajera)

**App:** Huella Viajera (lugares visitados)
**Pantalla rediseñada:** la pantalla inicial, "Lugares visitados" (`Home`).

## 1. Qué problemas tenía la pantalla (antes)

La versión original (la de las Semanas 9 y 10) está conservada en `app/src/pages/HomeAntes.tsx` y se ve en `http://localhost:8100/antes`.

- El **formulario y la lista estaban en la misma pantalla**, compitiendo por la atención: no era claro qué era lo principal.
- Mientras cargaba solo se veía un **circulito sin texto**.
- Si no había lugares, la pantalla quedaba **en blanco** (sin estado vacío).
- El mensaje de error era rojo claro de **bajo contraste** y el botón "Reintentar" era **pequeño**.

## 2. Jerarquía visual y navegación (después)

**Jerarquía:** la pantalla ahora tiene **una sola acción principal**: el botón grande **"Nuevo lugar"**, fijo en la parte inferior. La lista de lugares es el contenido principal y el formulario se movió a su propia pantalla.

**Patrón de navegación: Stack** (pantallas apiladas con botón "atrás"):

```
Lugares visitados (Home) ──[Nuevo lugar]──▶ Nuevo lugar ──(guardar o atrás)──▶ Lugares visitados
        │
        └──[tocar un lugar]──▶ Detalle del lugar ──(atrás)──▶ Lugares visitados
```

Al volver de "Nuevo lugar", la lista se recarga sola y muestra el lugar nuevo.

## 3. Los estados de la pantalla

| Estado | Qué se ve | Cómo provocarlo para la captura |
|---|---|---|
| **Cargando** | Círculo + texto "Cargando lugares..." | En DevTools (F12) → pestaña Network → elige "Slow 4G" y recarga la página |
| **Con datos** | Lista de lugares (nombre, categoría y fecha) | Con la API encendida y sus 5 lugares de ejemplo |
| **Error** | Mensaje rojo + botón "Reintentar" | Apaga la API (Ctrl+C en su terminal) y recarga |
| **Vacío** | "Aún no has guardado lugares" + indicación | En `api/data/lugares.js` deja temporalmente la lista vacía (`let lugares = [];`), reinicia la API y recarga. Luego devuelve los datos |

## 4. Accesibilidad: antes / después

| Aspecto | Antes | Después |
|---|---|---|
| Contraste del texto de error sobre blanco | **3,81 : 1** (rojo por defecto de Ionic, no cumple el mínimo de 4,5 : 1) | **7,33 : 1** (`#b00020`) |
| Contraste del texto secundario de la lista | Gris por defecto de Ionic (sin medir) | **8,45 : 1** (`#4d4d4d`) |
| Contraste del texto blanco sobre el botón principal | Azul por defecto de Ionic (sin medir) | **6,39 : 1** (azul `#0b57d0`) |
| Tamaño táctil del botón "Reintentar" | Botón `small`, de unos 28 px de alto | Mínimo **48 px** de alto |
| Tamaño táctil del botón principal | Botón "Guardar lugar" estándar, de unos 40 px | Botón `large`, ancho completo, mínimo **48 px** |
| Filas de la lista | Altura por defecto | Mínimo **56 px** |
| Estado de carga | Solo el circulito | Circulito + texto, anunciado con `role="status"` |
| Mensaje de error | Texto suelto | `role="alert"` (el lector de pantalla lo anuncia de inmediato) |
| Estado vacío | No existía (pantalla en blanco) | Mensaje que explica qué hacer |

Los contrastes se calcularon con la fórmula de WCAG (mínimo AA: 4,5 : 1 para texto normal). Para verificar cualquier color en el navegador: F12 → inspeccionar el elemento → clic en el cuadro de color de la propiedad `color`: DevTools muestra la razón de contraste. Las alturas de los botones también se ven ahí, en la pestaña "Computed".

> Nota: el tema de colores es global, así que en la captura de `/antes` los botones se ven con el azul nuevo. Lo que cambia entre antes y después es la estructura, los estados, el tamaño de los botones y los colores de texto medidos arriba.

## 5. Capturas

Guárdalas en `capturas/` con estos nombres:

| Archivo | Qué debe mostrar |
|---|---|
| `01-antes.png` | La pantalla original (`/antes`) con formulario y lista juntos |
| `02-despues-datos.png` | La pantalla nueva con la lista y el botón "Nuevo lugar" |
| `03-despues-cargando.png` | Estado cargando |
| `04-despues-error.png` | Estado error |
| `05-despues-vacio.png` | Estado vacío |
| `06-nuevo-lugar.png` | La pantalla del formulario |

![Antes](capturas/01-antes.png)
![Después - datos](capturas/02-despues-datos.png)
![Después - cargando](capturas/03-despues-cargando.png)
![Después - error](capturas/04-despues-error.png)
![Después - vacío](capturas/05-despues-vacio.png)
![Nuevo lugar](capturas/06-nuevo-lugar.png)

## 6. Cómo ejecutarlo

Necesitas Node.js e Ionic CLI (`npm install -g @ionic/cli`).

> El código está escrito para **Ionic React 9 con React Router 6** (la versión que instala `ionic start` hoy): las rutas usan `element`, `Navigate` y `useIonRouter`.

**Crear el proyecto** (PowerShell, dentro de la carpeta de esta entrega):

```bash
ionic start app blank --type=react --capacitor --no-git
```

(`--no-git` evita que se cree un repositorio dentro de tu repositorio. Si pregunta por crear una cuenta de Ionic, responde que no.)

**Copiar el código:**
1. Copia la carpeta `api` junto a la carpeta `app`, dentro de la carpeta de esta entrega.
2. Copia la carpeta `app\src` de este zip y pégala dentro de `app\`, aceptando **reemplazar** los archivos existentes. No hace falta tocar nada más.

**Encender la API** (terminal 1):

```bash
cd api
npm install
npm start
```

**Encender la app** (terminal 2):

```bash
cd app
ionic serve
```

Se abre en `http://localhost:8100`. La pantalla original está en `http://localhost:8100/antes`.

## 7. Entrega

```bash
git add .
git commit -m "Entrega semana 11"
git push
```

Si el push te rechaza, haz `git pull` primero.
