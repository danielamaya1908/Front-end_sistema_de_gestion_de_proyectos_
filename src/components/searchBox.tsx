import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CheckBox from './checkbox';
import InputDashboard from './inputDashboard';

type Aprendiz = {
  id: string;
  name: string;
};

type SearchBoxProps = {
  formData: {
    developers: string[];
  };
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const SearchBox: React.FC<SearchBoxProps> = ({ formData, handleCheckboxChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [apiData, setApiData] = useState<Aprendiz[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const token = localStorage.getItem('token');
  const API_URL = 'https://back-endsistemadegestiondeproyectos-production.up.railway.app/api/users/getAll';

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(API_URL, {
          headers: {
            'session_token': token ?? '',
            'Content-Type': 'application/json',
          },
          params: {
            role: 'developer',
          },
        })
        .then((response) => {
          const rawData = response.data?.data;

          if (!Array.isArray(rawData)) {
            console.error('Error: La propiedad "users" no es un array:', rawData);
            return;
          }

          const cleanedData = rawData.map((item: any) => ({
            id: item._id,
            name: item.name,
          }));

          setApiData(cleanedData);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    };

    fetchData();

    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setTimeout(() => {
          setSearchTerm('');
        }, 200); // Tiempo ligeramente mayor para evitar interferencias
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = apiData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  return (
    <div className="modal_form_cont">
      <h4>Lista de developers</h4>

      {/* ⬇️ Mueve el wrapperRef aquí */}
      <div ref={wrapperRef}>
        <div className="modal_form_item">
          <InputDashboard
            type="text"
            name="searchDevelopers"
            placeholder="Buscar Developers"
            aria-label="Buscar Developers"
            aria-describedby="button-addon2"
            value={searchTerm}
            onChange={handleSearchChange}
            icon="Icon_busqueda_talentic"
          />
        </div>

        <div className="aprendices-list-dash">
          {searchTerm ? (
            filteredData.length > 0 ? (
              filteredData.map((item) => (
                <CheckBox
                  key={item.id}
                  name="developers"
                  value={item.id}
                  icon="bx-lock-alt"
                  userName={item.name}
                  description="Desarrollador"
                  checked={formData.developers.includes(item.id)}
                  handleCheckboxChange={handleCheckboxChange}
                />
              ))
            ) : (
              <div id="no-results-dos">developer no encontrado</div>
            )
          ) : null}
        </div>
      </div>

      <div className="list_aprendices_autores">
        {formData.developers.length > 0 ? (
          formData.developers.map((id) => {
            const selectedItem = apiData.find((item) => item.id === id);
            return selectedItem ? (
              <CheckBox
                key={selectedItem.id}
                name="developers"
                value={selectedItem.id}
                icon="bx-lock-alt"
                userName={selectedItem.name}
                description="Desarrollador"
                checked={true}
                handleCheckboxChange={handleCheckboxChange}
              />
            ) : null;
          })
        ) : (
          <div id="no-results-dos">No hay developers seleccionados</div>
        )}
      </div>
    </div>
  );
};

export default SearchBox;
