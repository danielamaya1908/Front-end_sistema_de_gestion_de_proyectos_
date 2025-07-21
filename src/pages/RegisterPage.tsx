import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

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

const RegisterPage = () => {
  const {
    register: registerForm,
    handleSubmit: handleFormSubmit,
    formState: { errors: formErrors },
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
        {
          email: registeredEmail,
          code: data.code,
        }
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
        {
          email: registeredEmail,
        }
      );
      toast.success("Nuevo código enviado a tu email");
    } catch (error: any) {
      toast.error("Error al reenviar el código");
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light px-3">
      <div className="col-12 col-md-8 col-lg-6 col-xl-5">
        <div className="card shadow border-0 rounded-4 overflow-hidden">
          <div
            className={`card-header py-4 text-white text-center ${
              step === "register" ? "bg-primary" : "bg-success"
            }`}
          >
            <h2 className="mb-0">
              {step === "register"
                ? "Registro de Cuenta"
                : "Verificación de Email"}
            </h2>
          </div>
          <div className="card-body p-4">
            {step === "register" ? (
              <form
                onSubmit={handleFormSubmit(onSubmitRegister)}
                className="row g-3"
              >
                <div className="col-12">
                  <label className="form-label">Nombre Completo</label>
                  <input
                    type="text"
                    {...registerForm("name", {
                      required: "Este campo es obligatorio",
                    })}
                    className={`form-control ${
                      formErrors.name ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {formErrors.name?.message}
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label">Correo Electrónico</label>
                  <input
                    type="email"
                    {...registerForm("email", {
                      required: "Este campo es obligatorio",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Email inválido",
                      },
                    })}
                    className={`form-control ${
                      formErrors.email ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {formErrors.email?.message}
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    {...registerForm("password", {
                      required: "Este campo es obligatorio",
                      minLength: { value: 6, message: "Mínimo 6 caracteres" },
                    })}
                    className={`form-control ${
                      formErrors.password ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {formErrors.password?.message}
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label">Rol</label>
                  <select
                    {...registerForm("role", {
                      required: "Este campo es obligatorio",
                    })}
                    className={`form-select ${
                      formErrors.role ? "is-invalid" : ""
                    }`}
                  >
                    <option value="">Selecciona tu rol</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                  </select>
                  <div className="invalid-feedback">
                    {formErrors.role?.message}
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label">Avatar (opcional)</label>
                  <input
                    type="text"
                    {...registerForm("avatar")}
                    className="form-control"
                    placeholder="URL de tu avatar"
                  />
                </div>

                <div className="d-grid mt-4">
                  <button
                    className="btn btn-primary btn-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        />
                        Registrando...
                      </>
                    ) : (
                      "Registrarse"
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="text-center mb-4">
                  <i className="bi bi-envelope-check fs-1 text-success" />
                  <p className="mt-2">
                    Código enviado a: <strong>{registeredEmail}</strong>
                  </p>
                </div>
                <form
                  onSubmit={handleVerifySubmit(onSubmitVerification)}
                  className="row g-3"
                >
                  <div className="col-12">
                    <label className="form-label">Código de Verificación</label>
                    <input
                      type="text"
                      maxLength={6}
                      {...verifyForm("code", {
                        required: "Por favor ingresa el código",
                      })}
                      className={`form-control ${
                        verifyErrors.code ? "is-invalid" : ""
                      }`}
                      placeholder="Ej. 123456"
                    />
                    <div className="invalid-feedback">
                      {verifyErrors.code?.message}
                    </div>
                  </div>

                  <div className="d-grid mt-4">
                    <button
                      className="btn btn-success btn-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          />
                          Verificando...
                        </>
                      ) : (
                        "Verificar Código"
                      )}
                    </button>
                  </div>

                  <div className="text-center mt-3">
                    <button
                      type="button"
                      className="btn btn-link"
                      onClick={resendVerificationCode}
                    >
                      <i className="bi bi-arrow-clockwise me-1"></i> Reenviar
                      código
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>

          <div className="card-footer text-center bg-white py-3">
            {step === "register" ? (
              <p className="mb-0">
                ¿Ya tienes cuenta?{" "}
                <Link
                  to="/login"
                  className="fw-bold text-decoration-none text-primary"
                >
                  Inicia sesión
                </Link>
              </p>
            ) : (
              <button
                onClick={() => setStep("register")}
                className="btn btn-outline-secondary"
              >
                <i className="bi bi-arrow-left me-2"></i> Volver al registro
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
