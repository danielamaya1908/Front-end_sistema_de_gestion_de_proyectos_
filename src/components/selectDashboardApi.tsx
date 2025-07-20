import React, { useState, useEffect, forwardRef } from 'react';
import axios from 'axios';
import IconSVG from './icon';

type Option = {
  key: string | number;
  value: string;
};

type SelectDashboardProps = {
  label: string;
  name: string;
  apiEndpoint: string;
  requestBody: any;
  onSelectChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  defaultOption: string;
  value: string | number;
  className?: string;
  icon: string;
};

const SelectDashboard = forwardRef<HTMLSelectElement, SelectDashboardProps>(({
  label,
  name,
  apiEndpoint,
  requestBody,
  onSelectChange,
  defaultOption,
  value,
  className,
  icon
}, ref) => {
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    axios.post(apiEndpoint, requestBody)
      .then(response => {
        setOptions(response.data);
      })
      .catch(error => {
        console.error('Error al cargar las opciones:', error);
      });
  }, [apiEndpoint, requestBody]);

  return (
    <div className="input_dashboard">
      <label>{label}</label>
      <section className="input_dashboard_content">
        <IconSVG name={icon} />
        <select
          ref={ref}
          name={name}
          className={`required ${className ?? ''}`}
          data-required={`Debe seleccionar un ${label}`}
          onChange={onSelectChange}
          value={value}
        >
          <option value="">{defaultOption}</option>
          {options && options.length > 0 ? (
            options.map(option => (
              <option key={option.key} value={option.key}>
                {option.value}
              </option>
            ))
          ) : (
            <option value="">Sin opciones disponibles</option>
          )}
        </select>
      </section>
    </div>
  );
});

export default SelectDashboard;
