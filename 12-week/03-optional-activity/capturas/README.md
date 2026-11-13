# Semana 12 — GPS con Capacitor (Huella Viajera)

**App:** Huella Viajera (lugares visitados) · Ionic React + API Express

## Qué se agregó en esta semana

A la app de la Semana 11 se le agregó el plugin de **geolocalización** de Capacitor (`@capacitor/geolocation`):

- En la pantalla "Nuevo lugar" hay un botón **"Usar mi ubicación"**.
- Al tocarlo, la app revisa si tiene el permiso de ubicación, lo pide si falta, y muestra la **latitud y la longitud**.
- La ubicación se guarda junto con el lugar, y la pantalla de detalle la muestra.
- Si el usuario **niega el permiso**, aparece un mensaje en rojo y el lugar se puede guardar igual, sin ubicación.

## Dónde está en el código

| Qué | Archivo |
|---|---|
| Plugin y manejo del permiso (concedido, denegado, error) | `app/src/services/ubicacion.ts` |
| Botón "Usar mi ubicación" y mensajes | `app/src/components/FormularioLugar.tsx` |
| La API acepta la ubicación (opcional y validada) | `api/routes/lugares.js` |
| Detalle con la ubicación | `app/src/pages/Detalle.tsx` |

## Cómo se maneja el permiso

1. `Geolocation.checkPermissions()` revisa el estado actual.
2. Si no está concedido, `Geolocation.requestPermissions()` muestra el cuadro del sistema. (En el navegador esta función no existe; ahí el cuadro aparece al pedir la posición.)
3. Si el usuario lo **niega**, no se pide la posición y se muestra: *"Permiso de ubicación denegado..."*. La app sigue funcionando y deja guardar el lugar sin ubicación.
4. Si lo **acepta**, `Geolocation.getCurrentPosition()` devuelve las coordenadas, que se muestran en pantalla.
5. Si el GPS está apagado o falla, se muestra un mensaje distinto: *"No se pudo obtener la ubicación..."*.

En Android 12 o superior el usuario puede dar solo ubicación aproximada; la app también lo acepta como permiso concedido.

## Cómo ejecutarlo en el navegador

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
npm install @capacitor/core@8.6.0 @capacitor/cli@8.6.0 @capacitor/android@8.6.0 @capacitor/geolocation@8.2.4
ionic serve
```

Los cuatro paquetes de Capacitor se instalan juntos y con la misma versión, porque el proyecto base traía `@capacitor/core` 8.5.3 y `@capacitor/android` 8.6.0 exige el core en 8.6.0 o superior.

## Correr en un celular Android

1. **IP del computador.** En `app/src/services/lugaresApi.ts`, cambia `IP_DEL_PC = 'localhost'` por la IP del computador en la red Wi-Fi (`ipconfig`, "Dirección IPv4" del adaptador Wi-Fi). El celular y el computador deben estar en la misma red.
2. **Permitir HTTP.** En `app/capacitor.config.ts`, reemplaza la línea `webDir: 'dist'` (con o sin coma al final) por:

   ```ts
   webDir: 'dist',
   server: {
     androidScheme: 'http',
     cleartext: true,
   },
   ```

3. **Proyecto Android.** Desde la carpeta `app`:

   ```bash
   npm run build
   npx cap add android
   npx cap sync
   ```

4. **Permisos.** En `app/android/app/src/main/AndroidManifest.xml`:
   - En la etiqueta `<application`, agrega `android:usesCleartextTraffic="true"` como primer atributo.
   - Agrega después de la línea `<uses-permission android:name="android.permission.INTERNET" />`:

     ```xml
     <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
     <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
     <uses-feature android:name="android.hardware.location.gps" />
     ```

   Luego ejecuta `npx cap sync` otra vez.
5. **Android Studio.** Ejecuta `npx cap open android`. En el aviso "Please Select Gradle JVM to Import Project" se eligió **Use JVM 21**, y se esperó a que terminara la sincronización de Gradle.
6. **Conectar el celular por depuración inalámbrica** (sin cable de datos). En el celular: Ajustes → Opciones de desarrollador → Depuración inalámbrica → "Vincular dispositivo con código de vinculación". Con la IP, el puerto y el código que muestra:

   ```bash
   adb pair IP_DEL_CELULAR:PUERTO_DE_VINCULACION
   adb connect IP_DEL_CELULAR:PUERTO_DE_DEPURACION
   adb devices
   ```

   (`adb` está en `%LOCALAPPDATA%\Android\Sdk\platform-tools\`.) El puerto de vinculación y el de depuración son distintos.
7. **Ejecutar.** En Android Studio se elige el celular en la lista de dispositivos y se presiona Run ▶. La API debe estar encendida en el computador (`npm start` en `api`).

La excepción de HTTP (`cleartext` y `usesCleartextTraffic`) es solo para probar en la red local; una app publicada debe usar HTTPS.

## Prueba en un dispositivo real

Se probó en un celular Android real, conectado a Android Studio por depuración inalámbrica (Wi-Fi) y a la API por la misma red.

| Caso | Qué se hizo | Resultado | Captura |
|---|---|---|---|
| App corriendo | Abrir la app en el celular | Aparece la lista de lugares | `capturas/01-app-en-celular.png` |
| Permiso solicitado | Tocar "Usar mi ubicación" | Aparece el cuadro del sistema pidiendo el permiso | `capturas/02-permiso-ubicacion.png` |
| Permiso concedido | Aceptar el permiso | Se muestran latitud y longitud | `capturas/03-ubicacion-obtenida.png` |
| Ubicación guardada | Guardar el lugar y abrir su detalle | El detalle muestra la ubicación | `capturas/04-lugar-con-ubicacion.png` |
| Permiso denegado | Negar el permiso | Mensaje rojo; el lugar se puede guardar sin ubicación | `capturas/05-permiso-denegado.png` |

![App en el celular](capturas/01-app-en-celular.png)
![Permiso de ubicación](capturas/02-permiso-ubicacion.png)
![Ubicación obtenida](capturas/03-ubicacion-obtenida.png)
![Lugar con ubicación](capturas/04-lugar-con-ubicacion.png)
![Permiso denegado](capturas/05-permiso-denegado.png)

Para repetir la prueba del permiso denegado: en el celular, Ajustes → Aplicaciones → la app → Permisos → Ubicación, y cámbialo a "No permitir" (o desinstala la app y vuelve a instalarla).

## Entrega

```bash
git add .
git commit -m "Entrega semana 12"
git push
```
