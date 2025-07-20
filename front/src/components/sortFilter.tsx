import React from 'react';

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface SortFilterProps {
  sortConfig: SortConfig;
  onSortChange: (value: string) => void;
}

const SortFilter: React.FC<SortFilterProps> = ({ sortConfig, onSortChange }) => {
  return (
    <div className='filtros_ordenar'>
      <span>Ordenar:</span>
      <select
        value={`${sortConfig.key}${sortConfig.direction === 'asc' ? 'Asc' : 'Desc'}`}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value='fechaDesc'>Últimos</option>
        <option value='fechaAsc'>Antiguos</option>
        <option value='nombreAsc'>Nombre A-Z</option>
        <option value='nombreDesc'>Nombre Z-A</option>
      </select>
    </div>
  );
};

export default SortFilter;
