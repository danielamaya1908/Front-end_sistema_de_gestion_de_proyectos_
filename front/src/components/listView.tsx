import React from 'react';
import type { FC } from 'react';
import ActionMenu from './actionMenu';
import type { ActionMenuProps } from './actionMenu';
import IconSVG from './icon';

interface ItemType {
  id: string | number;
  [key: string]: any;
}

interface ListViewProps {
  img?: string;
  svg: 'IconX' | 'IconBusqueda' | 'IconTipoTarjetas' | 'IconTipoListas' | string; // ajustar si hay más íconos
  titulo: React.ReactNode;
  subtitulo: React.ReactNode;
  parrafo: React.ReactNode;
  actionMenuProps: (item: ItemType) => ActionMenuProps;
  toggleMenuActions: (id: ItemType['id']) => void;
  item: ItemType;
}

const ListView: FC<ListViewProps> = ({
  img,
  svg,
  titulo,
  subtitulo,
  parrafo,
  actionMenuProps,
  toggleMenuActions,
  item
}) => (
  <tr>
    <td className="img_list_dashboard">
      <div className="img_list_dashboard_content">
        <figure>
          {img === undefined ? (
            <IconSVG name={svg} />
          ) : (
            <img
              src={`http://217.15.168.117:8080/api/Whatever/${img}`}
              alt={String(item.id)}
            />
          )}
        </figure>
        {titulo}
      </div>
    </td>

    <td>{subtitulo}</td>
    <td>{parrafo}</td>

    <td>
      <div className="icon_list_action_content">
        <div
          className="icon_list_action"
          onClick={() => toggleMenuActions(item.id)}
        >
          <IconSVG name="IconX" />
        </div>
        <ActionMenu {...actionMenuProps(item)} />
      </div>
    </td>
  </tr>
);

export default ListView;
