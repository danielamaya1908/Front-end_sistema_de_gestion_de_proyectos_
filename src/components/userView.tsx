import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface ProfileData {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  isVerified: boolean;
  isDeleted: boolean;
  createdAt: string;
}

const UserView: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(
        "https://back-endsistemadegestiondeproyectos-production.up.railway.app/api/auth/profile",
        {
          headers: {
            session_token: token || "",
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        setProfile(res.data);
        console.log("✅ Perfil cargado:", res.data);
      })
      .catch((err) => {
        console.error("Error cargando perfil:", err);
        setError("No se pudo cargar el perfil.");
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p className="text-center mt-5">Cargando...</p>;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #dfe6e9, #b2bec3)",
      }}
    >
      <div
        className="card p-4 shadow"
        style={{ maxWidth: 500, width: "100%", borderRadius: 20 }}
      >
        <h3 className="text-center mb-4" style={{ color: "#800000" }}>
          Perfil del Usuario
        </h3>

        {profile && (
          <>
            <div className="text-center mb-3">
              <img
                src={profile.avatar}
                alt="Avatar"
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <h5 className="mt-2 mb-0">{profile.name}</h5>
              <small className="text-muted">{profile.email}</small>
            </div>

            <ul className="list-group list-group-flush mb-3">
              <li className="list-group-item">
                <strong>Rol:</strong> {profile.role}
              </li>
              <li className="list-group-item">
                <strong>Cuenta verificada:</strong>{" "}
                {profile.isVerified ? "Sí" : "No"}
              </li>
              <li className="list-group-item">
                <strong>Estado:</strong>{" "}
                {profile.isDeleted ? "Eliminado" : "Activo"}
              </li>
              <li className="list-group-item">
                <strong>Fecha de creación:</strong>{" "}
                {new Date(profile.createdAt).toLocaleString()}
              </li>
            </ul>

            <div className="text-center">
              <button
                className="btn btn-outline-primary"
                onClick={() => navigate(-1)}
              >
                ← Volver
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserView;
