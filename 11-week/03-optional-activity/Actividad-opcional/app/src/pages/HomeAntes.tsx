import React, { useState, useEffect } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonSpinner, IonText, IonButton
} from '@ionic/react';
import FormularioLugar from '../components/FormularioLugar';
import ListaLugares from '../components/ListaLugares';
import { listarLugares, crearLugar, Lugar } from '../services/lugaresApi';

// VERSION ORIGINAL de la pantalla (semanas 9 y 10), ANTES del rediseño de la semana 11.
// Se conserva solo para comparar. Para verla: http://localhost:8100/antes
// Problemas que tenia: formulario y lista compitiendo en la misma pantalla,
// spinner sin texto, sin estado vacio, error en rojo de bajo contraste
// y boton "Reintentar" pequeño.

const HomeAntes: React.FC = () => {
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorLista, setErrorLista] = useState('');
  const [errorGuardar, setErrorGuardar] = useState('');

  const cargar = async () => {
    setCargando(true);
    setErrorLista('');
    try {
      const datos = await listarLugares();
      setLugares(datos);
    } catch (e) {
      setErrorLista((e as Error).message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const guardar = async (nombre: string, categoria: string, nota: string): Promise<boolean> => {
    setErrorGuardar('');
    try {
      const nuevo = await crearLugar(nombre, categoria, nota);
      setLugares([...lugares, nuevo]);
      return true;
    } catch (e) {
      setErrorGuardar((e as Error).message);
      return false;
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Lugares visitados</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <FormularioLugar onGuardar={guardar} />
        {errorGuardar && (
          <IonText color="danger"><p>{errorGuardar}</p></IonText>
        )}

        {cargando && <IonSpinner />}
        {errorLista && (
          <div style={{ textAlign: 'center' }}>
            <IonText color="danger"><p>{errorLista}</p></IonText>
            <IonButton size="small" className="boton-original" onClick={cargar}>Reintentar</IonButton>
          </div>
        )}
        {!cargando && !errorLista && <ListaLugares lugares={lugares} />}
      </IonContent>
    </IonPage>
  );
};

export default HomeAntes;
