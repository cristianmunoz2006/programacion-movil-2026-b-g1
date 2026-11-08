import React from 'react';
import { IonSpinner } from '@ionic/react';
import './Estados.css';

interface Props {
  texto?: string;
}

// Estado "cargando": spinner + texto (no solo el circulito) y role="status"
// para que un lector de pantalla lo anuncie.
const EstadoCargando: React.FC<Props> = ({ texto = 'Cargando...' }) => (
  <div className="estado" role="status" aria-live="polite">
    <IonSpinner name="crescent" />
    <p className="estado-texto">{texto}</p>
  </div>
);

export default EstadoCargando;
