import { useIonRouter } from '@ionic/react';
import { guardarAviso } from '../services/sesion';

// Devuelve una funcion que lleva al login (opcionalmente con un aviso para el usuario).
export function useIrALogin() {
  const ionRouter = useIonRouter();

  return (mensaje: string = '') => {
    guardarAviso(mensaje);
    ionRouter.push('/login', 'root', 'replace');
  };
}
