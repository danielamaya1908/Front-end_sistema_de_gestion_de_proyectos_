import React, { useState, useEffect, useRef } from "react";
import type { MutableRefObject, JSX } from "react";
import { useNavigate } from 'react-router-dom'; 

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

interface ProyectItem {
  id: number;
  name: string;
  description: string;
  status: string;
  priority: string;
  startDate: string;
  endDate: string;
  managerId: string;
  developers: string[];
}

interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

// Tipos para el delete
type DeleteType = "soft" | "hard";

// Componente para el modal de eliminación de proyectos
const DeleteModal: React.FC<{
  projectName: string;
  onConfirm: (deleteType: DeleteType) => void;
  onCancel: () => void;
}> = ({ projectName, onConfirm, onCancel }) => {
  const [deleteType, setDeleteType] = useState<DeleteType>("soft");

  return (
    <div className="delete-modal-content">
      <div className="mb-3">
        <h5>¿Estás seguro de que deseas eliminar este proyecto?</h5>
        <p>
          <strong>Proyecto:</strong> {projectName}
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
            ? "El proyecto será desactivado pero sus datos se mantendrán en la base de datos."
            : "El proyecto será eliminado permanentemente de la base de datos. Esta acción no se puede deshacer."}
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
            : "Desactivar proyecto"}
        </button>
      </div>
    </div>
  );
};

const Projects: React.FC = () => {
  const [apiData, setApiData] = useState<ProyectItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const navigate = useNavigate();

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
    "https://back-endsistemadegestiondeproyectos-production.up.railway.app/api/projects/getAll";
  const DELETE_API_URL =
    "https://back-endsistemadegestiondeproyectos-production.up.railway.app/api/projects/delete";

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
        key = "username";
        direction = "asc";
        break;
      case "nombreDesc":
        key = "username";
        direction = "desc";
        break;
      case "emailAsc":
        key = "email";
        direction = "asc";
        break;
      case "emailDesc":
        key = "email";
        direction = "desc";
        break;
      case "tipoAsc":
        key = "type";
        direction = "asc";
        break;
      case "tipoDesc":
        key = "type";
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
        params: {},
      })
      .then((response) => {
        const rawData = response.data?.data;

        if (!Array.isArray(rawData)) {
          console.error('Error: La propiedad "data" no es un array:', rawData);
          return;
        }

        const cleanedData = rawData.map((item: any) => ({
          id: item._id,
          name: item.name,
          description: item.description,
          status: item.status,
          priority: item.priority,
          startDate: item.startDate,
          endDate: item.endDate,
          managerId: item.managerId,
          developers: item.developersIds,
        }));
        setApiData(cleanedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
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
      (item.description || "").toLowerCase().includes(searchTerm)
  );

  // Función para manejar la eliminación con el tipo seleccionado
  const executeDelete = (projectId: string, deleteType: DeleteType) => {
    const requestBody = {
      projectId: projectId,
      deleteType: deleteType,
    };

    console.log("🗑️ Eliminando proyecto:", requestBody);

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
            ? "Proyecto eliminado permanentemente con éxito"
            : "Proyecto desactivado con éxito";
        toast.success(message);
        closeModal();
        fetchData();
      })
      .catch((error) => {
        console.error("Error deleting project:", error);
        console.error("Error response:", error.response?.data);
        toast.error("Error al eliminar el proyecto");
        closeModal();
      });
  };

  // Función para abrir el modal de eliminación
  const handleDelete = (projectId: string, projectName: string) => {
    setIsModalOpen(true);
    setModalContent(
      <DeleteModal
        projectName={projectName}
        onConfirm={(deleteType) => executeDelete(projectId, deleteType)}
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
    id: number,
    name: string,
    description: string,
    status: string,
    priority: string,
    startDate: string,
    endDate: string,
    managerId: string,
    developers: string[]
  ) => {
    setIsModalOpen(true);
    setModalContent(
      <FormComponent
        onUPSubmitState={handleChangeeditar}
        idDefault={id}
        nameDefault={name}
        descriptionDefault={description}
        statusDefault={status}
        priorityDefault={priority}
        startDateDefault={startDate}
        endDateDefault={endDate}
        managerIdDefault={managerId}
        developersDefault={developers}
      />
    );
  };

  const handleShowClick = (
    FormComponent: React.ElementType,
    name: string,
    description: string,
    status: string,
    priority: string,
    startDate: string,
    endDate: string,
    managerId: string,
    developers: string[]
  ) => {
    setIsModalOpen(true);
    setModalContent(
      <FormComponent
        onUPSubmitState={handleChangeeditar}
        nameDefault={name}
        descriptionDefault={description}
        statusDefault={status}
        priorityDefault={priority}
        startDateDefault={startDate}
        endDateDefault={endDate}
        managerIdDefault={managerId}
        developersDefault={developers}
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
    console.log("Acciones para:", realItem.id, "| isActive:", isActive);

    return {
      isActive,
      onClose: () => setActiveMenuActions(null),
      actions: [
        {
          label: 'Tareas',
          icon: 'IconPermisos',
          onClick: () => navigate('/dashboard/allocationTasks', { state: {
              id: item.id
          }}),
        },
        {
          label: "Ver",
          icon: "IconVer",
          onClick: () =>
            handleShowClick(
              Show,
              realItem.name,
              realItem.description,
              realItem.status,
              realItem.priority,
              realItem.startDate,
              realItem.endDate,
              realItem.managerId,
              realItem.developers
            ),
        },
        {
          label: "Editar",
          icon: "IconEditar",
          onClick: () =>
            handleEditClick(
              Update,
              realItem.id,
              realItem.name,
              realItem.description,
              realItem.status,
              realItem.priority,
              realItem.startDate,
              realItem.endDate,
              realItem.managerId,
              realItem.developers
            ),
          className: "menu_acciones_editar",
        },
        {
          label: "Eliminar",
          icon: "IconEliminar",
          onClick: () => handleDelete(String(realItem.id), realItem.name),
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
            <h2>Proyectos</h2>
          </section>
          <div className="main__dashboard_primera_parte">
            <div
              className="btn_nuevo_dashboard"
              onClick={() => handleCreateClick(Create)}
            >
              <IconSVG name="Icon_mas_talentic" /> Crear Nuevo
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
                      subtitulo={item.description}
                      parrafo="2024-08-26 14:01:51"
                      actionMenuProps={actionMenuProps}
                      item={item}
                      toggleMenuActions={toggleMenuActions}
                      svg="IconProyectos"
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
                          Nombre
                          <IconSVG name="IconFlechas" />
                        </h4>
                      </th>
                      <th>
                        <h4>Descripción</h4>
                      </th>
                      <th>
                        <h4>Fecha</h4>
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
                          subtitulo={item.description}
                          parrafo="2024-08-26 14:01:51"
                          actionMenuProps={actionMenuProps}
                          item={item}
                          toggleMenuActions={toggleMenuActions}
                          svg="IconProyectos"
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4}>No se encontraron registros</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
      <Modal isOpen={isModalOpen} onClose={closeModal} titulo={"Proyectos"}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default Projects;
