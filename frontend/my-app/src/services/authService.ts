// src/services/authService.ts
import axios from 'axios';

export const adminLogin = async (username: string, password: string) => {
  try {
    const response = await axios.post('http://localhost:3000/auth/admin/login', {
      username,
      password,
    });

    if (response.status !== 200) {
      throw new Error('Login failed');
    }

    const data = response.data;
    localStorage.setItem('authToken', data.token);
    return data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('authToken');
};

export const getToken = (): string | null => {
  const token = localStorage.getItem('authToken');
  console.log('Retrieved token:', token);
  return token;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

export const isAdmin = () => {
  const token = getToken();
  if (!token) {
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role === 'admin';
  } catch (error) {
    return false;
  }
};
