import axios from 'axios';
const API_URL = 'https://back-endsistemadegestiondeproyectos-production.up.railway.app/api/auth/login';

export const login = async (email: string, password: string): Promise<string> => {
  try {
    const response = await axios.post(
      API_URL,
      { email, password },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }
      }
    );

    console.log(response);

    return response.data.token;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Error al iniciar sesión');
  }
};

export const register = async (email: string, password: string): Promise<void> => {
  // Ejemplo de petición a una API
  await axios.post('/api/register', { email, password });
};

export const forgotPassword = async (email: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/forgot-password`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      throw new Error(errorData.message || 'Failed to send recovery email');
    }

    // Si hay respuesta exitosa, parsearla
    if (responseText) {
      JSON.parse(responseText);
    }
    
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};