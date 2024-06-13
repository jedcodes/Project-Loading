export const adminLogin = async (username: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3000/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login error:', errorText);
        throw new Error(errorText);
      }
  
      const data = await response.json();
      localStorage.setItem('authToken', data.token); // Store the JWT token
      return data;
    } catch (error: any) {
      console.error('Error logging in:', error);
      throw error;
    }
  };
  
  export const logout = () => {
    localStorage.removeItem('authToken');
  };
  
  export const getToken = () => {
    return localStorage.getItem('authToken');
  };
  
  export const isAuthenticated = () => {
    return !!localStorage.getItem('authToken');
  };
  