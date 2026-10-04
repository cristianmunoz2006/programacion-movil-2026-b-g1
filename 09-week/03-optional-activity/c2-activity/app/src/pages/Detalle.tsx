import React, { useState, useEffect } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonBackButton, IonButtons, IonItem, IonLabel, IonSpinner
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import MensajeError from '../components/MensajeError';
import { obtenerReserva, Reserva } from '../services/reservasApi';

const Detalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [reserva, setReserva] = useState<Reserva | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const datos = await obtenerReserva(id);
      setReserva(datos);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, [id]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Detalle de Reserva</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {cargando && <IonSpinner />}
        {error && <MensajeError mensaje={error} reintentar={cargar} />}
        {reserva && (
          <>
            <IonItem><IonLabel>Servicio: {reserva.servicio}</IonLabel></IonItem>
            <IonItem><IonLabel>Fecha: {reserva.fecha}</IonLabel></IonItem>
            <IonItem><IonLabel>Hora: {reserva.hora}</IonLabel></IonItem>
            <IonItem><IonLabel>Estado: {reserva.estado}</IonLabel></IonItem>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Detalle;
