import { useForm } from 'react-hook-form';
import { forgotPassword } from '../services/authService';

type ForgotPasswordData = {
  email: string;
};

const ForgotPasswordForm = () => {
  const { register, handleSubmit } = useForm<ForgotPasswordData>();

  const onSubmit = async (data: ForgotPasswordData) => {
    try {
      await forgotPassword(data.email);
      alert('Correo de recuperación enviado');
    } catch {
      alert('Error al enviar recuperación');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <h2>Recuperar contraseña</h2>
      <input type="email" placeholder="Email" {...register('email')} required />
      <button type="submit">Enviar</button>
    </form>
  );
};

export default ForgotPasswordForm;
