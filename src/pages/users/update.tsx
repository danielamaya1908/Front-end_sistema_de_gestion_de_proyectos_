import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import InputDashboard from "../../components/inputDashboard";
import BtnSubmitDashboard from "../../components/btnSubmitDashboard";

interface UpdateProps {
  onUPSubmitState: (success: boolean) => void;
  userId: string;
  nameDefault: string;
  emailDefault: string;
  roleDefault?: string;
  avatarDefault?: string;
  isActiveDefault?: boolean;
}

const Update: React.FC<UpdateProps> = ({
  onUPSubmitState,
  userId,
  nameDefault,
  emailDefault,
  roleDefault = "Developer",
  avatarDefault = "",
  isActiveDefault = true,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    avatar: "",
    isActive: true,
  });

  useEffect(() => {
    console.log("📝 Update - Props recibidas:", {
      userId,
      nameDefault,
      emailDefault,
      roleDefault,
      avatarDefault,
      isActiveDefault,
    });

    setFormData({
      name: nameDefault || "",
      email: emailDefault || "",
      password: "",
      confirmPassword: "",
      role: roleDefault || "Developer",
      avatar: avatarDefault || "",
      isActive: isActiveDefault !== undefined ? isActiveDefault : true,
    });
  }, [nameDefault, emailDefault, roleDefault, avatarDefault, isActiveDefault]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    console.log(
      `📝 Campo cambiado: ${name} = ${type === "checkbox" ? checked : value}`
    );

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("🚀 Iniciando actualización de usuario");
    console.log("📋 Datos del formulario:", formData);

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Token no encontrado");
      return;
    }

    console.log("🔑 Token encontrado:", token ? "✅" : "❌");

    // Construir el payload
    const payload: any = {
      userId: userId,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      avatar: formData.avatar || "",
    };

    // Solo incluir password si se proporcionó
    if (formData.password && formData.password.trim() !== "") {
      payload.password = formData.password;
    }

    console.log("📦 Payload a enviar:", payload);
    console.log(
      "🌐 URL:",
      "https://back-endsistemadegestiondeproyectos-production.up.railway.app/api/users/put"
    );

    try {
      const response = await axios.put(
        "https://back-endsistemadegestiondeproyectos-production.up.railway.app/api/users/put",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            session_token: token,
          },
        }
      );

      console.log("✅ Respuesta exitosa:", response.data);
      toast.success("Usuario actualizado correctamente");
      onUPSubmitState(true);
    } catch (error: any) {
      console.error("❌ Error al actualizar usuario:");
      console.error("Status:", error.response?.status);
      console.error("Data:", error.response?.data);
      console.error("Headers enviados:", error.config?.headers);
      console.error("Payload enviado:", error.config?.data);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Error al actualizar usuario";
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modal_form">
      <InputDashboard
        name="name"
        label="Nombre"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <InputDashboard
        name="email"
        label="Correo"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <InputDashboard
        name="password"
        label="Nueva Contraseña (opcional)"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Dejar vacío para mantener la actual"
      />
      <InputDashboard
        name="confirmPassword"
        label="Confirmar nueva contraseña"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Solo si cambias la contraseña"
      />

      <div className="form-group">
        <label htmlFor="role">Rol</label>
        <select
          id="role"
          name="role"
          className="form-control"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="Developer">Developer</option>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="User">User</option>
        </select>
      </div>

      <InputDashboard
        name="avatar"
        label="Avatar URL (opcional)"
        value={formData.avatar}
        onChange={handleChange}
        placeholder="URL de la imagen"
      />

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />{" "}
          Usuario Activo
        </label>
      </div>

      <BtnSubmitDashboard text="Actualizar Usuario" />
    </form>
  );
};

export default Update;
