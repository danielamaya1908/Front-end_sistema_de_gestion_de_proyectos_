import React, { useState, useEffect, forwardRef } from 'react';
import axios from 'axios';
import IconSVG from './icon';

type Option = {
  _id: string | number;
  name: string;
};

type HttpMethod = 'GET' | 'POST';

type SelectDashboardProps = {
  label: string;
  name: string;
  apiEndpoint: string;
  method?: HttpMethod; // default: GET
  queryParams?: Record<string, string>;
  requestBody?: any;
  onSelectChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  defaultOption: string;
  value: string | number;
  className?: string;
  icon: string;
};

const SelectDashboardApi = forwardRef<HTMLSelectElement, SelectDashboardProps>(({
  label,
  name,
  apiEndpoint,
  method = 'GET', // Default to GET if not provided
  queryParams,
  requestBody,
  onSelectChange,
  defaultOption,
  value,
  className,
  icon
}, ref) => {
  const [options, setOptions] = useState<Option[]>([]);

useEffect(() => {
  const fetchOptions = async () => {
    const token = localStorage.getItem('token');

    const config = {
      headers: {
        'session_token': token ?? '',
        'Content-Type': 'application/json'
      },
      params: queryParams || {} // solo se usa en GET
    };

    try {


      const response = method === 'POST'
        ? await axios.post(apiEndpoint, requestBody || {}, config)
        : await axios.get(apiEndpoint, config);

      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data.data)
          ? response.data.data
          : [];

          console.log(response);

      setOptions(data);
    } catch (error) {
      console.error('Error al cargar las opciones:', error);
    }
  };

  fetchOptions();
}, [apiEndpoint, method, JSON.stringify(requestBody), JSON.stringify(queryParams)]);

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
          {options.length > 0 ? (
            console.log(options),
            options.map(option => (
              <option key={option._id} value={option._id}>
                {option.name}
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

export default SelectDashboardApi;
