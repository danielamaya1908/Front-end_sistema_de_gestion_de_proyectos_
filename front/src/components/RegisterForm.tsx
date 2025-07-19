import React from 'react';
import { useForm } from 'react-hook-form';
import { register as registerUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

type RegisterData = {
  email: string;
  password: string;
};

const RegisterForm = () => {
  const { register, handleSubmit } = useForm<RegisterData>();
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterData) => {
    try {
      await registerUser(data.email, data.password);
      alert('Registro exitoso');
      navigate('/login');
    } catch {
      alert('Error al registrar');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <h2>Registrarse</h2>
      <input type="email" placeholder="Email" {...register('email')} required />
      <input type="password" placeholder="Contraseña" {...register('password')} required />
      <button type="submit">Crear cuenta</button>
    </form>
  );
};

export default RegisterForm;
