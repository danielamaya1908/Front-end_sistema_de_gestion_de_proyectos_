import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

import BtnSubmitDashboard from '../../components/btnSubmitDashboard';
import TextareaDashboard from '../../components/textareaDashboard';
import SelectDashboard from '../../components/selectDashboard';
import InputDashboard from '../../components/inputDashboard';

interface CreateProps {
  onSubmitState: (success: boolean) => void;
}

interface RoleFormData {
  name: string;
  description: string;
}

const Create: React.FC<CreateProps> = ({ onSubmitState }) => {
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    description: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const priorityOptions = [
    { key: 'low', value: 'low' },
    { key: 'medium', value: 'medium' },
    { key: 'high', value: 'high' }
  ];
  
  const stausOptions = [
    { key: 'planning', value: 'planning' },
    { key: 'in_progress', value: 'in_progress' },
    { key: 'completed', value: 'completed' },
    { key: 'cancelled', value: 'cancelled' }
  ];

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, description } = formData;

    const requestBody = {
      API: "talentic",
      MODEL: "talentic",
      RESOURCE: "roles",
      key: "5b8d3b1f084b01c6a8387459e80d4bb9",
      TYPE: "PUT",
      name,
      description
    };

    try {
      await axios.post('http://217.15.168.117:8080/api/', requestBody);
      setFormData({ name: '', description: '' });
      onSubmitState(true);
    } catch (error) {
      console.error('Error creating data:', error);
      toast.error('Hubo un error al crear. Por favor, inténtelo de nuevo.');
    }
  };

  return (
    <div className="modal_user_content">
      <form className="modal_form" method="POST" onSubmit={handleCreate}>
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
        <div className='modal_form_item'>
          <SelectDashboard
            label="Prioridad"
            name="priority"
            options={priorityOptions}
            onSelectChange={handleChange}
            defaultOption="Selecciona una prioridad"
            value={formData.name}
            icon="IconProyectos"
          />
        </div>
        <div className='modal_form_item'>
          <SelectDashboard
            label="Estado"
            name="status"
            options={stausOptions}
            onSelectChange={handleChange}
            defaultOption="Selecciona un estado"
            value={formData.name}
            icon="IconProyectos"
          />
        </div>
        <div className="modal_form_item">
          <InputDashboard
            name="startDate"
            type="date"
            label="Fecha Incio"
            placeholder="Fecha Incio"
            value={formData.name}
            onChange={handleChange}
            colClassName=""
          />
        </div>
        <div className="modal_form_item">
          <InputDashboard
            name="endDate"
            type="date"
            label="Fecha Final"
            placeholder="Fecha Final"
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

export default Create;
