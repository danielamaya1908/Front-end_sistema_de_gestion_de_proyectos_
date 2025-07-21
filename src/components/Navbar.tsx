import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

interface ProfileData {
  name: string;
  email: string;
  avatar: string;
  role: string;
}

const Navbar: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    avatar: "",
    role: "",
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!token) return;
    axios
      .get(
        "https://back-endsistemadegestiondeproyectos-production.up.railway.app/api/auth/profile",
        {
          headers: {
            session_token: token,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        setProfile(res.data);
      })
      .catch((err) => {
        console.error("Error al cargar perfil:", err);
      });
  }, [token]);

  if (!token) return null;

  return (
    <ul className="dashboard_menu_items">
      <div className="dashboard_menu_main">
        {profile && profile.name && (
          <li
            className="dashboard_menu_user_profile mb-4 p-3 d-flex align-items-center"
            style={{ gap: "12px" }}
          >
            <img
              src={profile.avatar}
              alt="Avatar"
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #6c757d",
              }}
            />
            <div>
              <span
                className="text-white fw-bold d-block"
                style={{ fontSize: "15px" }}
              >
                {profile.name}
              </span>
              <Link
                to="/perfil"
                style={{
                  fontSize: "13px",
                  color: "#4dabf7",
                  fontWeight: 500,
                  textDecoration: "underline",
                }}
              >
                Ver perfil
              </Link>
            </div>
          </li>
        )}

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
            <span className="fw-medium">Proyectos</span>
          </Link>
        </li>

        {profile.role !== "developer" && (
          <li className="dashboard_menu_item_drop">
            <Link
              to="/dashboard/users"
              className={`dashboard_menu_item_content ${
                activeSubMenu === "item_users" ? "active__item_menu" : ""
              }`}
              onClick={() => {
                toggleSubMenu("item_users");
                toggleMenu("default_item");
                handleMenuClick("Usuarios");
              }}
            >
              <span className="fw-medium">Usuarios</span>
            </Link>
          </li>
        )}

        <div className="dashboard_menu_exit mt-5">
          <li className="dashboard_menu_item dashboard_cerrar_sesion">
            <Link to="/" onClick={handleLogout}>
              <div className="text-danger fw-semibold">Cerrar sesión</div>
            </Link>
          </li>
        </div>
      </div>

      <footer className="dashboard_footer mt-4 text-center small text-muted">
        <li>
          <Link to="/">Términos y condiciones</Link> |{" "}
          <Link to="/">Política de tratamiento de datos</Link>
        </li>
        <li>
          <p className="mt-2">© 2025 Daniel Amaya</p>
        </li>
      </footer>
    </ul>
  );
};

export default Navbar;
