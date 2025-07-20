import type { FC } from 'react';
import type { ActionMenuProps } from './actionMenu'; // Importación tipo-only
import ActionMenu from './actionMenu';
import IconSVG from './icon';

interface CardViewProps {
  titulo: string;
  img?: string;
  svg: 'IconX' | 'IconBusqueda' | 'IconTipoTarjetas' | 'IconTipoListas' | string;
  subtitulo: string;
  parrafo: string;
  item: { id: string | number };
  toggleMenuActions: (id: string | number) => void;
  actionMenuProps: (item: { id: string | number }) => ActionMenuProps;
}

const CardView: FC<CardViewProps> = ({
  titulo,
  img,
  svg,
  subtitulo,
  parrafo,
  actionMenuProps,
  item,
  toggleMenuActions
}) => (
  <article className="card_dashboard_uno">
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
    <div className="card_text_dashboard">
      <h4>{titulo}</h4>
      <p>{subtitulo}</p>
      <p>{parrafo}</p>
    </div>
    <div className="icon_card_action_content">
      <div className="icon_card_action" onClick={() => toggleMenuActions(item.id)}>
        <IconSVG name="Icon_menu_puntos_talentic" />
      </div>
    </div>
    <ActionMenu {...actionMenuProps(item)} />
  </article>
);

export default CardView;
