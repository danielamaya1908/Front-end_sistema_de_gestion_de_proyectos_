import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { toast } from "react-toastify";
import axios from "axios";

import BtnSubmitDashboard from "../../components/btnSubmitDashboard";
import InputDashboard from "../../components/inputDashboard";

interface CreateProps {
  onSubmitState: (success: boolean) => void;
}

interface UserFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  avatar: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  avatar?: string;
}

const Create: React.FC<CreateProps> = ({ onSubmitState }) => {
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    avatar: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): string[] => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Debe tener al menos 8 caracteres");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Debe contener al menos una letra mayúscula");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Debe contener al menos una letra minúscula");
    }
    if (!/\d/.test(password)) {
      errors.push("Debe contener al menos un número");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Debe contener al menos un carácter especial");
    }
    return errors;
  };

  const validateURL = (url: string): boolean => {
    if (!url) return true; // Avatar es opcional
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    } else if (formData.name.trim().length > 50) {
      newErrors.name = "El nombre no puede exceder 50 caracteres";
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Ingrese un correo electrónico válido";
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else {
      const passwordErrors = validatePassword(formData.password);
      if (passwordErrors.length > 0) {
        newErrors.password = passwordErrors.join(", ");
      }
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirme su contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    // Validar rol
    if (!formData.role.trim()) {
      newErrors.role = "El rol es obligatorio";
    } else if (formData.role.trim().length < 2) {
      newErrors.role = "El rol debe tener al menos 2 caracteres";
    }

    // Validar avatar (opcional)
    if (formData.avatar && !validateURL(formData.avatar)) {
      newErrors.avatar = "Ingrese una URL válida para el avatar";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Por favor, corrija los errores en el formulario");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Token de sesión no encontrado");
      return;
    }

    setIsSubmitting(true);

    try {
      // Crear objeto sin confirmPassword para enviar al servidor
      const { confirmPassword, ...dataToSend } = formData;

      await axios.post(
        "https://back-endsistemadegestiondeproyectos-production.up.railway.app/api/users/create",
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            session_token: token,
          },
        }
      );

      toast.success("Usuario creado con éxito");
      onSubmitState(true);

      // Resetear formulario
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        avatar: "",
      });
      setErrors({});
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error al crear usuario";
      toast.error(errorMessage);

      // Si el error es de email duplicado, mostrar error en el campo específico
      if (
        errorMessage.toLowerCase().includes("email") ||
        errorMessage.toLowerCase().includes("correo")
      ) {
        setErrors((prev) => ({
          ...prev,
          email: "Este correo electrónico ya está registrado",
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal_user_content">
      <form className="modal_form" onSubmit={handleCreate} noValidate>
        <div className="modal_form_item">
          <InputDashboard
            name="name"
            label="Nombre completo *"
            placeholder="Ej: Daniel Amaya"
            value={formData.name}
            onChange={handleChange}
            colClassName=""
          />
          {errors.name && (
            <div
              className="error-message"
              style={{
                color: "#dc3545",
                fontSize: "13px",
                marginTop: "4px",
                display: "block",
                fontWeight: "500",
              }}
            >
              {errors.name}
            </div>
          )}
        </div>

        <div className="modal_form_item">
          <InputDashboard
            name="email"
            type="email"
            label="Correo electrónico *"
            placeholder="Ej: danijcdm.com@gmail.com"
            value={formData.email}
            onChange={handleChange}
            colClassName=""
          />
          {errors.email && (
            <div
              className="error-message"
              style={{
                color: "#dc3545",
                fontSize: "13px",
                marginTop: "4px",
                display: "block",
                fontWeight: "500",
              }}
            >
              {errors.email}
            </div>
          )}
        </div>

        <div className="modal_form_item">
          <InputDashboard
            name="password"
            type="password"
            label="Contraseña *"
            placeholder="Ingrese una contraseña segura"
            value={formData.password}
            onChange={handleChange}
            colClassName=""
          />
          {errors.password && (
            <div
              className="error-message"
              style={{
                color: "#dc3545",
                fontSize: "13px",
                marginTop: "4px",
                display: "block",
                fontWeight: "500",
              }}
            >
              {errors.password}
            </div>
          )}
          {formData.password && (
            <div
              className="help-text"
              style={{
                fontSize: "12px",
                color: "#6c757d",
                marginTop: "4px",
                display: "block",
                lineHeight: "1.3",
              }}
            >
              8+ caracteres, mayúsculas, minúsculas, números y símbolos
            </div>
          )}
        </div>

        <div className="modal_form_item">
          <InputDashboard
            name="confirmPassword"
            type="password"
            label="Confirmar contraseña *"
            placeholder="Repita la contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            colClassName=""
          />
          {errors.confirmPassword && (
            <div
              className="error-message"
              style={{
                color: "#dc3545",
                fontSize: "13px",
                marginTop: "4px",
                display: "block",
                fontWeight: "500",
              }}
            >
              {errors.confirmPassword}
            </div>
          )}
        </div>

        <div className="modal_form_item">
          <InputDashboard
            name="role"
            label="Rol de usuario *"
            placeholder="Ej: developer, admin, user"
            value={formData.role}
            onChange={handleChange}
            colClassName=""
          />
          {errors.role && (
            <div
              className="error-message"
              style={{
                color: "#dc3545",
                fontSize: "13px",
                marginTop: "4px",
                display: "block",
                fontWeight: "500",
              }}
            >
              {errors.role}
            </div>
          )}
        </div>

        <div className="modal_form_item">
          <InputDashboard
            name="avatar"
            type="url"
            label="Avatar (URL opcional)"
            placeholder="https://ejemplo.com/avatar.png"
            value={formData.avatar}
            onChange={handleChange}
            colClassName=""
          />
          {errors.avatar && (
            <div
              className="error-message"
              style={{
                color: "#dc3545",
                fontSize: "13px",
                marginTop: "4px",
                display: "block",
                fontWeight: "500",
              }}
            >
              {errors.avatar}
            </div>
          )}
        </div>

        <BtnSubmitDashboard
          text={isSubmitting ? "Creando..." : "Crear Usuario"}
          disabled={isSubmitting}
        />
      </form>
    </div>
  );
};

export default Create;
