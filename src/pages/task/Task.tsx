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

interface TaskItem {
  id: number;
  name: string;
  description: string;
  state?: string;
}

interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

const Tasks: React.FC = () => {
  const [apiData, setApiData] = useState<TaskItem[]>([]);
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
    "https://back-endsistemadegestiondeproyectos-production.up.railway.app/api/tasks/getAll";

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
    console.log("🔗 Fetching data from URL:", API_URL);
    console.log("🔑 Token being used:", token);

    // Primero probemos sin parámetros, como funciona en proyectos
    axios
      .get(API_URL, {
        headers: {
          session_token: token,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("✅ Response received:", response);
        console.log("📊 Response data:", response.data);

        const rawData = response.data?.data;
        console.log("📋 Raw data from API:", rawData);

        if (!Array.isArray(rawData)) {
          console.error(
            '❌ Error: La propiedad "data" no es un array:',
            rawData
          );
          console.log("🔍 Full response structure:", response.data);
          return;
        }

        console.log("📝 Number of tasks found:", rawData.length);

        const cleanedData = rawData.map((item: any) => {
          console.log("🔄 Processing task item:", item);
          return {
            id: item._id,
            name: item.title, // Cambiado de name a title
            description: item.description,
            state: item.status, // Cambiado de state a status
          };
        });

        console.log("✨ Cleaned data to set in state:", cleanedData);
        setApiData(cleanedData);
      })
      .catch((error) => {
        console.error("❌ Error fetching data:", error);
        console.log("🔍 Error details:", {
          message: error.message,
          response: error.response,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: error.config,
        });
        console.log("📤 Request that was sent:", {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data,
        });
        if (error.response?.data) {
          console.log("📥 Server error response:", error.response.data);
        }
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
      (item.state || "").toLowerCase().includes(searchTerm)
  );

  const handleDelete = (itemId: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
      const requestBody = {
        API: "talentic",
        MODEL: "talentic",
        RESOURCE: "tasks",
        key: "5b8d3b1f084b01c6a8387459e80d4bb9",
        TYPE: "DELETE",
        id: itemId,
      };

      axios
        .post("http://217.15.168.117:8080/api/", requestBody)
        .then(() => {
          toast.success("Se eliminaron los datos con éxito");
          fetchData();
        })
        .catch((error) => {
          console.error("Error deleting data:", error);
        });
    }
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
    state?: string
  ) => {
    setIsModalOpen(true);
    setModalContent(
      <FormComponent
        onUPSubmitState={handleChangeeditar}
        idDefault={id}
        nameDefault={name}
        descriptionDefault={description}
        stateDefault={state}
      />
    );
  };

  const handleShowClick = (
    FormComponent: React.ElementType,
    name: string,
    description: string,
    state?: string
  ) => {
    setIsModalOpen(true);
    setModalContent(
      <FormComponent
        onUPSubmitState={handleChangeeditar}
        nameDefault={name}
        descriptionDefault={description}
        stateDefault={state}
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
            handleShowClick(
              Show,
              realItem.name,
              realItem.description,
              realItem.state
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
              realItem.state
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
                      subtitulo={item.description}
                      parrafo={item.state || "Sin estado"}
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
                          Nombre
                          <IconSVG name="IconFlechas" />
                        </h4>
                      </th>
                      <th>
                        <h4>Descripción</h4>
                      </th>
                      <th>
                        <h4>Estado</h4>
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
                          parrafo={item.state || "Sin estado"}
                          actionMenuProps={actionMenuProps}
                          item={item}
                          toggleMenuActions={toggleMenuActions}
                          svg="IconTareas"
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
      <Modal isOpen={isModalOpen} onClose={closeModal} titulo={"Tareas"}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default Tasks;
