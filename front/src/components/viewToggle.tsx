import React from 'react';
import IconSVG from './icon';

interface ViewToggleProps {
  viewType: 'cards' | 'list'; // Solo puede ser uno de estos dos valores
  showCards: () => void;
  showList: () => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewType, showCards, showList }) => {
  return (
    <div className="organizacion_dashboard">
      {/* Botón para la vista de tarjetas */}
      <div
        className={`option_diseño_card ${viewType === 'cards' ? 'active_organizacion_dashboard' : ''}`}
        onClick={showCards}
      >
        <IconSVG name="IconTipoTarjetas" />
      </div>

      {/* Botón para la vista de lista */}
      <div
        className={`option_diseño_card ${viewType === 'list' ? 'active_organizacion_dashboard' : ''}`}
        onClick={showList}
      >
        <IconSVG name="IconTipoListas" />
      </div>
    </div>
  );
};

export default ViewToggle;
