import React, { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

import BtnSubmitDashboard from '../../components/btnSubmitDashboard';
import InputDashboard from '../../components/inputDashboard';
import TextareaDashboard from '../../components/textareaDashboard';

interface UpdateProps {
  onUPSubmitState: (success: boolean) => void;
  idDefault: number;
  nameDefault: string;
  descriptionDefault: string;
}

interface FormData {
  id: number;
  name: string;
  description: string;
}

const Update: React.FC<UpdateProps> = ({
  onUPSubmitState,
  idDefault,
  nameDefault,
  descriptionDefault
}) => {
  const [formData, setFormData] = useState<FormData>({
    id: idDefault,
    name: nameDefault,
    description: descriptionDefault,
  });

  useEffect(() => {
    setFormData({
      id: idDefault,
      name: nameDefault,
      description: descriptionDefault,
    });
  }, [idDefault, nameDefault, descriptionDefault]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { id, name, description } = formData;

    const requestBody = {
      API: 'talentic',
      MODEL: 'talentic',
      RESOURCE: 'roles',
      key: '5b8d3b1f084b01c6a8387459e80d4bb9',
      TYPE: 'UPDATE',
      id,
      name,
      description,
    };

    try {
      await axios.post('http://217.15.168.117:8080/api/', requestBody);
      onUPSubmitState(true);
    } catch (error) {
      toast.error('Hubo un error al editar. Por favor, inténtelo de nuevo.');
    }
  };

  return (
    <div className="modal_user_content">
      <form className="modal_form" method="POST" onSubmit={handleUpdate}>
        <div className="modal_form_item">
          <InputDashboard
            name="name"
            label="Nombre"
            placeholder="nombre"
            value={formData.name}
            onChange={handleChange}
            colClassName=""
          />
        </div>
        <div className="modal_form_item">
          <TextareaDashboard
            name="description"
            label="Descripción"
            placeholder="descripción"
            value={formData.description}
            onChange={handleChange}
            colClassName=""
          />
        </div>
        <BtnSubmitDashboard text="Guardar" />
      </form>
    </div>
  );
};

export default Update;
