export const login = async (username: string, pinCode: string) => {
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, pinCode }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login error:', errorText);
        throw new Error(errorText);
      }
  
      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('username', username);
      localStorage.setItem('gameBoardId', pinCode);
      return data;
    } catch (error: any) {
      console.error('Error logging in:', error);
      throw error;
    }
  };
  
  export const isAuthenticated = () => {
    const token = localStorage.getItem('authToken');
    return !!token;
  };
  
  export const getToken = () => {
    return localStorage.getItem('authToken');
  };
  
  export const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('gameBoardId');
  };
  