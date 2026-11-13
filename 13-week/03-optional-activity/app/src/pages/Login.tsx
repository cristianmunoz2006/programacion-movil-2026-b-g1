import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonInput, IonButton, useIonRouter, useIonViewWillEnter
} from '@ionic/react';
import MensajeError from '../components/MensajeError';
import { iniciarSesion, comoErrorApi } from '../services/lugaresApi';
import { leerAviso } from '../services/sesion';

const Login: React.FC = () => {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const ionRouter = useIonRouter();

  // Cada vez que aparece la pantalla, muestra el aviso pendiente (ej. "Tu sesion vencio")
  useIonViewWillEnter(() => {
    setAviso(leerAviso());
  });

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      await iniciarSesion(correo.trim(), clave);
      ionRouter.push('/home', 'root', 'replace');
    } catch (err) {
      setError(comoErrorApi(err).message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Huella Viajera</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>Iniciar sesión</h2>

        {aviso && !error && <MensajeError mensaje={aviso} />}

        <form onSubmit={entrar}>
          <IonItem>
            <IonInput
              label="Correo"
              labelPlacement="stacked"
              type="email"
              autocomplete="email"
              value={correo}
              onIonInput={e => setCorreo(String(e.detail.value ?? ''))}
            />
          </IonItem>
          <IonItem>
            <IonInput
              label="Clave"
              labelPlacement="stacked"
              type="password"
              value={clave}
              onIonInput={e => setClave(String(e.detail.value ?? ''))}
            />
          </IonItem>
          <IonButton
            expand="block"
            type="submit"
            disabled={enviando || !correo.trim() || !clave}
            className="ion-margin-top"
          >
            {enviando ? 'Entrando...' : 'Iniciar sesión'}
          </IonButton>
        </form>

        {error && <MensajeError mensaje={error} />}
      </IonContent>
    </IonPage>
  );
};

export default Login;
