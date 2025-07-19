import React from 'react';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => (
  <>
    <ForgotPasswordForm />
    <p>
      <Link to="/login">Volver al login</Link>
    </p>
  </>
);

export default ForgotPasswordPage;
