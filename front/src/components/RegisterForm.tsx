import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { register as registerUser } from '../services/authService';

import type { FC } from 'react';

type RegisterData = {
  email: string;
  password: string;
};

const RegisterForm: FC = () => {
  const { register, handleSubmit } = useForm<RegisterData>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<RegisterData> = async (data) => {
    try {
      await registerUser(data.email, data.password);
      alert('Registro exitoso');
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert('Error al registrar');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <h2>Registrarse</h2>
      <input
        type="email"
        placeholder="Email"
        {...register('email', { required: true })}
      />
      <input
        type="password"
        placeholder="Contraseña"
        {...register('password', { required: true })}
      />
      <button type="submit">Crear cuenta</button>
    </form>
  );
};

export default RegisterForm;
