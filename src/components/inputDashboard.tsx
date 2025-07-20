import { forwardRef } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import IconSVG from './icon';

interface InputDashboardProps {
  type?: string;
  name: string;
  value: string;
  placeholder?: string;
  label?: string;
  colClassName?: string;
  icon?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const InputDashboard = forwardRef<HTMLInputElement, InputDashboardProps>(({
  type = 'text',
  name,
  value,
  placeholder = 'nombre',
  label = 'Nombre',
  colClassName = '',
  onChange,
  icon,
  onKeyDown
}, ref) => {
  return (
    <div className={`input_dashboard ${colClassName}`}>
      <label htmlFor={name}>{label}</label>
      <section className="input_dashboard_content">
        {icon && <IconSVG name={icon} />}
        <input
          ref={ref}
          type={type}
          className="required"
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          autoComplete="off"
          id={name}
          onKeyDown={onKeyDown}
        />
      </section>
    </div>
  );
});

export default InputDashboard;
