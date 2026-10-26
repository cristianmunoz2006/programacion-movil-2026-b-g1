import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, useIonRouter
} from '@ionic/react';
import FormularioLugar from '../components/FormularioLugar';
import MensajeError from '../components/MensajeError';
import { crearLugar } from '../services/lugaresApi';

const NuevoLugar: React.FC = () => {
  const [error, setError] = useState('');
  const ionRouter = useIonRouter();

  const guardar = async (nombre: string, categoria: string, nota: string): Promise<boolean> => {
    setError('');
    try {
      await crearLugar(nombre, categoria, nota);
      ionRouter.goBack(); // vuelve a la lista, que se recarga sola
      return true;
    } catch (e) {
      setError((e as Error).message);
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