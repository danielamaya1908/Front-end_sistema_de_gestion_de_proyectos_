import React from 'react';
import IconSVG from './icon';

interface BtnSubmitDashboardProps {
  text: string;
}

const BtnSubmitDashboard: React.FC<BtnSubmitDashboardProps> = ({ text }) => {
  return (
    // Contenedor principal del botón con clase personalizada 'btn_dashboard'
    <div className="btn_dashboard">
      <button type="submit">
        <IconSVG name="IconGuardar" />
        <span>{text}</span>
      </button>
    </div>
  );
};

export default BtnSubmitDashboard;
