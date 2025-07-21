import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

type FormData = {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
};

const ForgotPasswordPage = () => {
  const [step, setStep] = useState<"request" | "verify" | "reset">("request");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmitRequest = async (data: Pick<FormData, "email">) => {
    setLoading(true);
    try {
      await axios.post(
        "https://back-endsistemadegestiondeproyectos-production.up.railway.app/api/auth/password/reset-request",
        { email: data.email }
      );
      setEmail(data.email);
      setStep("verify");
      toast.success("Código enviado a tu email");
    } catch (error) {
      toast.error("Error al solicitar recuperación");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitVerify = async (data: Pick<FormData, "code">) => {
    setLoading(true);
    try {
      await axios.post(
        "https://back-endsistemadegestiondeproyectos-production.up.railway.app/api/auth/password/verify-code",
        { email, code: data.code }
      );
      setStep("reset");
      toast.success("Código verificado");
    } catch (error) {
      toast.error("Código inválido");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitReset = async (data: FormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "https://back-endsistemadegestiondeproyectos-production.up.railway.app/api/auth/password/reset",
        {
          email,
          code: data.code,
          newPassword: data.newPassword,
        }
      );
      toast.success("Contraseña actualizada");
      navigate("/login");
    } catch (error) {
      toast.error("Error al actualizar contraseña");
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    setLoading(true);
    try {
      await axios.post(
        "https://back-endsistemadegestiondeproyectos-production.up.railway.app/api/auth/password/reset-request",
        { email }
      );
      toast.success("Nuevo código enviado");
    } catch (error) {
      toast.error("Error al reenviar código");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light px-3">
      <div className="col-12 col-md-8 col-lg-5 col-xl-4">
        <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
          <div
            className={`card-header text-white text-center py-4 ${
              step === "request"
                ? "bg-success"
                : step === "verify"
                ? "bg-warning"
                : "bg-primary"
            }`}
          >
            <h2 className="mb-0">
              {step === "request"
                ? "Recuperar Contraseña"
                : step === "verify"
                ? "Verificar Código"
                : "Restablecer Contraseña"}
            </h2>
          </div>

          <div className="card-body p-4">
            {/* Paso 1 */}
            {step === "request" && (
              <form
                onSubmit={handleSubmit(onSubmitRequest)}
                className="row g-3"
              >
                <div className="col-12">
                  <label className="form-label fw-semibold text-danger">
                    CORREO ELECTRÓNICO
                  </label>
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email es requerido",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Email inválido",
                      },
                    })}
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    placeholder="ejemplo@email.com"
                  />
                  <div className="invalid-feedback">
                    {errors.email?.message}
                  </div>
                </div>

                <div className="d-grid mt-3">
                  <button className="btn btn-success btn-lg" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Enviando...
                      </>
                    ) : (
                      "Enviar Código"
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Paso 2 */}
            {step === "verify" && (
              <form onSubmit={handleSubmit(onSubmitVerify)} className="row g-3">
                <div className="text-center">
                  <p>
                    Código enviado a:{" "}
                    <strong className="text-secondary">{email}</strong>
                  </p>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold text-danger">
                    CÓDIGO DE VERIFICACIÓN
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    {...register("code", {
                      required: "Código requerido",
                    })}
                    className={`form-control ${
                      errors.code ? "is-invalid" : ""
                    }`}
                    placeholder="Ej. 123456"
                  />
                  <div className="invalid-feedback">{errors.code?.message}</div>
                </div>

                <div className="d-grid gap-2 mt-3">
                  <button className="btn btn-success btn-lg" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Verificando...
                      </>
                    ) : (
                      "Verificar Código"
                    )}
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger btn-lg"
                    onClick={resendCode}
                  >
                    Reenviar código
                  </button>
                </div>
              </form>
            )}

            {/* Paso 3 */}
            {step === "reset" && (
              <form onSubmit={handleSubmit(onSubmitReset)} className="row g-3">
                <div className="col-12">
                  <label className="form-label">Código de Verificación</label>
                  <input
                    type="text"
                    {...register("code", {
                      required: "Código requerido",
                    })}
                    className={`form-control ${
                      errors.code ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">{errors.code?.message}</div>
                </div>

                <div className="col-12">
                  <label className="form-label">Nueva Contraseña</label>
                  <input
                    type="password"
                    {...register("newPassword", {
                      required: "Contraseña requerida",
                      minLength: { value: 6, message: "Mínimo 6 caracteres" },
                    })}
                    className={`form-control ${
                      errors.newPassword ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors.newPassword?.message}
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label">Confirmar Contraseña</label>
                  <input
                    type="password"
                    {...register("confirmPassword", {
                      required: "Confirma la contraseña",
                      validate: (value) =>
                        value === watch("newPassword") ||
                        "Las contraseñas no coinciden",
                    })}
                    className={`form-control ${
                      errors.confirmPassword ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors.confirmPassword?.message}
                  </div>
                </div>

                <div className="d-grid mt-3">
                  <button className="btn btn-primary btn-lg" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Actualizando...
                      </>
                    ) : (
                      "Actualizar Contraseña"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="card-footer text-center bg-white py-3">
            <Link
              to="/login"
              className="text-decoration-none fw-semibold text-success"
            >
              ← Volver al login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
