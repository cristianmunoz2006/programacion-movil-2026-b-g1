import React, { useState } from 'react';
import { IonItem, IonInput, IonSelect, IonSelectOption, IonButton } from '@ionic/react';
import { CATEGORIAS } from '../services/lugaresApi';

interface Props {
  onGuardar: (nombre: string, categoria: string, nota: string) => Promise<boolean>;
}

const FormularioLugar: React.FC<Props> = ({ onGuardar }) => {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [nota, setNota] = useState('');
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !categoria) return;

    setEnviando(true);
    const ok = await onGuardar(nombre, categoria, nota);
    setEnviando(false);

    // Solo limpiamos el formulario si se guardo bien.
    if (ok) {
      setNombre('');
      setCategoria('');
      setNota('');
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
