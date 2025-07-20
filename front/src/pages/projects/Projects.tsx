import React, { useState, useEffect, useRef } from 'react';
import type { MutableRefObject, JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import axios from 'axios';

import Show from './show';
import Create from './create';
import Update from './update';

import Modal from '../../components/modalDashboard';
import IconSVG from '../../components/icon';
import SeacrhData from '../../components/searchData';

import ViewToggle from '../../components/viewToggle';
import SortFilter from '../../components/sortFilter';

import ListView from '../../components/listView';
import CardView from '../../components/cardView';

interface RoleItem {
  id: number;
  name: string;
  description: string;
  state?: string;
}

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

const Projects: React.FC = () => {
  const [apiData, setApiData] = useState<RoleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const navigate = useNavigate();

  const hashToVer = "a959cc809c209a915e2b2f55846f656f";
  const hashToCrear = "a551d82ab410af170d98a4a8412a24b1";
  const hashToEditar = "b37268352a18884127e4ddfb850e85f6";
  const hashToEliminar = "00e28788113c95aca5c57ee24ee62ff7";

  const [roleFilter, setRoleFilter] = useState<string>('Todos');
  const [activeMenuActions, setActiveMenuActions] = useState<number | null>(null);
  const menuRef: MutableRefObject<HTMLUListElement | null> = useRef(null);
  const [viewType, setViewType] = useState<'cards' | 'list'>('cards');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'dateCreation', direction: 'desc' });

  const showCards = () => setViewType('cards');
  const showList = () => setViewType('list');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && event.target instanceof Node && !menuRef.current.contains(event.target)) {
        setActiveMenuActions(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSort = (value: string) => {
    let key: string;
    let direction: 'asc' | 'desc';

    switch (value) {
      case 'fechaDesc': key = 'dateCreation'; direction = 'desc'; break;
      case 'fechaAsc': key = 'dateCreation'; direction = 'asc'; break;
      case 'nombreAsc': key = 'username'; direction = 'asc'; break;
      case 'nombreDesc': key = 'username'; direction = 'desc'; break;
      case 'emailAsc': key = 'email'; direction = 'asc'; break;
      case 'emailDesc': key = 'email'; direction = 'desc'; break;
      case 'tipoAsc': key = 'type'; direction = 'asc'; break;
      case 'tipoDesc': key = 'type'; direction = 'desc'; break;
      default: return;
    }

    setSortConfig({ key, direction });
  };

  const toggleMenuActions = (menuName: string | number) => {
    const id = typeof menuName === 'string' ? parseInt(menuName, 10) : menuName;
    setActiveMenuActions(activeMenuActions === id ? null : id);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const requestBody = {
      API: "talentic",
      MODEL: "talentic",
      RESOURCE: "list",
      TYPE: "roles",
      key: "5b8d3b1f084b01c6a8387459e80d4bb9",
    };

    axios.post('http://217.15.168.117:8080/api/', requestBody)
      .then(response => {
        const cleanedData = response.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description
        }));
        setApiData(cleanedData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const handleChangecrear = (newState: any) => {
    toast.success("Se gestionaron los datos con éxito");
    setIsModalOpen(false);
    setModalContent(null);
    fetchData();
  };

  const handleChangeeditar = (newState: any) => {
    toast.success("Se editaron los datos con éxito");
    setIsModalOpen(false);
    fetchData();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredData = apiData.filter(item =>
    (item.name || '').toLowerCase().includes(searchTerm) ||
    (item.description || '').toLowerCase().includes(searchTerm)
  );

  const handleDelete = (itemId: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      const requestBody = {
        API: "talentic",
        MODEL: "talentic",
        RESOURCE: "roles",
        key: "5b8d3b1f084b01c6a8387459e80d4bb9",
        TYPE: "DELETE",
        id: itemId
      };

      axios.post('http://217.15.168.117:8080/api/', requestBody)
        .then(() => {
          toast.success("Se eliminaron los datos con éxito");
          fetchData();
        })
        .catch(error => {
          console.error('Error deleting data:', error);
        });
    }
  };

  const handleCreateClick = (FormComponent: React.ElementType) => {
    setIsModalOpen(true);
    setModalContent(<FormComponent onSubmitState={handleChangecrear} />);
  };

  const handleEditClick = (FormComponent: React.ElementType, id: number, name: string, description: string) => {
    setIsModalOpen(true);
    setModalContent(
      <FormComponent
        onUPSubmitState={handleChangeeditar}
        idDefault={id}
        nameDefault={name}
        descriptionDefault={description}
      />
    );
  };

  const handleShowClick = (FormComponent: React.ElementType, name: string, description: string) => {
    setIsModalOpen(true);
    setModalContent(<FormComponent onUPSubmitState={handleChangeeditar} nameDefault={name} descriptionDefault={description} />);
  };

  const formDatauser = { permisos: [hashToVer, hashToEditar, hashToEliminar] }; // Debe venir de contexto o props

  const actionMenuProps = (item: { id: string | number }) => {
    const realItem = apiData.find(i => i.id === item.id);
    if (!realItem) return { isActive: false, onClose: () => {}, actions: [] };

    return {
        isActive: activeMenuActions === realItem.id,
        onClose: () => setActiveMenuActions(null),
        actions: [
        formDatauser.permisos.includes(hashToVer) && {
            label: 'Permisos',
            icon: 'Icon_permisos_talentic',
            onClick: () => navigate('/dashboard/allocationrigths', { state: { id: realItem.id } }),
        },
        formDatauser.permisos.includes(hashToVer) && {
            label: 'Ver',
            icon: 'Icon_ver_talentic_2',
            onClick: () => handleShowClick(Show, realItem.name, realItem.description),
        },
        formDatauser.permisos.includes(hashToEditar) && {
            label: 'Editar',
            icon: 'Icon_editar_talentic_2',
            onClick: () => handleEditClick(Update, realItem.id, realItem.name, realItem.description),
            className: 'menu_acciones_editar'
        },
        formDatauser.permisos.includes(hashToEliminar) && {
            label: 'Eliminar',
            icon: 'Icon_eliminar_talentic_2',
            onClick: () => handleDelete(realItem.id),
            className: 'menu_acciones_eliminar'
        }
        ].filter(Boolean) as any[]
    };
  };


  return (
    <div className='dashboard_content'>
      <main className='main__dashboard_content'>
        <div className='form_content'>
          <section className='dashboard_titulo'>
            <h2>Roles</h2>
          </section>
          <div className='main__dashboard_primera_parte'>
            <div className='btn_nuevo_dashboard' onClick={() => handleCreateClick(Create)}>
              <IconSVG name="Icon_mas_talentic" /> Crear Nuevo
            </div>
          </div>
          <div className='form_content_dashboard'>
            <div className='filters_dashboard'>
              <div className='buscador_dashboard'>
                <SeacrhData searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
              </div>
              <div className='filtros_content_dashboard'>
                <SortFilter sortConfig={sortConfig} onSortChange={handleSort} />
                <ViewToggle viewType={viewType} showCards={showCards} showList={showList} />
              </div>
            </div>
            {viewType === 'cards' ? (
              <div className='layout_cards'>
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
                      svg="Icon_roles_talentic"
                    />
                  ))
                ) : (
                  <p>No se encontraron registros</p>
                )}
              </div>
            ) : (
              <div className='layout_list_dashboard'>
                <table>
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('nombreAsc')}><h4>Roles<IconSVG name="Icon_flechas_talentic" /></h4></th>
                      <th><h4>Descripción</h4></th>
                      <th><h4>Fecha</h4></th>
                      <th><h4>Acciones</h4></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? filteredData.map((item) => (
                      <ListView
                        key={item.id}
                        titulo={item.name}
                        subtitulo={item.description}
                        parrafo="2024-08-26 14:01:51"
                        actionMenuProps={actionMenuProps}
                        item={item}
                        toggleMenuActions={toggleMenuActions}
                        svg="Icon_roles_talentic"
                      />
                    )) : (
                      <tr><td colSpan={4}>No se encontraron registros</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
      <Modal isOpen={isModalOpen} onClose={closeModal} titulo={"Rol"}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default Projects;
