import React from 'react';
import { IonButton, IonText } from '@ionic/react';
import './MensajeError.css';

interface Props {
  mensaje: string;
  reintentar?: () => void;
}

const MensajeError: React.FC<Props> = ({ mensaje, reintentar }) => (
  <div className="mensaje-error">
    <IonText color="danger"><p>{mensaje}</p></IonText>
    {reintentar && (
      <IonButton size="small" onClick={reintentar}>Reintentar</IonButton>
    )}
  </div>
);

export default MensajeError;
