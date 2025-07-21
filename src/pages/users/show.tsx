import { useState, useEffect } from "react";
import type { FC } from "react";

import IconSVG from "../../components/icon";

interface ShowProps {
  nameDefault: string;
  descriptionDefault: string;
}

const Show: FC<ShowProps> = ({ nameDefault, descriptionDefault }) => {
  const [formData, setFormData] = useState({
    name: nameDefault,
    description: descriptionDefault,
  });

  useEffect(() => {
    setFormData({
      name: nameDefault,
      description: descriptionDefault,
    });
  }, [nameDefault, descriptionDefault]);

  return (
    <div className="modal_user_content">
      <section className="modal_all_info">
        <div className="modal_info_user_item">
          <figure>
            <IconSVG name="Icon_usuario_talentic" />
          </figure>
          <div>
            <h5>Nombre</h5>
            <p>{formData.name}</p>
          </div>
        </div>
        <div className="modal_info_user_item">
          <figure>
            <IconSVG name="Icon_correo_talentic_2" />
          </figure>
          <div>
            <h5>Descripción</h5>
            <p>{formData.description}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Show;
