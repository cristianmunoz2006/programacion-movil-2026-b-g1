import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, useIonRouter, useIonToast
} from '@ionic/react';
import FormularioLugar from '../components/FormularioLugar';
import MensajeError from '../components/MensajeError';
import { crearLugar, comoErrorApi } from '../services/lugaresApi';
import { Coordenadas } from '../services/ubicacion';
import { useIrALogin } from '../hooks/useIrALogin';

const NuevoLugar: React.FC = () => {
  const [error, setError] = useState('');
  const ionRouter = useIonRouter();
  const [presentarAviso] = useIonToast();
  const irALogin = useIrALogin();

  const guardar = async (
    nombre: string,
    categoria: string,
    nota: string,
    coords: Coordenadas | null
  ): Promise<boolean> => {
    setError('');
    try {
      await crearLugar(nombre, categoria, nota, coords);
      presentarAviso({ message: 'Lugar guardado', duration: 2500, position: 'top' });
      ionRouter.goBack(); // vuelve a la lista, que se recarga sola
      return true;
    } catch (e) {
      const err = comoErrorApi(e);
      if (err.tipo === 'sesion') {
        irALogin(err.message);
        return false;
      }
      setError(err.message);
      return false;
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Nuevo lugar</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <FormularioLugar onGuardar={guardar} />
        {error && <MensajeError mensaje={error} />}
      </IonContent>
    </IonPage>
  );
};

export default NuevoLugar;
