import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

type RegisterData = {
  name: string;
  email: string;
  password: string;
  role: "Admin" | "Manager";
  avatar: string;
};

type VerificationData = {
  email: string;
  code: string;
};

const RegisterForm = () => {
  const {
    register: registerForm,
    handleSubmit: handleFormSubmit,
    formState: { errors: formErrors },
    watch,
  } = useForm<RegisterData>();

  const {
    register: verifyForm,
    handleSubmit: handleVerifySubmit,
    formState: { errors: verifyErrors },
  } = useForm<VerificationData>();

  const [step, setStep] = useState<"register" | "verify">("register");
  const [isLoading, setIsLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const navigate = useNavigate();

  const onSubmitRegister = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      await axios.post(
        "https://back-endsistemadegestiondeproyectos-production.up.railway.app/api/auth/register",
        data
      );
      setRegisteredEmail(data.email);
      setStep("verify");
      toast.success(
        "Registro exitoso. Revisa tu email para el código de verificación."
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error en el registro");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitVerification = async (data: VerificationData) => {
    setIsLoading(true);
    try {
      await axios.post(
        "https://back-endsistemadegestiondeproyectos-production.up.railway.app/api/auth/verify",
        { email: registeredEmail, code: data.code }
      );
      toast.success("¡Email verificado correctamente!");
      navigate("/login");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Código de verificación inválido"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationCode = async () => {
    try {
      await axios.post(
        "https://back-endsistemadegestiondeproyectos-production.up.railway.app/api/auth/resend-code",
        { email: registeredEmail }
      );
      toast.success("Nuevo código enviado a tu email");
    } catch (error: any) {
      toast.error("Error al reenviar el código");
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row justify-content-center w-100">
        <div className="col-md-8 col-lg-6 col-xl-5">
          {step === "register" ? (
            <div className="card shadow-lg border-0 rounded-lg">
              <div className="card-header bg-primary text-white py-4">
                <h2 className="text-center mb-0">Registro de Cuenta</h2>
              </div>
              <div className="card-body p-5">
                <form onSubmit={handleFormSubmit(onSubmitRegister)}>
                  <div className="mb-4">
                    <label htmlFor="name" className="form-label fw-bold">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...registerForm("name", {
                        required: "Este campo es obligatorio",
                      })}
                      className={`form-control form-control-lg ${
                        formErrors.name ? "is-invalid" : ""
                      }`}
                      placeholder="Ingresa tu nombre completo"
                    />
                    {formErrors.name && (
                      <div className="invalid-feedback">
                        {formErrors.name.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="form-label fw-bold">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...registerForm("email", {
                        required: "Este campo es obligatorio",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Email inválido",
                        },
                      })}
                      className={`form-control form-control-lg ${
                        formErrors.email ? "is-invalid" : ""
                      }`}
                      placeholder="ejemplo@correo.com"
                    />
                    {formErrors.email && (
                      <div className="invalid-feedback">
                        {formErrors.email.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-bold">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      id="password"
                      {...registerForm("password", {
                        required: "Este campo es obligatorio",
                        minLength: {
                          value: 6,
                          message: "Mínimo 6 caracteres",
                        },
                      })}
                      className={`form-control form-control-lg ${
                        formErrors.password ? "is-invalid" : ""
                      }`}
                      placeholder="Crea una contraseña segura"
                    />
                    {formErrors.password && (
                      <div className="invalid-feedback">
                        {formErrors.password.message}
                      </div>
                    )}
                    <div className="form-text">Mínimo 6 caracteres</div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="role" className="form-label fw-bold">
                      Rol
                    </label>
                    <select
                      id="role"
                      {...registerForm("role", {
                        required: "Este campo es obligatorio",
                      })}
                      className={`form-select form-select-lg ${
                        formErrors.role ? "is-invalid" : ""
                      }`}
                    >
                      <option value="">Selecciona tu rol</option>
                      <option value="Admin">Administrador</option>
                      <option value="Manager">Gerente</option>
                    </select>
                    {formErrors.role && (
                      <div className="invalid-feedback">
                        {formErrors.role.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="avatar" className="form-label fw-bold">
                      Avatar (Opcional)
                    </label>
                    <input
                      type="text"
                      id="avatar"
                      {...registerForm("avatar")}
                      className="form-control form-control-lg"
                      placeholder="URL de tu imagen de perfil"
                    />
                  </div>

                  <div className="d-grid gap-2 mt-5">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg fw-bold py-3"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Registrando...
                        </>
                      ) : (
                        "Registrarse"
                      )}
                    </button>
                  </div>
                </form>
              </div>
              <div className="card-footer bg-transparent py-3 text-center">
                <p className="mb-0">
                  ¿Ya tienes una cuenta?{" "}
                  <Link
                    to="/login"
                    className="text-decoration-none fw-bold text-primary"
                  >
                    Inicia Sesión
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            <div className="card shadow-lg border-0 rounded-lg">
              <div className="card-header bg-success text-white py-4">
                <h2 className="text-center mb-0">Verifica tu Email</h2>
              </div>
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <i className="bi bi-envelope-check fs-1 text-success"></i>
                  <p className="mt-3">
                    Hemos enviado un código de verificación a:
                    <br />
                    <strong className="text-primary">{registeredEmail}</strong>
                  </p>
                </div>

                <form onSubmit={handleVerifySubmit(onSubmitVerification)}>
                  <div className="mb-4">
                    <label htmlFor="code" className="form-label fw-bold">
                      Código de Verificación
                    </label>
                    <input
                      type="text"
                      id="code"
                      {...verifyForm("code", {
                        required: "Por favor ingresa el código",
                      })}
                      className={`form-control form-control-lg ${
                        verifyErrors.code ? "is-invalid" : ""
                      }`}
                      placeholder="Ingresa el código de 6 dígitos"
                      maxLength={6}
                    />
                    {verifyErrors.code && (
                      <div className="invalid-feedback">
                        {verifyErrors.code.message}
                      </div>
                    )}
                  </div>

                  <div className="d-grid gap-2 mt-5">
                    <button
                      type="submit"
                      className="btn btn-success btn-lg fw-bold py-3"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Verificando...
                        </>
                      ) : (
                        "Verificar Código"
                      )}
                    </button>
                  </div>
                </form>

                <div className="text-center mt-4">
                  <button
                    onClick={resendVerificationCode}
                    className="btn btn-link text-decoration-none"
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Reenviar código
                  </button>
                </div>
              </div>
              <div className="card-footer bg-transparent py-3 text-center">
                <button
                  onClick={() => setStep("register")}
                  className="btn btn-outline-secondary"
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Volver al registro
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
