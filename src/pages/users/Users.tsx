import React, { useState, useEffect, useRef } from "react";
import type { MutableRefObject, JSX } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import axios from "axios";

import Show from "./show";
import Create from "./create"; // Ahora apunta a src/pages/users/create.tsx
import Update from "./update";

import Modal from "../../components/modalDashboard";
import IconSVG from "../../components/icon";
import SeacrhData from "../../components/searchData";

import ViewToggle from "../../components/viewToggle";
import SortFilter from "../../components/sortFilter";

import ListView from "../../components/listView";
import CardView from "../../components/cardView";

interface UserItem {
  id: number;
  name: string;
  description: string;
  email: string;
  role: string;
  avatar: string;
  isActive: boolean;
  isDeleted?: boolean;
  state?: string;
}

interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

// Tipos para el delete
type DeleteType = "soft" | "hard";

// Componente para el modal de eliminación
const DeleteModal: React.FC<{
  userName: string;
  onConfirm: (deleteType: DeleteType) => void;
  onCancel: () => void;
}> = ({ userName, onConfirm, onCancel }) => {
  const [deleteType, setDeleteType] = useState<DeleteType>("soft");

  return (
    <div className="delete-modal-content">
      <div className="mb-3">
        <h5>¿Estás seguro de que deseas eliminar este usuario?</h5>
        <p>
          <strong>Usuario:</strong> {userName}
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
            ? "El usuario será desactivado pero sus datos se mantendrán en la base de datos."
            : "El usuario será eliminado permanentemente de la base de datos. Esta acción no se puede deshacer."}
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
            : "Desactivar usuario"}
        </button>
      </div>
    </div>
  );
};

const Users: React.FC = () => {
  const [apiData, setApiData] = useState<UserItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

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
    "https://back-endsistemadegestiondeproyectos-production.up.railway.app/api/users/getAll";
  const DELETE_API_URL =
    "https://back-endsistemadegestiondeproyectos-production.up.railway.app/api/users/delete";
  const UPDATE_API_URL =
    "https://back-endsistemadegestiondeproyectos-production.up.railway.app/api/users/put";

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
        params: {
          page: 1,
        },
      })
      .then((response) => {
        console.log(response.data);

        const rawData = response.data?.data;

        if (!Array.isArray(rawData)) {
          console.error('Error: La propiedad "data" no es un array:', rawData);
          return;
        }

        const cleanedData = rawData.map((item: any) => ({
          id: item._id,
          name: item.name,
          description: item.email,
          email: item.email,
          role: item.role || "Developer",
          avatar: item.avatar || "",
          isActive: item.isActive !== undefined ? item.isActive : true,
          isDeleted: item.isDeleted || false,
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
    toast.success("Se creó el usuario con éxito");
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

  // Función para activar/desactivar usuario (toggle isDeleted)
  const handleToggleUserStatus = async (
    userId: number,
    currentIsDeleted: boolean,
    userName: string
  ) => {
    const newStatus = !currentIsDeleted;
    const action = newStatus ? "desactivar" : "activar";

    if (
      !window.confirm(
        `¿Estás seguro de que deseas ${action} al usuario "${userName}"?`
      )
    ) {
      return;
    }

    console.log(`🔄 ${action} usuario:`, userId, "isDeleted:", newStatus);

    const requestBody = {
      userId: String(userId),
      isDeleted: newStatus,
    };

    try {
      await axios.put(UPDATE_API_URL, requestBody, {
        headers: {
          session_token: token,
          "Content-Type": "application/json",
        },
      });

      const message = newStatus
        ? `Usuario "${userName}" desactivado correctamente`
        : `Usuario "${userName}" activado correctamente`;

      toast.success(message);
      fetchData(); // Recargar datos
    } catch (error: any) {
      console.error("Error updating user status:", error);
      console.error("Error response:", error.response?.data);
      toast.error("Error al cambiar el estado del usuario");
    }
  };

  // Función para manejar la eliminación con el tipo seleccionado
  const executeDelete = (userId: number, deleteType: DeleteType) => {
    const requestBody = {
      userId: String(userId),
      deleteType: deleteType,
    };

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
            ? "Usuario eliminado permanentemente con éxito"
            : "Usuario desactivado con éxito";
        toast.success(message);
        closeModal();
        fetchData();
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        console.error("Error response:", error.response?.data);
        toast.error("Error al eliminar el usuario");
        closeModal();
      });
  };

  // Función para abrir el modal de eliminación
  const handleDelete = (itemId: number, userName: string) => {
    setIsModalOpen(true);
    setModalContent(
      <DeleteModal
        userName={userName}
        onConfirm={(deleteType) => executeDelete(itemId, deleteType)}
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
    description: string
  ) => {
    // Buscar el item completo con todos los datos
    const fullItem = apiData.find((item) => String(item.id) === String(id));

    console.log("📝 Editando usuario:", fullItem);

    if (!fullItem) {
      toast.error("No se encontraron los datos del usuario");
      return;
    }

    setIsModalOpen(true);
    setModalContent(
      <FormComponent
        onUPSubmitState={handleChangeeditar}
        userId={String(fullItem.id)}
        nameDefault={fullItem.name}
        emailDefault={fullItem.email}
        roleDefault={fullItem.role}
        avatarDefault={fullItem.avatar}
        isActiveDefault={fullItem.isActive}
      />
    );
  };

  const handleShowClick = (
    FormComponent: React.ElementType,
    name: string,
    description: string
  ) => {
    setIsModalOpen(true);
    setModalContent(
      <FormComponent
        onUPSubmitState={handleChangeeditar}
        nameDefault={name}
        descriptionDefault={description}
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
          label: "Ver",
          icon: "IconVer",
          onClick: () =>
            handleShowClick(Show, realItem.name, realItem.description),
        },
        {
          label: "Editar",
          icon: "IconEditar",
          onClick: () =>
            handleEditClick(
              Update,
              realItem.id,
              realItem.name,
              realItem.description
            ),
          className: "menu_acciones_editar",
        },
        {
          label: realItem.isDeleted ? "Activar Usuario" : "Desactivar Usuario",
          icon: realItem.isDeleted ? "IconActivar" : "IconDesactivar", // Puedes usar los íconos que tengas
          onClick: () =>
            handleToggleUserStatus(
              realItem.id,
              realItem.isDeleted || false,
              realItem.name
            ),
          className: realItem.isDeleted
            ? "menu_acciones_activar"
            : "menu_acciones_desactivar",
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
      <style>{`
        .card-desactivado {
          opacity: 0.6;
          border-left: 4px solid #dc3545 !important;
        }
        .card-activo {
          border-left: 4px solid #28a745 !important;
        }
        .row-desactivado {
          opacity: 0.6;
          background-color: #f8f9fa;
        }
        .row-activo {
          background-color: inherit;
        }
        .menu_acciones_activar {
          color: #28a745;
        }
        .menu_acciones_desactivar {
          color: #ffc107;
        }
        .status-badge {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
          margin-left: 8px;
        }
        .status-activo {
          background-color: #d4edda;
          color: #155724;
        }
        .status-inactivo {
          background-color: #f8d7da;
          color: #721c24;
        }
      `}</style>
      <main className="main__dashboard_content">
        <div className="form_content">
          <section className="dashboard_titulo">
            <h2>Usuarios</h2>
          </section>
          <div className="main__dashboard_primera_parte">
            <div
              className="btn_nuevo_dashboard"
              onClick={() => handleCreateClick(Create)}
            >
              <IconSVG name="Icon_mas_talentic" /> Crear Nuevo Usuario
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
                      img={item.avatar}
                      isDeleted={item.isDeleted} // Pasar el estado para mostrar visualmente
                      className={
                        item.isDeleted ? "card-desactivado" : "card-activo"
                      }
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
                        <h4>Correo</h4>
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
                          img={item.avatar}
                          isDeleted={item.isDeleted} // Pasar el estado para mostrar visualmente
                          className={
                            item.isDeleted ? "row-desactivado" : "row-activo"
                          }
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
      <Modal isOpen={isModalOpen} onClose={closeModal} titulo={"Usuario"}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default Users;
