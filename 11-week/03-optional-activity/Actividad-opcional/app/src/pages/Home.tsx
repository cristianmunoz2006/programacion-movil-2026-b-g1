import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonFooter, IonButton, useIonViewWillEnter
} from '@ionic/react';
import ListaLugares from '../components/ListaLugares';
import EstadoCargando from '../components/EstadoCargando';
import EstadoVacio from '../components/EstadoVacio';
import MensajeError from '../components/MensajeError';
import { listarLugares, Lugar } from '../services/lugaresApi';
import './Home.css';

const Home: React.FC = () => {
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const datos = await listarLugares();
      setLugares(datos);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setCargando(false);
    }
  };

  // Se ejecuta cada vez que la pantalla aparece (tambien al volver de "Nuevo lugar"),
  // asi la lista siempre se ve actualizada.
  useIonViewWillEnter(() => {
    cargar();
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Lugares visitados</IonTitle>
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

      {/* Unica accion principal de la pantalla: grande, con texto y siempre visible */}
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
