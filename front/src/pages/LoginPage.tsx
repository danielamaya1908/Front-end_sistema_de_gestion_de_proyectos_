import React from 'react';
import LoginForm from '../components/LoginForm';
import { Link } from 'react-router-dom';

const LoginPage = () => (
  <>
    <LoginForm />
    <div className='center column'>
      <p>
        ¿No tienes cuenta? <Link to="/register" className='a'>Regístrate</Link>
      </p>
      <p>
        <Link to="/forgot-password" className='a'>¿Olvidaste tu contraseña?</Link>
      </p>
    </div>
    
  </>
);

export default LoginPage;
