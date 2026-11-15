import React from 'react';
import { IonButton } from '@ionic/react';
import './MensajeError.css';

interface Props {
  mensaje: string;
  reintentar?: () => void;
}

// Estado "error": role="alert" hace que el lector de pantalla lo anuncie
// de inmediato. El boton ya no es "small" para tener un area tactil comoda.
const MensajeError: React.FC<Props> = ({ mensaje, reintentar }) => (
  <div className="mensaje-error" role="alert">
    <p className="mensaje-error-texto">{mensaje}</p>
    {reintentar && <IonButton onClick={reintentar}>Reintentar</IonButton>}
  </div>
);

export default MensajeError;
