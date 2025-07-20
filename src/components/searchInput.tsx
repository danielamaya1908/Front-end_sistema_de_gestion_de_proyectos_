import React from 'react';
import type { ChangeEvent } from 'react';
import IconSVG from './icon';

interface SeacrhInputProps {
  type?: string;
  name?: string;
  value: string;
  placeholder?: string;
  label?: string;
  colClassName?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const SeacrhInput: React.FC<SeacrhInputProps> = ({
  type = 'text',
  name = 'name',
  value,
  placeholder = 'nombre',
  colClassName = '',
  onChange
}) => {
  return (
    <div className={`${colClassName}`}>
      <div className="section_dashboard_buscador">
        <IconSVG name="IconBusqueda" />
        <input
          type={type}
          className=""
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default SeacrhInput;
