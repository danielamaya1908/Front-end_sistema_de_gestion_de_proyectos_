import { useForm } from 'react-hook-form';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

type LoginData = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const { register, handleSubmit } = useForm<LoginData>();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginData) => {
    try {
      const token = await login(data.email, data.password);
      localStorage.setItem('token', token);
      toast.success('Login exitoso');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Credenciales inválidas');
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-5 rounded shadow-md w-full max-w-md d-flex flex-column align-items-center"
      >
        <h1 className="text-2xl font-bold text-center mb-3">Gestion Proyectos</h1>

        <div className="relative m-2">
          <input
            type="email"
            {...register('email')}
            required
            placeholder="Email"
            className="pl-3 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
        </div>

        <div className="relative m-2">
          <input
            type="password"
            {...register('password')}
            required
            placeholder="Contraseña"
            className="pl-3 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
        </div>

        <button
          style={{ width: '70%' }}
          type="submit"
          className="btn btn-outline-primary btn-outline-info btn_interaction m-1"
        >
          Entrar
        </button>
      </form>
    </section>
  );
};

export default LoginForm;
