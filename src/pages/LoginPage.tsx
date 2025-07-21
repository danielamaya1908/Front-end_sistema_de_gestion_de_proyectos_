import LoginForm from '../components/LoginForm';
import { Link } from 'react-router-dom';

const LoginPage = () => (
  <>
    <LoginForm />
    <div className='center column'>
      <p style={{color: '#94c7ff'}}>
        ¿No tienes cuenta? <Link to="/register" className='a'>Regístrate</Link>
      </p>
      <p>
        <Link to="/forgot-password" className='a'>¿Olvidaste tu contraseña?</Link>
      </p>
    </div>
    
  </>
);

export default LoginPage;
