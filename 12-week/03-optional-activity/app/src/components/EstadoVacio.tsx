import React from 'react';
import './Estados.css';

// Estado "vacio": la lista cargo bien pero todavia no hay lugares guardados.
const EstadoVacio: React.FC = () => (
  <div className="estado">
    <h2 className="estado-titulo">Aún no has guardado lugares</h2>
    <p className="estado-texto">Toca "Nuevo lugar" para guardar el primero.</p>
  </div>
);

export default EstadoVacio;
