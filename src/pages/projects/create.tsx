import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

import BtnSubmitDashboard from '../../components/btnSubmitDashboard';
import TextareaDashboard from '../../components/textareaDashboard';
import SelectDashboard from '../../components/selectDashboard';
import InputDashboard from '../../components/inputDashboard';
import DeveloperSelector from '../../components/searchBox';
import SelectDashboardApi from '../../components/selectDashboardApi';

interface CreateProps {
  onSubmitState: (success: boolean) => void;
}

interface RoleFormData {
  name: string;
  description: string;
  status: string;
  priority: string;
  startDate: string;
  endDate: string;
  managerId: string;
  developers: string[];
}

const Create: React.FC<CreateProps> = ({ onSubmitState }) => {
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    description: '',
    status: '',
    priority: '',
    startDate: '',
    endDate: '',
    managerId: '',
    developers: [],
  });
  
  const API_URL = 'https://back-endsistemadegestiondeproyectos-production.up.railway.app/api/users/getAll';
  const API_URL_POST = 'https://back-endsistemadegestiondeproyectos-production.up.railway.app/api/projects/create';
  const token = localStorage.getItem('token');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCheckboxChangeAprendiz = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target;

    setFormData(prevState => {
      const developers = checked
        ? [...prevState.developers, value]
        : prevState.developers.filter(dataId => dataId !== value);

      return { ...prevState, developers };
    });
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
    const { name, description, status, priority, startDate, endDate, managerId, developers } = formData;

    const requestBody = {
      name: name,
      description: description,
      status:status,
      priority: priority,
      startDate: startDate,
      endDate: endDate,
      managerId: managerId,
      developersIds: developers
    };

    try {
      await axios.post(API_URL_POST, requestBody, {
        headers: {
          'session_token': token ?? '',
          'Content-Type': 'application/json',
        },
      });
      setFormData({ 
        name: '',
        description: '',
        status: '',
        priority: '',
        startDate: '',
        endDate: '',
        managerId: '',
        developers: [],
       });
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
            value={formData.priority}
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
            value={formData.status}
            icon="IconProyectos"
          />
        </div>
        <div className='modal_form_item'>
          <SelectDashboardApi
            label="Manager"
            name="managerId"
            apiEndpoint={API_URL}
            method="GET"
            queryParams={{ role: 'manager' }}
            onSelectChange={handleChange}
            defaultOption="Selecciona un Manager"
            value={formData.managerId}
            icon="IconProyectos"
          />
        </div>
        <div className="modal_form_item">
          <InputDashboard
            name="startDate"
            type="date"
            label="Fecha Incio"
            placeholder="Fecha Incio"
            value={formData.startDate}
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
            value={formData.endDate}
            onChange={handleChange}
            colClassName=""
          />
        </div>
        <DeveloperSelector
          formData={formData}
          handleCheckboxChange={handleCheckboxChangeAprendiz}
        />
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
