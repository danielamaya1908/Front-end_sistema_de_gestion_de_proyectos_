import React, { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { toast } from "react-toastify";
import axios from "axios";

import BtnSubmitDashboard from "../../components/btnSubmitDashboard";
import InputDashboard from "../../components/inputDashboard";
import TextareaDashboard from "../../components/textareaDashboard";
import SelectDashboard from "../../components/selectDashboard";
import SelectDashboardApi from "../../components/selectDashboardApi";

interface UpdateProps {
  onUPSubmitState: (success: boolean) => void;
  idDefault: string;
  nameDefault: string;
  descriptionDefault: string;
  stateDefault: string;
  priorityDefault: string;
  projectIdDefault: string;
  assignedToDefault: {
    _id: string;
    name: string;
    email: string;
  };
  estimatedHoursDefault: number;
  actualHoursDefault: number;
  dueDateDefault: string;
}

interface FormData {
  id: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  projectId: string;
  assignedTo: string;
  estimatedHours: number;
  actualHours: number;
  dueDate: string;
}

const Update: React.FC<UpdateProps> = ({
  onUPSubmitState,
  idDefault,
  nameDefault,
  descriptionDefault,
  stateDefault,
  priorityDefault,
  projectIdDefault,
  assignedToDefault,
  estimatedHoursDefault,
  actualHoursDefault,
  dueDateDefault,
}) => {
  const [formData, setFormData] = useState<FormData>({
    id: idDefault,
    name: nameDefault,
    description: descriptionDefault,
    status: stateDefault,
    priority: priorityDefault,
    projectId: projectIdDefault,
    assignedTo: assignedToDefault?._id || "",
    estimatedHours: estimatedHoursDefault,
    actualHours: actualHoursDefault,
    dueDate: dueDateDefault,
  });

  useEffect(() => {
    const initialData = {
      id: idDefault,
      name: nameDefault,
      description: descriptionDefault,
      status: stateDefault,
      priority: priorityDefault,
      projectId: projectIdDefault,
      assignedTo: assignedToDefault?._id || "",
      estimatedHours: estimatedHoursDefault,
      actualHours: actualHoursDefault,
      dueDate: dueDateDefault,
    };

    console.log("🎯 INICIALIZANDO COMPONENTE UPDATE:");
    console.log("Props recibidas:", {
      idDefault,
      nameDefault,
      descriptionDefault,
      stateDefault,
      priorityDefault,
      projectIdDefault,
      assignedToDefault,
      estimatedHoursDefault,
      actualHoursDefault,
      dueDateDefault,
    });
    console.log("📋 DATOS INICIALES DEL FORMULARIO:");
    console.log(JSON.stringify(initialData, null, 2));

    setFormData(initialData);
  }, [
    idDefault,
    nameDefault,
    descriptionDefault,
    stateDefault,
    priorityDefault,
    projectIdDefault,
    assignedToDefault,
    estimatedHoursDefault,
    actualHoursDefault,
    dueDateDefault,
  ]);

  const API_URL_PUT =
    "https://back-endsistemadegestiondeproyectos-production.up.railway.app/api/tasks/put";
  const API_URL_USERS =
    "https://back-endsistemadegestiondeproyectos-production.up.railway.app/api/users/getAll";
  const token = localStorage.getItem("token");

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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const processedValue =
      name === "estimatedHours" || name === "actualHours"
        ? Number(value)
        : value;

    console.log("📝 CAMBIO EN FORMULARIO:");
    console.log(`Campo: ${name}`);
    console.log(`Valor original: "${value}"`);
    console.log(`Valor procesado: ${processedValue}`);
    console.log("Tipo:", typeof processedValue);

    setFormData((prevState) => {
      const newState = {
        ...prevState,
        [name]: processedValue,
      };

      console.log("🔄 ESTADO ACTUALIZADO DEL FORMULARIO:");
      console.log(JSON.stringify(newState, null, 2));

      return newState;
    });
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      id,
      name,
      description,
      status,
      priority,
      projectId,
      assignedTo,
      estimatedHours,
      actualHours,
      dueDate,
    } = formData;

    const requestBody = {
      taskId: id, // ✅ CAMBIO: usar 'taskId' en lugar de 'id'
      title: name, // La API espera 'title' en lugar de 'name'
      description: description,
      status: status,
      priority: priority,
      projectId: projectId,
      assignedTo: assignedTo,
      estimatedHours: estimatedHours,
      actualHours: actualHours,
      dueDate: dueDate,
    };

    console.log("📤 DATOS QUE SE ENVÍAN AL BACKEND:");
    console.log("URL:", API_URL_PUT);
    console.log("Method: PUT");
    console.log("Headers:", {
      session_token: token ?? "",
      "Content-Type": "application/json",
    });
    console.log("Request Body:", JSON.stringify(requestBody, null, 2));

    try {
      console.log("🚀 Enviando petición PUT...");

      const response = await axios.put(API_URL_PUT, requestBody, {
        headers: {
          session_token: token ?? "",
          "Content-Type": "application/json",
        },
      });

      console.log("✅ RESPUESTA EXITOSA DEL BACKEND:");
      console.log("Status:", response.status);
      console.log("Status Text:", response.statusText);
      console.log("Response Data:", JSON.stringify(response.data, null, 2));
      console.log("Response Headers:", response.headers);

      onUPSubmitState(true);
    } catch (error: any) {
      console.error("❌ ERROR AL ACTUALIZAR TAREA:");
      console.error("Error completo:", error);

      if (error.response) {
        console.error("📥 RESPUESTA DE ERROR DEL BACKEND:");
        console.error("Status:", error.response.status);
        console.error("Status Text:", error.response.statusText);
        console.error(
          "Error Data:",
          JSON.stringify(error.response.data, null, 2)
        );
        console.error("Error Headers:", error.response.headers);
        console.error("🔍 LO QUE EL BACKEND ESPERABA VS LO QUE RECIBIÓ:");
        console.error("- Enviamos:", JSON.stringify(requestBody, null, 2));
        console.error(
          "- Backend respondió con error:",
          error.response.data?.message || "Sin mensaje específico"
        );
      } else if (error.request) {
        console.error("📡 ERROR DE CONEXIÓN - No hubo respuesta del servidor:");
        console.error("Request:", error.request);
      } else {
        console.error("⚙️ ERROR DE CONFIGURACIÓN:");
        console.error("Message:", error.message);
      }

      toast.error("Hubo un error al editar. Por favor, inténtelo de nuevo.");
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
          <SelectDashboard
            label="Prioridad"
            name="priority"
            options={priorityOptions}
            onSelectChange={handleChange}
            defaultOption="Selecciona una prioridad"
            value={formData.priority}
            icon="IconTareas"
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
          />
        </div>
        <div className="modal_form_item">
          <SelectDashboardApi
            label="Asignado a"
            name="assignedTo"
            apiEndpoint={API_URL_USERS}
            method="GET"
            queryParams={{ role: "developer" }}
            onSelectChange={handleChange}
            defaultOption="Selecciona un Usuario"
            value={formData.assignedTo}
            icon="IconUsuarios"
          />
        </div>
        <div className="modal_form_item">
          <InputDashboard
            name="estimatedHours"
            type="number"
            label="Horas Estimadas"
            placeholder="Horas Estimadas"
            value={formData.estimatedHours.toString()}
            onChange={handleChange}
            colClassName=""
          />
        </div>
        <div className="modal_form_item">
          <InputDashboard
            name="actualHours"
            type="number"
            label="Horas Actuales"
            placeholder="Horas Actuales"
            value={formData.actualHours.toString()}
            onChange={handleChange}
            colClassName=""
          />
        </div>
        <div className="modal_form_item">
          <InputDashboard
            name="dueDate"
            type="date"
            label="Fecha de Vencimiento"
            placeholder="Fecha de Vencimiento"
            value={formData.dueDate}
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
