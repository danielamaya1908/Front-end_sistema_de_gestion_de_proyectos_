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
    reset,
  } = useForm<FormData>();

  // Paso 1: Solicitar código de recuperación
  const onSubmitRequest = async (data: Pick<FormData, "email">) => {
    setLoading(true);
    try {
      await axios.post(
        "https://back-endsistemadegestiondeproyectos-production.up.railway.app/api/auth/password/reset-request",
        { email: data.email }
      );
      setEmail(data.email);
      setStep("verify");
      toast.success("Código de verificación enviado a tu email");
    } catch (error) {
      toast.error("Error al solicitar recuperación de contraseña");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Paso 2: Verificar código
  const onSubmitVerify = async (data: Pick<FormData, "code">) => {
    setLoading(true);
    try {
      await axios.post(
        "https://back-endsistemadegestiondeproyectos-production.up.railway.app/api/auth/password/verify-code",
        { email, code: data.code }
      );
      setStep("reset");
      toast.success("Código verificado correctamente");
    } catch (error) {
      toast.error("Código de verificación inválido");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Paso 3: Restablecer contraseña
  const onSubmitReset = async (
    data: Pick<FormData, "newPassword" | "confirmPassword" | "code">
  ) => {
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
      toast.success("Contraseña actualizada correctamente");
      navigate("/login");
    } catch (error) {
      toast.error("Error al actualizar la contraseña");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Reenviar código
  const resendCode = async () => {
    setLoading(true);
    try {
      await axios.post(
        "https://back-endsistemadegestiondeproyectos-production.up.railway.app/api/auth/password/reset-request",
        { email }
      );
      toast.success("Nuevo código enviado a tu email");
    } catch (error) {
      toast.error("Error al reenviar el código");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 backdrop-blur-sm bg-opacity-90 border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Recuperar Contraseña
        </h2>

        {/* Paso 1: Solicitar código */}
        {step === "request" && (
          <form onSubmit={handleSubmit(onSubmitRequest)} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Ingresa tu email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition duration-200 ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Enviando...
                </span>
              ) : (
                "Enviar Código"
              )}
            </button>
          </form>
        )}

        {/* Paso 2: Verificar código */}
        {step === "verify" && (
          <form onSubmit={handleSubmit(onSubmitVerify)} className="space-y-6">
            <p className="text-sm text-gray-600 mb-6 text-center">
              Hemos enviado un código de verificación a{" "}
              <span className="font-semibold text-blue-600">{email}</span>
            </p>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Código de Verificación
              </label>
              <input
                type="text"
                {...register("code", {
                  required: "Código es requerido",
                  minLength: {
                    value: 6,
                    message: "El código debe tener 6 dígitos",
                  },
                  maxLength: {
                    value: 6,
                    message: "El código debe tener 6 dígitos",
                  },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Ingresa el código de 6 dígitos"
              />
              {errors.code && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.code.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition duration-200 ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
              }`}
            >
              {loading ? "Verificando..." : "Verificar Código"}
            </button>

            <button
              type="button"
              onClick={resendCode}
              disabled={loading}
              className="w-full text-blue-600 hover:text-blue-800 text-sm font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition duration-200"
            >
              {loading ? "Enviando nuevo código..." : "Reenviar código"}
            </button>
          </form>
        )}

        {/* Paso 3: Restablecer contraseña */}
        {step === "reset" && (
          <form onSubmit={handleSubmit(onSubmitReset)} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Código de Verificación
              </label>
              <input
                type="text"
                {...register("code", {
                  required: "Código es requerido",
                  minLength: {
                    value: 6,
                    message: "El código debe tener 6 dígitos",
                  },
                  maxLength: {
                    value: 6,
                    message: "El código debe tener 6 dígitos",
                  },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Ingresa el código de 6 dígitos"
              />
              {errors.code && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.code.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nueva Contraseña
              </label>
              <input
                type="password"
                {...register("newPassword", {
                  required: "Contraseña es requerida",
                  minLength: {
                    value: 6,
                    message: "Mínimo 6 caracteres",
                  },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Ingresa tu nueva contraseña"
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                {...register("confirmPassword", {
                  required: "Debes confirmar la contraseña",
                  validate: (value) =>
                    value === watch("newPassword") ||
                    "Las contraseñas no coinciden",
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Confirma tu nueva contraseña"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition duration-200 ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
              }`}
            >
              {loading ? "Actualizando..." : "Actualizar Contraseña"}
            </button>
          </form>
        )}

        <p className="text-center mt-6 text-sm text-gray-600">
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition duration-200"
          >
            ← Volver al login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
