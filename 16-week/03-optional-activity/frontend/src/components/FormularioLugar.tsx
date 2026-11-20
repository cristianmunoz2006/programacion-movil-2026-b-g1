import React, { useState } from 'react';
import { IonItem, IonInput, IonSelect, IonSelectOption, IonButton } from '@ionic/react';
import MensajeError from './MensajeError';
import { CATEGORIAS } from '../services/lugaresApi';
import { obtenerUbicacion, Coordenadas } from '../services/ubicacion';

interface Props {
  onGuardar: (nombre: string, categoria: string, nota: string, coords: Coordenadas | null) => Promise<boolean>;
}

const FormularioLugar: React.FC<Props> = ({ onGuardar }) => {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [nota, setNota] = useState('');
  const [coords, setCoords] = useState<Coordenadas | null>(null);
  const [errorUbicacion, setErrorUbicacion] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const usarUbicacion = async () => {
    setBuscando(true);
    setErrorUbicacion('');
    const resultado = await obtenerUbicacion();
    setBuscando(false);

    if (resultado.ok) {
      setCoords(resultado.coords);
    } else if (resultado.motivo === 'denegado') {
      setErrorUbicacion(
        'Permiso de ubicación denegado. Actívalo en los ajustes para guardar la ubicación; ' +
        'también puedes guardar el lugar sin ella.'
      );
    } else {
      setErrorUbicacion('No se pudo obtener la ubicación. Revisa que el GPS esté encendido e intenta de nuevo.');
    }
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !categoria) return;

    setEnviando(true);
    const ok = await onGuardar(nombre, categoria, nota, coords);
    setEnviando(false);

    // Solo limpiamos el formulario si se guardo bien.
    if (ok) {
      setNombre('');
      setCategoria('');
      setNota('');
      setCoords(null);
    }
  };

  return (
    <form onSubmit={enviar}>
      <IonItem>
        <IonInput
          label="Nombre del lugar"
          labelPlacement="stacked"
          value={nombre}
          onIonInput={e => setNombre(String(e.detail.value ?? ''))}
        />
      </IonItem>
      <IonItem>
        <IonSelect
          label="Categoría"
          labelPlacement="stacked"
          placeholder="Elige una categoría"
          value={categoria}
          onIonChange={e => setCategoria(String(e.detail.value ?? ''))}
        >
          {CATEGORIAS.map(c => (
            <IonSelectOption key={c} value={c}>{c}</IonSelectOption>
          ))}
        </IonSelect>
      </IonItem>
      <IonItem>
        <IonInput
          label="Nota (opcional)"
          labelPlacement="stacked"
          value={nota}
          onIonInput={e => setNota(String(e.detail.value ?? ''))}
        />
      </IonItem>

      <IonButton
        type="button"
        fill="outline"
        expand="block"
        className="ion-margin-top"
        disabled={buscando}
        onClick={usarUbicacion}
      >
        {buscando ? 'Buscando ubicación...' : 'Usar mi ubicación'}
      </IonButton>

      {coords && (
        <p className="ion-text-center">
          Ubicación: {coords.latitud.toFixed(5)}, {coords.longitud.toFixed(5)}
        </p>
      )}
      {errorUbicacion && <MensajeError mensaje={errorUbicacion} />}

      <IonButton
        expand="block"
        type="submit"
        disabled={enviando || !nombre.trim() || !categoria}
        className="ion-margin-top"
      >
        {enviando ? 'Guardando...' : 'Guardar lugar'}
      </IonButton>
    </form>
  );
};

export default FormularioLugar;
