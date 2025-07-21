import React, { useState, useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';
import type { MutableRefObject, JSX } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import axios from "axios";

import Show from "./show";
import Create from "./create";
import Update from "./update";

import Modal from "../../components/modalDashboard";
import IconSVG from "../../components/icon";
import SeacrhData from "../../components/searchData";

import ViewToggle from "../../components/viewToggle";
import SortFilter from "../../components/sortFilter";

import ListView from "../../components/listView";
import CardView from "../../components/cardView";

interface TaskItem {
  id: string;
  name: string;
  description: string;
  state: string;
  priority: string;
  projectId: {
    _id: string;
    name: string;
  };
  assignedTo: {
    _id: string;
    name: string;
    email: string;
  };
  estimatedHours: number;
  actualHours: number;
  dueDate: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

// Tipos para el delete
type DeleteType = "soft" | "hard";

// Componente para el modal de eliminación de tareas
const DeleteModal: React.FC<{
  taskName: string;
  onConfirm: (deleteType: DeleteType) => void;
  onCancel: () => void;
}> = ({ taskName, onConfirm, onCancel }) => {
  const [deleteType, setDeleteType] = useState<DeleteType>("soft");

  return (
    <div className="delete-modal-content">
      <div className="mb-3">
        <h5>¿Estás seguro de que deseas eliminar esta tarea?</h5>
        <p>
          <strong>Tarea:</strong> {taskName}
        </p>
      </div>

      <div className="mb-3">
        <label htmlFor="deleteType" className="form-label">
          Tipo de eliminación:
        </label>
        <select
          id="deleteType"
          className="form-select"
          value={deleteType}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "soft" || value === "hard") {
              setDeleteType(value);
            }
          }}
        >
          <option value="soft">Eliminación suave (soft)</option>
          <option value="hard">Eliminación permanente (hard)</option>
        </select>
        <div className="form-text">
          {deleteType === "soft"
            ? "La tarea será desactivada pero sus datos se mantendrán en la base de datos."
            : "La tarea será eliminada permanentemente de la base de datos. Esta acción no se puede deshacer."}
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button
          type="button"
          className={`btn ${
            deleteType === "hard" ? "btn-danger" : "btn-warning"
          }`}
          onClick={() => onConfirm(deleteType)}
        >
          {deleteType === "hard"
            ? "Eliminar permanentemente"
            : "Desactivar tarea"}
        </button>
      </div>
    </div>
  );
};

const Tasks: React.FC = () => {
  const [apiData, setApiData] = useState<TaskItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const location = useLocation();
  const { id_proyect } = location.state || {};

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const [activeMenuActions, setActiveMenuActions] = useState<string | null>(
    null
  );
  const menuRef: MutableRefObject<HTMLUListElement | null> = useRef(null);
  const [viewType, setViewType] = useState<"cards" | "list">("cards");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "dateCreation",
    direction: "desc",
  });

  const token = localStorage.getItem("token");

  const showCards = () => setViewType("cards");
  const showList = () => setViewType("list");

  const API_URL =
    "https://back-endsistemadegestiondeproyectos-production.up.railway.app/api/tasks/get-by-project";
  const DELETE_API_URL =
    "https://back-endsistemadegestiondeproyectos-production.up.railway.app/api/tasks/delete";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        event.target instanceof Node &&
        !menuRef.current.contains(event.target)
      ) {
        setActiveMenuActions(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSort = (value: string) => {
    let key: string;
    let direction: "asc" | "desc";

    switch (value) {
      case "fechaDesc":
        key = "dateCreation";
        direction = "desc";
        break;
      case "fechaAsc":
        key = "dateCreation";
        direction = "asc";
        break;
      case "nombreAsc":
        key = "name";
        direction = "asc";
        break;
      case "nombreDesc":
        key = "name";
        direction = "desc";
        break;
      case "descripcionAsc":
        key = "description";
        direction = "asc";
        break;
      case "descripcionDesc":
        key = "description";
        direction = "desc";
        break;
      case "estadoAsc":
        key = "state";
        direction = "asc";
        break;
      case "estadoDesc":
        key = "state";
        direction = "desc";
        break;
      default:
        return;
    }

    setSortConfig({ key, direction });
  };

  const toggleMenuActions = (menuName: string | number) => {
    const id = String(menuName);
    setActiveMenuActions((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get(API_URL, {
        headers: {
          session_token: token,
          "Content-Type": "application/json",
        },
        params: {
          projectId: id_proyect,
        },
      })
      .then((response) => {
        const rawData = response.data?.data;

        if (!Array.isArray(rawData)) {
          console.error('Error: La propiedad "data" no es un array:', rawData);
          return;
        }

        const cleanedData = rawData.map((item: any) => ({
          id: item._id,
          name: item.title,
          description: item.description,
          state: item.status,
          priority: item.priority,
          projectId: item.projectId,
          assignedTo: item.assignedTo,
          estimatedHours: item.estimatedHours,
          actualHours: item.actualHours,
          dueDate: item.dueDate,
          createdBy: item.createdBy,
          createdAt: item.createdAt,
        }));

        setApiData(cleanedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        console.log(id_proyect)
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const handleChangecrear = () => {
    toast.success("Se gestionaron los datos con éxito");
    setIsModalOpen(false);
    setModalContent(null);
    fetchData();
  };

  const handleChangeeditar = () => {
    toast.success("Se editaron los datos con éxito");
    setIsModalOpen(false);
    fetchData();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredData = apiData.filter(
    (item) =>
      (item.name || "").toLowerCase().includes(searchTerm) ||
      (item.description || "").toLowerCase().includes(searchTerm) ||
      (item.state || "").toLowerCase().includes(searchTerm) ||
      (item.priority || "").toLowerCase().includes(searchTerm) ||
      (item.projectId?.name || "").toLowerCase().includes(searchTerm) ||
      (item.assignedTo?.name || "").toLowerCase().includes(searchTerm)
  );

  // Función para manejar la eliminación con el tipo seleccionado
  const executeDelete = (taskId: string, deleteType: DeleteType) => {
    const requestBody = {
      taskId: taskId,
      deleteType: deleteType,
    };

    console.log("🗑️ Eliminando tarea:", requestBody);

    axios
      .delete(DELETE_API_URL, {
        headers: {
          session_token: token,
          "Content-Type": "application/json",
        },
        data: requestBody,
      })
      .then(() => {
        const message =
          deleteType === "hard"
            ? "Tarea eliminada permanentemente con éxito"
            : "Tarea desactivada con éxito";
        toast.success(message);
        closeModal();
        fetchData();
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
        console.error("Error response:", error.response?.data);
        toast.error("Error al eliminar la tarea");
        closeModal();
      });
  };

  // Función para abrir el modal de eliminación
  const handleDelete = (taskId: string, taskName: string) => {
    setIsModalOpen(true);
    setModalContent(
      <DeleteModal
        taskName={taskName}
        onConfirm={(deleteType) => executeDelete(taskId, deleteType)}
        onCancel={closeModal}
      />
    );
  };

  const handleCreateClick = (FormComponent: React.ElementType) => {
    setIsModalOpen(true);
    setModalContent(<FormComponent onSubmitState={handleChangecrear} />);
  };

  const handleEditClick = (
    FormComponent: React.ElementType,
    item: TaskItem
  ) => {
    setIsModalOpen(true);
    setModalContent(
      <FormComponent
        onUPSubmitState={handleChangeeditar}
        idDefault={item.id}
        nameDefault={item.name}
        descriptionDefault={item.description}
        stateDefault={item.state}
        priorityDefault={item.priority}
        projectIdDefault={item.projectId}
        assignedToDefault={item.assignedTo}
        estimatedHoursDefault={item.estimatedHours}
        actualHoursDefault={item.actualHours}
        dueDateDefault={item.dueDate}
      />
    );
  };

  const handleShowClick = (
    FormComponent: React.ElementType,
    item: TaskItem
  ) => {
    setIsModalOpen(true);
    setModalContent(
      <FormComponent
        onUPSubmitState={handleChangeeditar}
        nameDefault={item.name}
        descriptionDefault={item.description}
        stateDefault={item.state}
        priorityDefault={item.priority}
        projectIdDefault={item.projectId}
        assignedToDefault={item.assignedTo}
        estimatedHoursDefault={item.estimatedHours}
        actualHoursDefault={item.actualHours}
        dueDateDefault={item.dueDate}
        createdByDefault={item.createdBy}
        createdAtDefault={item.createdAt}
      />
    );
  };

  const actionMenuProps = (item: { id: string | number }) => {
    const realItem = apiData.find((i) => String(i.id) === String(item.id));

    if (!realItem) {
      console.warn("Item no encontrado para el menú:", item.id);
      return { isActive: false, onClose: () => {}, actions: [] };
    }

    const isActive = String(activeMenuActions) === String(realItem.id);

    return {
      isActive,
      onClose: () => setActiveMenuActions(null),
      actions: [
        {
          label: "Ver",
          icon: "IconVer",
          onClick: () => handleShowClick(Show, realItem),
        },
        {
          label: "Editar",
          icon: "IconEditar",
          onClick: () => handleEditClick(Update, realItem),
          className: "menu_acciones_editar",
        },
        {
          label: "Eliminar",
          icon: "IconEliminar",
          onClick: () => handleDelete(realItem.id, realItem.name),
          className: "menu_acciones_eliminar",
        },
      ],
    };
  };

  return (
    <div className="dashboard_content">
      <main className="main__dashboard_content">
        <div className="form_content">
          <section className="dashboard_titulo">
            <h2>Tareas</h2>
          </section>
          <div className="main__dashboard_primera_parte">
            <div
              className="btn_nuevo_dashboard"
              onClick={() => handleCreateClick(Create)}
            >
              <IconSVG name="Icon_mas_talentic" /> Crear Nueva Tarea
            </div>
          </div>
          <div className="form_content_dashboard">
            <div className="filters_dashboard">
              <div className="buscador_dashboard">
                <SeacrhData
                  searchTerm={searchTerm}
                  handleSearchChange={handleSearchChange}
                />
              </div>
              <div className="filtros_content_dashboard">
                <SortFilter sortConfig={sortConfig} onSortChange={handleSort} />
                <ViewToggle
                  viewType={viewType}
                  showCards={showCards}
                  showList={showList}
                />
              </div>
            </div>
            {viewType === "cards" ? (
              <div className="layout_cards">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <CardView
                      key={item.id}
                      titulo={item.name}
                      subtitulo={`${item.description} | Proyecto: ${
                        item.projectId?.name || "Sin proyecto"
                      }`}
                      parrafo={`Estado: ${item.state} | Prioridad: ${
                        item.priority
                      } | Asignado a: ${
                        item.assignedTo?.name || "Sin asignar"
                      }`}
                      actionMenuProps={actionMenuProps}
                      item={item}
                      toggleMenuActions={toggleMenuActions}
                      svg="IconTareas"
                    />
                  ))
                ) : (
                  <p>No se encontraron registros</p>
                )}
              </div>
            ) : (
              <div className="layout_list_dashboard">
                <table>
                  <thead>
                    <tr>
                      <th onClick={() => handleSort("nombreAsc")}>
                        <h4>
                          Tarea
                          <IconSVG name="IconFlechas" />
                        </h4>
                      </th>
                      <th>
                        <h4>Proyecto</h4>
                      </th>
                      <th>
                        <h4>Asignado a</h4>
                      </th>
                      <th>
                        <h4>Estado</h4>
                      </th>
                      <th>
                        <h4>Prioridad</h4>
                      </th>
                      <th>
                        <h4>Acciones</h4>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((item) => (
                        <ListView
                          key={item.id}
                          titulo={item.name}
                          subtitulo={item.projectId?.name || "Sin proyecto"}
                          parrafo={`${
                            item.assignedTo?.name || "Sin asignar"
                          } | ${item.state} | ${item.priority}`}
                          actionMenuProps={actionMenuProps}
                          item={item}
                          toggleMenuActions={toggleMenuActions}
                          svg="IconTareas"
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6}>No se encontraron registros</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
      <Modal isOpen={isModalOpen} onClose={closeModal} titulo={"Tareas"}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default Tasks;
