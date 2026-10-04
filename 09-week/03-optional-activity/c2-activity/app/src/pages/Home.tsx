import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSpinner } from '@ionic/react';
import FormularioReserva from '../components/FormularioReserva';
import ListaReservas from '../components/ListaReservas';
import MensajeError from '../components/MensajeError';
import { listarReservas, crearReserva, Reserva } from '../services/reservasApi';
import './Home.css';

const Home: React.FC = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorLista, setErrorLista] = useState('');
  const [errorRegistro, setErrorRegistro] = useState('');

  const cargar = async () => {
    setCargando(true);
    setErrorLista('');
    try {
      const datos = await listarReservas();
      setReservas(datos);
    } catch (e) {
      setErrorLista((e as Error).message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const registrar = async (servicio: string, fecha: string, hora: string): Promise<boolean> => {
    setErrorRegistro('');
    try {
      const nueva = await crearReserva(servicio, fecha, hora);
      setReservas([...reservas, nueva]);
      return true;
    } catch (e) {
      setErrorRegistro((e as Error).message);
      return false;
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mis Reservas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <FormularioReserva onRegistrar={registrar} />
        {errorRegistro && <MensajeError mensaje={errorRegistro} />}

        {cargando && <IonSpinner />}
        {errorLista && <MensajeError mensaje={errorLista} reintentar={cargar} />}
        {!cargando && !errorLista && <ListaReservas reservas={reservas} />}
      </IonContent>
    </IonPage>
  );
};

export default Home;
