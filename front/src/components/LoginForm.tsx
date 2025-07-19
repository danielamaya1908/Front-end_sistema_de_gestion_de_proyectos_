import React from 'react';
import { useForm } from 'react-hook-form';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';

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
      alert('Login exitoso');
      // redirigir a dashboard
    } catch {
      alert('Credenciales inválidas');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <h2>Iniciar Sesión</h2>
      <input type="email" placeholder="Email" {...register('email')} required />
      <input type="password" placeholder="Contraseña" {...register('password')} required />
      <button type="submit">Entrar</button>
    </form>
  );
};

export default LoginForm;
