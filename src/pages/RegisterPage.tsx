import RegisterForm from '../components/RegisterForm';
import { Link } from 'react-router-dom';

const RegisterPage = () => (
  <>
    <RegisterForm />
    <p>
      ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
    </p>
  </>
);

export default RegisterPage;
