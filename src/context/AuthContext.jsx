import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockApi } from '../api/mockApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('farmer'); // 'farmer' | 'admin'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await mockApi.getProfile();
        setUser(profile);
      } catch (e) {
        console.error('Failed to load profile', e);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (mobile, password) => {
    setLoading(true);
    try {
      const profile = await mockApi.getProfile();
      setUser({ ...profile, mobile });
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const updated = await mockApi.updateProfile(userData);
      setUser(updated);
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
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
