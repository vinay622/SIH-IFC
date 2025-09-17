import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored authentication on mount
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      // MOCK AUTH - Remove this when you have a real backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Mock user data based on email
      const mockUsers = {
        'farmer@test.com': { id: 1, name: 'John Farmer', email: 'farmer@test.com', role: 'farmer' },
        'seller@test.com': { id: 2, name: 'Mary Seller', email: 'seller@test.com', role: 'seller' },
        'officer@test.com': { id: 3, name: 'Admin Officer', email: 'officer@test.com', role: 'agri_officer' },
        'admin@test.com': { id: 4, name: 'Super Admin', email: 'admin@test.com', role: 'admin' }
      };
      
      const user = mockUsers[credentials.email.toLowerCase()];
      
      if (user && credentials.password === 'password123') {
        const mockToken = 'mock-jwt-token-' + Date.now();
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid credentials. Try: farmer@test.com / password123' };
      }
      
      // REAL API CODE (uncomment when you have backend):
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(credentials),
      // });

      // if (response.ok) {
      //   const data = await response.json();
      //   localStorage.setItem('token', data.token);
      //   localStorage.setItem('user', JSON.stringify(data.user));
      //   setUser(data.user);
      //   return { success: true };
      // } else {
      //   return { success: false, error: 'Invalid credentials' };
      // }
    } catch (error) {
      return { success: false, error: 'Network error' };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData) => {
    setIsLoading(true);
    try {
      // MOCK AUTH - Remove this when you have a real backend
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      // Create mock user from signup data
      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        role: userData.role,
        phone: userData.phone,
        location: userData.location,
        ...(userData.role === 'farmer' && {
          cropType: userData.cropType,
          farmSize: userData.farmSize,
          experience: userData.experience
        })
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      return { success: true };
      
      // REAL API CODE (uncomment when you have backend):
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(userData),
      // });

      // if (response.ok) {
      //   const data = await response.json();
      //   localStorage.setItem('token', data.token);
      //   localStorage.setItem('user', JSON.stringify(data.user));
      //   setUser(data.user);
      //   return { success: true };
      // } else {
      //   const errorData = await response.json();
      //   return { success: false, error: errorData.message };
      // }
    } catch (error) {
      return { success: false, error: 'Network error' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
