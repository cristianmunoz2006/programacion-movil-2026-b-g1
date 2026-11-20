import React, { useState, useEffect } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonBackButton, IonButtons, IonItem, IonLabel
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import EstadoCargando from '../components/EstadoCargando';
import MensajeError from '../components/MensajeError';
import { obtenerLugar, comoErrorApi, Lugar } from '../services/lugaresApi';
import { fechaLegible } from '../services/formato';
import { useIrALogin } from '../hooks/useIrALogin';

const Detalle: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const [lugar, setLugar] = useState<Lugar | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const irALogin = useIrALogin();

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const datos = await obtenerLugar(id);
      setLugar(datos);
    } catch (e) {
      const err = comoErrorApi(e);
      if (err.tipo === 'sesion') {
        irALogin(err.message);
        return;
      }
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, [id]);

  const ubicacion =
    lugar && lugar.latitud != null && lugar.longitud != null
      ? `${lugar.latitud.toFixed(5)}, ${lugar.longitud.toFixed(5)}`
      : 'Sin ubicación';

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Detalle del lugar</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {cargando && <EstadoCargando texto="Cargando lugar..." />}
        {!cargando && error && <MensajeError mensaje={error} reintentar={cargar} />}
        {!cargando && lugar && (
          <>
            <IonItem><IonLabel>Nombre: {lugar.nombre}</IonLabel></IonItem>
            <IonItem><IonLabel>Categoría: {lugar.categoria}</IonLabel></IonItem>
            <IonItem><IonLabel>Nota: {lugar.nota || 'Sin nota'}</IonLabel></IonItem>
            <IonItem><IonLabel>Fecha de visita: {fechaLegible(lugar.fecha)}</IonLabel></IonItem>
            <IonItem><IonLabel>Ubicación: {ubicacion}</IonLabel></IonItem>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Detalle;
