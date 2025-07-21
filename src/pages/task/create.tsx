import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { toast } from "react-toastify";
import axios from "axios";

import BtnSubmitDashboard from "../../components/btnSubmitDashboard";
import TextareaDashboard from "../../components/textareaDashboard";
import SelectDashboard from "../../components/selectDashboard";
import InputDashboard from "../../components/inputDashboard";
import SelectDashboardApi from "../../components/selectDashboardApi";

interface CreateProps {
  onSubmitState: (success: boolean) => void;
  id_default: string;
}

interface TaskFormData {
  title: string;
  description: string;
  status: string;
  priority: string;
  projectId: string;
  assignedTo: string;
  estimatedHours: number;
  dueDate: string;
}

const Create: React.FC<CreateProps> = ({ onSubmitState, id_default }) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    status: "",
    priority: "",
    projectId: id_default,
    assignedTo: "",
    estimatedHours: 0,
    dueDate: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const USERS_API_URL =
    "https://back-endsistemadegestiondeproyectos-production.up.railway.app/api/users/getAll";
  const PROJECTS_API_URL =
    "https://back-endsistemadegestiondeproyectos-production.up.railway.app/api/projects/getAll";

  const validateForm = () => {
    return (
      formData.title &&
      formData.description &&
      formData.status &&
      formData.priority &&
      formData.projectId &&
      formData.assignedTo &&
      formData.estimatedHours > 0 &&
      formData.dueDate
    );
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === "estimatedHours" ? Number(value) : value,
    }));
  };

  const priorityOptions = [
    { key: "low", value: "low" },
    { key: "medium", value: "medium" },
    { key: "high", value: "high" },
  ];

  const statusOptions = [
    { key: "todo", value: "todo" },
    { key: "in_progress", value: "in_progress" },
    { key: "review", value: "review" },
    { key: "done", value: "done" },
  ];

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Por favor, complete todos los campos requeridos");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Token de sesión no encontrado. Por favor inicie sesión.");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Enviando datos:", formData);
      console.log("Token:", token);

      const response = await axios.post(
        "https://back-endsistemadegestiondeproyectos-production.up.railway.app/api/tasks/create",
        {
          title: formData.title,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          projectId: formData.projectId,
          assignedTo: formData.assignedTo,
          estimatedHours: formData.estimatedHours,
          dueDate: formData.dueDate,
        },
        {
          headers: {
            "Content-Type": "application/json",
            session_token: token, // Usando exactamente el header que necesitas
          },
        }
      );

      console.log("Respuesta del servidor:", response.data);

      setFormData({
        title: "",
        description: "",
        status: "",
        priority: "",
        projectId: id_default,
        assignedTo: "",
        estimatedHours: 0,
        dueDate: "",
      });

      onSubmitState(true);
      toast.success("Tarea creada exitosamente");
    } catch (error) {
      console.error("Error al crear tarea:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Sesión expirada. Por favor inicie sesión nuevamente.");
        } else {
          toast.error(
            error.response?.data?.message || "Error al crear la tarea"
          );
        }
      } else {
        toast.error("Error desconocido al crear la tarea");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal_user_content">
      <form className="modal_form" method="POST" onSubmit={handleCreate}>
        <div className="modal_form_item">
          <InputDashboard
            name="title"
            label="Título"
            placeholder="Título de la tarea"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="modal_form_item">
          <SelectDashboard
            label="Prioridad"
            name="priority"
            options={priorityOptions}
            onSelectChange={handleChange}
            defaultOption="Selecciona una prioridad"
            value={formData.priority}
            icon="IconTareas"
            required
          />
        </div>
        <div className="modal_form_item">
          <SelectDashboard
            label="Estado"
            name="status"
            options={statusOptions}
            onSelectChange={handleChange}
            defaultOption="Selecciona un estado"
            value={formData.status}
            icon="IconTareas"
            required
          />
        </div>
        <div className="modal_form_item">
          <SelectDashboardApi
            label="Asignar a"
            name="assignedTo"
            apiEndpoint={USERS_API_URL}
            method="GET"
            queryParams={{ role: "developer" }}
            onSelectChange={handleChange}
            defaultOption="Selecciona un usuario"
            value={formData.assignedTo}
            icon="IconUsuarios"
            required
            authToken={localStorage.getItem("token") || ""}
          />
        </div>
        <div className="modal_form_item">
          <InputDashboard
            name="estimatedHours"
            type="number"
            label="Horas estimadas"
            placeholder="Horas estimadas"
            value={formData.estimatedHours.toString()}
            onChange={handleChange}
            min="0"
            step="0.5"
            required
          />
        </div>
        <div className="modal_form_item">
          <InputDashboard
            name="dueDate"
            type="date"
            label="Fecha límite"
            placeholder="Fecha límite"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="modal_form_item">
          <TextareaDashboard
            name="description"
            label="Descripción"
            placeholder="Descripción detallada de la tarea"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <BtnSubmitDashboard
          text={isSubmitting ? "Guardando..." : "Guardar"}
          disabled={isSubmitting}
        />
      </form>
    </div>
  );
};

export default Create;
