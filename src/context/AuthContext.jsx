import React, { createContext, useContext, useState, useEffect } from 'react';
import { realApi } from '../api/realApi';
import { mockApi } from '../api/mockApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('farmer'); // 'farmer' | 'admin'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('khet_saathi_access_token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const profile = await realApi.getProfile();
        setUser(profile);
        setRole(profile.role || 'farmer');
      } catch (e) {
        console.warn('Backend unauthenticated or token expired:', e);
        localStorage.removeItem('khet_saathi_access_token');
        localStorage.removeItem('khet_saathi_refresh_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (mobileOrEmail, password) => {
    setLoading(true);
    try {
      const profile = await realApi.login(mobileOrEmail, password);
      setUser(profile);
      setRole(profile.role || 'farmer');
      return { success: true, user: profile };
    } catch (e) {
      console.error('Login error:', e);
      return { success: false, message: e.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const profile = await realApi.register(userData);
      setUser(profile);
      setRole(profile.role || 'farmer');
      return { success: true, user: profile };
    } catch (e) {
      console.error('Registration error:', e);
      return { success: false, message: e.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('khet_saathi_access_token');
    localStorage.removeItem('khet_saathi_refresh_token');
    localStorage.removeItem('khet_saathi_user');
    setUser(null);
  };

  const toggleRole = () => {
    setRole(prev => (prev === 'farmer' ? 'admin' : 'farmer'));
  };

  return (
    <AuthContext.Provider value={{ user, role, setRole, toggleRole, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
