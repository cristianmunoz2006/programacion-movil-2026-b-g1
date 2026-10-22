# Prueba de usabilidad con dos personas

Participantes: dos personas, registradas como Participante 1 y Participante 2. Cada una usó la app sin ayuda, en el celular, con la sesión ya iniciada y la Lista de estudiantes abierta. Se les leyó cada tarea en voz alta y se les pidió pensar en voz alta mientras la hacían.

## Tareas

1. Registrar un estudiante nuevo desde el modal "Agregar estudiante" (`name` y `documentNumber`).
2. Encontrar el detalle de un estudiante existente y decir en voz alta su número de documento.
3. Corregir un error del formulario: intentar registrar un estudiante con un documento que ya existe, ver el error y lograr guardarlo con otro documento.

## Resultados

| Tarea | Persona | ¿La completó? | Tiempo aproximado | Errores | Lo que dijo |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1. Registrar estudiante | Participante 1 | Sí | Menos de 15 s | 0 | "Me imagino que en el más" |
| 1. Registrar estudiante | Participante 2 | Sí | Menos de 15 s | 1: tocó cerrar sesión en vez de agregar | "Aquí es el más" |
| 2. Ver el detalle | Participante 1 | Sí | Menos de 5 s | 0 | "Aquí" |
| 2. Ver el detalle | Participante 2 | Sí | Menos de 5 s | 0 | "Aquí" |
| 3. Corregir el duplicado | Participante 1 | Sí | Más de 25 s | 0 | "Por lo que ya existe" |
| 3. Corregir el duplicado | Participante 2 | Sí | Más de 25 s | 0 | "Aquí dice, ya existe uno" |

Los tiempos son estimaciones por observación, sin cronómetro, y valen para las dos personas por igual: no se tomaron tiempos individuales. Sirven para comparar tareas entre sí (la 2 fue la más rápida y la 3 la más lenta) y no como medición exacta.

## Los tres problemas más importantes

| # | Problema | Evidencia | Severidad |
| :--- | :--- | :--- | :--- |
| 1 | La acción de agregar un estudiante es solo un ícono `+` sin texto, y hay que adivinar que sirve para eso | Las dos personas lo dijeron así: "me imagino que en el más" y "aquí es el más" | Alta |
| 2 | Los botones de agregar (`+`) y de cerrar sesión están juntos, son solo íconos y se confunden | La persona 2 tocó cerrar sesión creyendo que agregaba (1 error). Al tocar cerrar sesión ahora aparece la confirmación agregada en el CP6 | Media |
| 3 | Corregir el documento duplicado fue la tarea más lenta | Más de 25 s en las dos personas, aunque ambas entendieron el mensaje ("ya existe"). La causa probable es que el aviso aparece hasta tocar "Guardar". No está comprobado | Baja |

## Limitaciones

Solo participaron dos personas y los tiempos son aproximados. Los problemas 1 y 2 salen de lo que se vio y se dijo en la prueba; la causa del problema 3 es una hipótesis.
## Corrección aplicada

Se corrigieron los problemas 1 y 2: los dos botones del encabezado de la Lista de estudiantes ahora tienen texto visible, "+ Agregar" y "Salir", además de su ícono. El nombre accesible del botón de salir pasó a ser "Salir", para que coincida con el texto visible.

| Antes | Después |
| :--- | :--- |
| ![Encabezado solo con íconos](img/before-student-list.png) | ![Encabezado con texto](img/after-list-labels.png) |

Pendiente: no se repitió la prueba con personas. Al repetirla, hay que comprobar que la tarea 1 ya no obligue a adivinar y que no se vuelvan a confundir los dos botones.