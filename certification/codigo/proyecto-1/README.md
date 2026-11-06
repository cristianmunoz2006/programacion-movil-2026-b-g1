# Proyecto 1: Configuración del Entorno y Compilación Inicial en Cangjie

## Descripción General
Este proyecto documenta la preparación del entorno de desarrollo para el lenguaje Cangjie (SDK v1.2.0), la resolución de incompatibilidades de plataforma y la validación de compilación tanto con el gestor de paquetes (`cjpm`) como con el compilador directo (`cjc`).

## Entorno de Desarrollo
- **Sistema Operativo:** WSL2 (Ubuntu 22.04 LTS) sobre Windows 11
- **SDK Cangjie:** v1.2.0 (`/home/cristian/cangjie`)
- **Editor de Código:** Visual Studio Code (WSL Remote Extension)

## Resumen de Tareas Realizadas

### Task 1.1 & 1.2: Entorno y Proyecto Base (`demo`)
Se configuró el SDK en el entorno Linux WSL tras detectar incompatibilidad de ejecución nativa en Windows (`0xC0000005`). Se generó y ejecutó el proyecto ejecutable base utilizando `cjpm init` y `cjpm run`.

### Task 1.3: Evaluación de DevEco Studio
Análisis del entorno DevEco Studio y sus módulos para aplicaciones móviles HarmonyOS, justificando la elección de VS Code sobre WSL como entorno de compilación funcional.

### Task 1.4: Compilación Nativa (`cjc`) y Biblioteca Estándar
Validación del compilador `cjc` en modo directo sin gestor de proyectos, importando la librería `std.collection.*` y haciendo uso de colecciones dinámicas (`ArrayList<String>`).

## Comandos de Ejecución

```bash
# Compilación directa con cjc
cjc main.cj -o main.x
./main.x

# Ejecución con el gestor cjpm
cjpm run