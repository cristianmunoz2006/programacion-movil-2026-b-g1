import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonContent,
  IonFooter, IonButton, useIonViewWillEnter
} from '@ionic/react';
import ListaLugares from '../components/ListaLugares';
import EstadoCargando from '../components/EstadoCargando';
import EstadoVacio from '../components/EstadoVacio';
import MensajeError from '../components/MensajeError';
import { listarLugares, cerrarSesion, comoErrorApi, Lugar } from '../services/lugaresApi';
import { useIrALogin } from '../hooks/useIrALogin';
import './Home.css';

const Home: React.FC = () => {
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const irALogin = useIrALogin();

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const datos = await listarLugares();
      setLugares(datos);
    } catch (e) {
      const err = comoErrorApi(e);
      if (err.tipo === 'sesion') {
        irALogin(err.message); // 401 o sin token: de vuelta al login con un aviso
        return;
      }
      setError(err.message); // sin red o error del servidor: mensaje + "Reintentar"
    } finally {
      setCargando(false);
    }
  };

  // Se ejecuta cada vez que la pantalla aparece (tambien al volver de "Nuevo lugar")
  useIonViewWillEnter(() => {
    cargar();
  });

  const salir = async () => {
    await cerrarSesion();
    irALogin();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Lugares visitados</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={salir}>Salir</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* Estado 1: cargando */}
        {cargando && <EstadoCargando texto="Cargando lugares..." />}

        {/* Estado 2: error */}
        {!cargando && error && <MensajeError mensaje={error} reintentar={cargar} />}

        {/* Estado 3: vacio */}
        {!cargando && !error && lugares.length === 0 && <EstadoVacio />}

        {/* Estado 4: con datos */}
        {!cargando && !error && lugares.length > 0 && <ListaLugares lugares={lugares} />}
      </IonContent>

      {/* Unica accion principal de la pantalla */}
      <IonFooter>
        <IonToolbar>
          <div className="accion-principal">
            <IonButton expand="block" size="large" routerLink="/nuevo">
              Nuevo lugar
            </IonButton>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Home;
