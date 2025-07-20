import React from 'react';
import type { ChangeEvent, ReactNode } from 'react';
import SeacrhInput from './searchInput';

interface SeacrhDataProps {
  searchTerm: string;
  handleSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  btnCreate?: ReactNode;
}

const SeacrhData: React.FC<SeacrhDataProps> = ({
  searchTerm,
  handleSearchChange,
  btnCreate
}) => {
  return (
    <div className="buscar_data">
      <SeacrhInput
        name="search"
        label="Buscar"
        placeholder="Buscar y filtrar"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      {btnCreate}
    </div>
  );
};

export default SeacrhData;
