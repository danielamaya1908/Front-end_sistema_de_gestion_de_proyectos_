import React, { useState, useEffect, useRef } from "react";
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

interface UserItem {
  id: string;
  username: string;
  email: string;
  type: string;
  dateCreation?: string;
  name?: string;
  description?: string;
}

interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

const Users: React.FC = () => {
  const [apiData, setApiData] = useState<UserItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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
    // Verificar que el token existe
    if (!token) {
      console.error("No hay token de sesión disponible");
      toast.error(
        "No hay token de sesión. Por favor, inicia sesión nuevamente."
      );
      return;
    }

    setLoading(true);

    axios
      .get(API_URL, {
        headers: {
          session_token: token,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((response) => {
        console.log("Respuesta completa del API:", response.data);

        // Verificar diferentes estructuras posibles de respuesta
        let rawData = null;

        if (response.data?.data) {
          rawData = response.data.data;
        } else if (response.data?.users) {
          rawData = response.data.users;
        } else if (Array.isArray(response.data)) {
          rawData = response.data;
        } else {
          console.error(
            "Estructura de respuesta no reconocida:",
            response.data
          );
          toast.error("Formato de respuesta del servidor no válido");
          return;
        }

        if (!Array.isArray(rawData)) {
          console.error("Los datos no son un array:", rawData);
          toast.error("Los datos recibidos no tienen el formato esperado");
          return;
        }

        console.log("Datos de usuarios recibidos:", rawData);

        const cleanedData = rawData.map((item: any) => ({
          id: item._id || item.id,
          username: item.username || item.name || "Sin nombre",
          email: item.email || "Sin email",
          type: item.type || item.role || "Sin tipo",
          dateCreation: item.dateCreation || item.createdAt || item.created_at,
          // Mantener compatibilidad con el formato anterior
          name: item.username || item.name || "Sin nombre",
          description: `${item.email || "Sin email"} - ${
            item.type || item.role || "Sin tipo"
          }`,
        }));

        console.log("Datos procesados:", cleanedData);
        setApiData(cleanedData);

        if (cleanedData.length === 0) {
          toast.info("No se encontraron usuarios");
        }
      })
      .catch((error) => {
        console.error("Error completo:", error);

        if (error.response) {
          // El servidor respondió con un código de estado diferente a 2xx
          console.error("Error de respuesta:", error.response.data);
          console.error("Status:", error.response.status);
          console.error("Headers:", error.response.headers);

          if (error.response.status === 401) {
            toast.error(
              "Token de sesión inválido o expirado. Por favor, inicia sesión nuevamente."
            );
          } else if (error.response.status === 403) {
            toast.error("No tienes permisos para acceder a esta información.");
          } else if (error.response.status === 404) {
            toast.error("Endpoint no encontrado. Verifica la URL del API.");
          } else {
            toast.error(
              `Error del servidor: ${error.response.status} - ${
                error.response.data?.message || "Error desconocido"
              }`
            );
          }
        } else if (error.request) {
          // La petición fue hecha pero no se recibió respuesta
          console.error("Error de red:", error.request);
          toast.error(
            "Error de conexión. Verifica tu conexión a internet y que el servidor esté disponible."
          );
        } else {
          // Algo más causó el error
          console.error("Error:", error.message);
          toast.error(`Error: ${error.message}`);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const handleChangecrear = () => {
    toast.success("Usuario creado con éxito");
    setIsModalOpen(false);
    setModalContent(null);
    fetchData();
  };

  const handleChangeeditar = () => {
    toast.success("Usuario editado con éxito");
    setIsModalOpen(false);
    fetchData();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredData = apiData.filter(
    (item) =>
      (item.username || "").toLowerCase().includes(searchTerm) ||
      (item.email || "").toLowerCase().includes(searchTerm) ||
      (item.type || "").toLowerCase().includes(searchTerm)
  );

  // Función para ordenar los datos filtrados
  const sortedData = [...filteredData].sort((a, b) => {
    const { key, direction } = sortConfig;
    let aValue = "";
    let bValue = "";

    // Obtener los valores según la clave de ordenamiento
    switch (key) {
      case "username":
        aValue = a.username || "";
        bValue = b.username || "";
        break;
      case "email":
        aValue = a.email || "";
        bValue = b.email || "";
        break;
      case "type":
        aValue = a.type || "";
        bValue = b.type || "";
        break;
      case "dateCreation":
        aValue = a.dateCreation || "";
        bValue = b.dateCreation || "";
        break;
      default:
        return 0;
    }

    // Comparar valores
    if (aValue < bValue) {
      return direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const handleDelete = (itemId: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      // Aquí deberías usar la URL correcta para eliminar usuarios
      const DELETE_URL = `https://back-endsistemadegestiondeproyectos-production.up.railway.app/api/users/delete/${itemId}`;

      axios
        .delete(DELETE_URL, {
          headers: {
            session_token: token,
            "Content-Type": "application/json",
          },
        })
        .then(() => {
          toast.success("Usuario eliminado con éxito");
          fetchData();
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
          toast.error("Error al eliminar el usuario");
        });
    }
  };

  const handleCreateClick = (FormComponent: React.ElementType) => {
    setIsModalOpen(true);
    setModalContent(<FormComponent onSubmitState={handleChangecrear} />);
  };

  const handleEditClick = (
    FormComponent: React.ElementType,
    id: string,
    username: string,
    email: string,
    type: string
  ) => {
    setIsModalOpen(true);
    setModalContent(
      <FormComponent
        onUPSubmitState={handleChangeeditar}
        idDefault={id}
        usernameDefault={username}
        emailDefault={email}
        typeDefault={type}
      />
    );
  };

  const handleShowClick = (
    FormComponent: React.ElementType,
    username: string,
    email: string,
    type: string
  ) => {
    setIsModalOpen(true);
    setModalContent(
      <FormComponent
        onUPSubmitState={handleChangeeditar}
        usernameDefault={username}
        emailDefault={email}
        typeDefault={type}
      />
    );
  };

  const actionMenuProps = (item: { id: string | number }) => {
    const realItem = apiData.find((i) => String(i.id) === String(item.id));

    if (!realItem) {
      console.warn("Usuario no encontrado para el menú:", item.id);
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
          onClick: () =>
            handleShowClick(
              Show,
              realItem.username,
              realItem.email,
              realItem.type
            ),
        },
        {
          label: "Editar",
          icon: "IconEditar",
          onClick: () =>
            handleEditClick(
              Update,
              realItem.id,
              realItem.username,
              realItem.email,
              realItem.type
            ),
          className: "menu_acciones_editar",
        },
        {
          label: "Eliminar",
          icon: "IconEliminar",
          onClick: () => handleDelete(realItem.id),
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
                {loading ? (
                  <div style={{ textAlign: "center", padding: "2rem" }}>
                    <p>Cargando usuarios...</p>
                  </div>
                ) : sortedData.length > 0 ? (
                  sortedData.map((item) => (
                    <CardView
                      key={item.id}
                      titulo={item.username}
                      subtitulo={item.email}
                      parrafo={item.type}
                      actionMenuProps={actionMenuProps}
                      item={item}
                      toggleMenuActions={toggleMenuActions}
                      svg="IconUsuarios"
                    />
                  ))
                ) : (
                  <p>No se encontraron usuarios</p>
                )}
              </div>
            ) : (
              <div className="layout_list_dashboard">
                <table>
                  <thead>
                    <tr>
                      <th onClick={() => handleSort("nombreAsc")}>
                        <h4>
                          Usuario
                          <IconSVG name="IconFlechas" />
                        </h4>
                      </th>
                      <th onClick={() => handleSort("emailAsc")}>
                        <h4>
                          Email
                          <IconSVG name="IconFlechas" />
                        </h4>
                      </th>
                      <th onClick={() => handleSort("tipoAsc")}>
                        <h4>
                          Tipo
                          <IconSVG name="IconFlechas" />
                        </h4>
                      </th>
                      <th onClick={() => handleSort("fechaDesc")}>
                        <h4>
                          Fecha Creación
                          <IconSVG name="IconFlechas" />
                        </h4>
                      </th>
                      <th>
                        <h4>Acciones</h4>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan={5}
                          style={{ textAlign: "center", padding: "2rem" }}
                        >
                          Cargando usuarios...
                        </td>
                      </tr>
                    ) : sortedData.length > 0 ? (
                      sortedData.map((item) => (
                        <ListView
                          key={item.id}
                          titulo={item.username}
                          subtitulo={item.email}
                          parrafo={item.type}
                          actionMenuProps={actionMenuProps}
                          item={item}
                          toggleMenuActions={toggleMenuActions}
                          svg="IconUsuarios"
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5}>No se encontraron usuarios</td>
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
