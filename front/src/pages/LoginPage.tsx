import React from 'react';
import LoginForm from '../components/LoginForm';
import { Link } from 'react-router-dom';

const LoginPage = () => (
  <>
    <LoginForm />
    <p>
      ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
    </p>
    <p>
      <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
    </p>
  </>
);

export default LoginPage;
