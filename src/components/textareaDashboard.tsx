import { forwardRef } from 'react';
import type { ChangeEvent, ForwardedRef } from 'react';
import IconSVG from './icon';

// Definimos las props con un tipo TypeScript
interface TextareaDashboardProps {
  name: string;
  value: string;
  placeholder?: string;
  label?: string;
  colClassName?: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  icon?: string;
}

const TextareaDashboard = forwardRef<HTMLTextAreaElement, TextareaDashboardProps>(({
  name,
  value,
  placeholder = 'nombre',
  label = 'Nombre',
  colClassName = '',
  onChange,
  icon,
}, ref: ForwardedRef<HTMLTextAreaElement>) => {
  return (
    <div className={`input_dashboard ${colClassName}`}>
      <label htmlFor={name}>{label}</label>
      <section className='input_dashboard_content'>
        {icon && <IconSVG name={icon} />}
        <textarea
          ref={ref}
          className="required"
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          autoComplete="off"
          id={name}
        />
      </section>
    </div>
  );
});

export default TextareaDashboard;
