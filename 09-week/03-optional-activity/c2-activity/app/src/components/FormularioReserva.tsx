import React, { useState } from 'react';
import { IonItem, IonLabel, IonInput, IonButton } from '@ionic/react';
import './FormularioReserva.css';

interface Props {
  onRegistrar: (servicio: string, fecha: string, hora: string) => Promise<boolean>;
}

const FormularioReserva: React.FC<Props> = ({ onRegistrar }) => {
  const [servicio, setServicio] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!servicio || !fecha || !hora) return;

    setEnviando(true);
    const ok = await onRegistrar(servicio, fecha, hora);
    setEnviando(false);

    // Solo limpiamos el formulario si se guardo bien.
    // Si fallo, dejamos el texto para no tener que escribirlo otra vez.
    if (ok) {
      setServicio('');
      setFecha('');
      setHora('');
    }
  };

  return (
    <form className="formulario-reserva" onSubmit={enviar}>
      <IonItem>
        <IonLabel position="stacked">Servicio</IonLabel>
        <IonInput value={servicio} onIonChange={e => setServicio(e.detail.value || '')} />
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Fecha</IonLabel>
        <IonInput type="date" value={fecha} onIonChange={e => setFecha(e.detail.value || '')} />
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Hora</IonLabel>
        <IonInput type="time" value={hora} onIonChange={e => setHora(e.detail.value || '')} />
      </IonItem>
      <IonButton expand="block" type="submit" disabled={enviando} className="ion-margin-top">
        {enviando ? 'Guardando...' : 'Reservar'}
      </IonButton>
    </form>
  );
};

export default FormularioReserva;
