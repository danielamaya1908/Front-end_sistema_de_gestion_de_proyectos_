import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  if (!token) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleMenu = (menuName: string) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const toggleSubMenu = (menuName: string) => {
    setActiveSubMenu(activeSubMenu === menuName ? null : menuName);
  };

  const handleMenuClick = (title: string) => {
    console.log("Menú:", title);
  };

  return (
    <ul className="dashboard_menu_items">
      <div className="dashboard_menu_main">
        {/* PROYECTOS */}
        <li className="dashboard_menu_item_drop">
          <Link
            to="/dashboard/projects"
            className={`dashboard_menu_item_content ${
              activeSubMenu === "item_proyectos" ? "active__item_menu" : ""
            }`}
            onClick={() => {
              toggleSubMenu("item_proyectos");
              toggleMenu("default_item");
              handleMenuClick("Proyectos");
            }}
          >
            <span>Proyectos</span>
          </Link>
        </li>

        <li className="dashboard_menu_item_drop">
          <Link
            to="/dashboard/users"
            className={`dashboard_menu_item_content ${
              activeSubMenu === "item_proyectos" ? "active__item_menu" : ""
            }`}
            onClick={() => {
              toggleSubMenu("item_proyectos");
              toggleMenu("default_item");
              handleMenuClick("Usuarios");
            }}
          >
            <span>Usuarios</span>
          </Link>
        </li>

        <li className="dashboard_menu_item_drop">
          <Link
            to="/dashboard/task"
            className={`dashboard_menu_item_content ${
              activeSubMenu === "item_proyectos" ? "active__item_menu" : ""
            }`}
            onClick={() => {
              toggleSubMenu("item_proyectos");
              toggleMenu("default_item");
              handleMenuClick("Tareas");
            }}
          >
            <span>Tareas</span>
          </Link>
        </li>

        {/* CIERRE DE SESIÓN */}
        <div className="dashboard_menu_exit">
          <li className="dashboard_menu_item dashboard_cerrar_sesion">
            <Link to="/" onClick={handleLogout}>
              <div>Cerrar sesión</div>
            </Link>
          </li>
        </div>
      </div>

      <footer className="dashboard_footer">
        <li>
          <Link to="/">Términos y condiciones</Link> |{" "}
          <Link to="/">Política de tratamiento de datos</Link>
        </li>
        <li>
          <p>© 2025 Daniel Amaya</p>
        </li>
      </footer>
    </ul>
  );
};

export default Navbar;
