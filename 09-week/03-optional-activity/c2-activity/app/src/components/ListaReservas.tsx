import React from 'react';
import { IonList, IonItem, IonLabel } from '@ionic/react';
import { Reserva } from '../services/reservasApi';

interface Props {
  reservas: Reserva[];
}

const ListaReservas: React.FC<Props> = ({ reservas }) => (
  <IonList>
    {reservas.map(r => (
      <IonItem key={r.id} routerLink={`/detalle/${r.id}`} detail>
        <IonLabel>
          <h3>{r.servicio}</h3>
          <p>{r.fecha} - {r.hora} ({r.estado})</p>
        </IonLabel>
      </IonItem>
    ))}
  </IonList>
);

export default ListaReservas;
