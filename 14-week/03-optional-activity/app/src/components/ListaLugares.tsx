import React from 'react';
import { IonList, IonItem, IonLabel } from '@ionic/react';
import { Lugar } from '../services/lugaresApi';

interface Props {
  lugares: Lugar[];
}

const ListaLugares: React.FC<Props> = ({ lugares }) => (
  <IonList>
    {lugares.map(l => (
      <IonItem key={l.id} routerLink={`/detalle/${l.id}`} detail>
        <IonLabel>
          <h2>{l.nombre}</h2>
          <p className="lugar-detalle">{l.categoria} · {l.fecha}</p>
        </IonLabel>
      </IonItem>
    ))}
  </IonList>
);

export default ListaLugares;
