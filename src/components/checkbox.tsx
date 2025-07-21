import React from 'react';

type CheckBoxProps = {
  icon: string;
  name: string;
  value: string | number;
  userName: string;
  description: string;
  checked?: boolean;
  handleCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  colClassName?: string;
};

const CheckBox: React.FC<CheckBoxProps> = ({
  icon,
  name,
  value,
  userName,
  description,
  checked = false,
  handleCheckboxChange,
  colClassName = '',
}) => {
  return (
    <div
      className={`buscarDos usuario__encontrado ${colClassName}`}
      data-user={`${userName} ${description}`}
    >
      <label htmlFor={`${value}${description}`}>
        <i className={`bx ${icon} display-5 me-3`}></i>
        <div>
          <h6 className="mb-0">{userName}</h6>
          <small className="text-muted">{description}</small>
        </div>
      </label>

      <div className="form-check form-switch">
        <input
          className="form-check-input float-end"
          type="checkbox"
          name={name}
          id={`${value}${description}`}
          value={String(value)}
          role="switch"
          defaultChecked={checked}
          onChange={handleCheckboxChange}
        />
      </div>
    </div>
  );
};

export default CheckBox;
