import React, { useEffect, useRef } from 'react';
import IconSVG from './icon';

export type IconName = string;

export interface Action {
  label: string;
  icon: IconName;
  onClick: () => void;
  className?: string;
}

export interface ActionMenuProps {
  actions: Action[];
  isActive: boolean;
  onClose: () => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ actions, isActive, onClose }) => {
  const menuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    isActive && (
      <ul
        className="menu_acciones"
        ref={menuRef}
        onClick={(event) => event.stopPropagation()}
      >
        {actions.map((action, index) => (
          <li
            key={index}
            onClick={action.onClick}
            className={action.className}
          >
            <IconSVG name={action.icon} />
            <span>{action.label}</span>
          </li>
        ))}
      </ul>
    )
  );
};

export default ActionMenu;
