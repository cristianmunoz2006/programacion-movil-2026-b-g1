# Navegación y tokens de diseño

## Patrón de navegación elegido: pila (stack)

Elegí una pila por estas razones:

- La app tiene una sola sección principal, Estudiantes, más el Login, que solo aparece antes de entrar. Las pestañas se justifican cuando hay de 3 a 5 secciones principales, y aquí hay una.
- Lo que más hace el entrenador es abrir la Lista de estudiantes y entrar al Detalle de un estudiante. Ir de una lista a un detalle es lo que resuelve una pila: se entra con un toque y se vuelve con el botón de regreso.
- Las pantallas que el equipo tiene previstas, AttendanceForm y AttendanceHistory, también se abren desde el detalle de un estudiante, así que seguirían en la misma pila. Si más adelante hay 3 secciones principales independientes, se cambiaría a pestañas.

Cómo quedó en `RootNavigator.tsx`: sin sesión se muestra Login. Con sesión se muestran `StudentList` y `StudentDetail`. La lista conserva su encabezado propio, con el botón + y el de cerrar sesión. `StudentDetail` usa el encabezado nativo con título y botón de regreso, y se abre al tocar una tarjeta de la lista.

## Tokens (en `src/core/theme/theme.ts`)

| Token | Valor | Uso |
| :--- | :--- | :--- |
| `color.primary` | `#2E7D32` | Botones principales, íconos de acción |
| `color.onPrimary` | `#FFFFFF` | Texto sobre el color primario |
| `color.secondary` | `#1565C0` | Acciones secundarias |
| `color.onSecondary` | `#FFFFFF` | Texto sobre el color secundario |
| `color.success` | `#1B5E20` | Confirmaciones de éxito |
| `color.onSuccess` | `#FFFFFF` | Texto sobre el color de éxito |
| `color.error` | `#B00020` | Mensajes de error |
| `color.background` | `#F5F5F5` | Fondo de las pantallas |
| `color.surface` | `#FFFFFF` | Tarjetas y campos de texto |
| `color.text` | `#1A1A1A` | Texto principal |
| `color.textMuted` | `#6B6B6B` | Etiquetas y texto secundario |
| `color.border` | `#E0E0E0` | Bordes y banner sin conexión |
| `text.title` | 22 px, negrita | Títulos de pantalla |
| `text.body` | 16 px | Texto normal |
| `text.caption` | 13 px | Etiquetas y mensajes cortos |
| `space.xs / sm / md / lg / xl` | 4 / 8 / 16 / 24 / 32 | Márgenes y separaciones |
| `radius.sm / md / pill` | 4 / 8 / 999 | Esquinas |

## Contraste de cada par texto y fondo

Mínimo exigido: 4.5 a 1.

| Texto | Fondo | Relación | Resultado |
| :--- | :--- | :--- | :--- |
| `text` `#1A1A1A` | `background` `#F5F5F5` | 15.96 | Cumple |
| `text` `#1A1A1A` | `surface` `#FFFFFF` | 17.40 | Cumple |
| `text` `#1A1A1A` | `border` `#E0E0E0` | 13.18 | Cumple |
| `textMuted` `#6B6B6B` | `background` `#F5F5F5` | 4.89 | Cumple |
| `textMuted` `#6B6B6B` | `surface` `#FFFFFF` | 5.33 | Cumple |
| `onPrimary` `#FFFFFF` | `primary` `#2E7D32` | 5.13 | Cumple |
| `primary` `#2E7D32` | `background` `#F5F5F5` | 4.70 | Cumple |
| `primary` `#2E7D32` | `surface` `#FFFFFF` | 5.13 | Cumple |
| `onSecondary` `#FFFFFF` | `secondary` `#1565C0` | 5.75 | Cumple |
| `onSuccess` `#FFFFFF` | `success` `#1B5E20` | 7.87 | Cumple |
| `error` `#B00020` | `background` `#F5F5F5` | 6.72 | Cumple |
| `error` `#B00020` | `surface` `#FFFFFF` | 7.33 | Cumple |