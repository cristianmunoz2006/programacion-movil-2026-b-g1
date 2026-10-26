import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import Home from './pages/Home';
import NuevoLugar from './pages/NuevoLugar';
import Detalle from './pages/Detalle';
import HomeAntes from './pages/HomeAntes';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Ajustes de accesibilidad de la semana 11 */
import './theme/accesibilidad.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/home" element={<Home />} />
        <Route path="/nuevo" element={<NuevoLugar />} />
        <Route path="/detalle/:id" element={<Detalle />} />
        {/* Pantalla original, solo para tomar las capturas del "antes" */}
        <Route path="/antes" element={<HomeAntes />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;