'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { DEFAULT_USERS } from '@/data/initialData';
import { useToast } from './ToastContext';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, role?: 'CUSTOMER' | 'ADMIN') => User;
  logout: () => void;
  register: (name: string, email: string, phone?: string) => User;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem('minishop_next_user');
      if (stored) setCurrentUser(JSON.parse(stored));
    } catch (e) {
      console.error('Failed to load user', e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (currentUser) {
        localStorage.setItem('minishop_next_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('minishop_next_user');
      }
    } catch (e) {
      console.error('Failed to save user', e);
    }
  }, [currentUser, isLoaded]);

  const login = (email: string, role: 'CUSTOMER' | 'ADMIN' = 'CUSTOMER') => {
    const isAdmin = email.toLowerCase().includes('admin') || role === 'ADMIN';
    const user: User = {
      id: isAdmin ? 2 : Date.now(),
      name: isAdmin ? 'Admin Quản Trị' : email.split('@')[0],
      email,
      role: isAdmin ? 'ADMIN' : 'CUSTOMER'
    };
    setCurrentUser(user);
    showToast(isAdmin ? 'Đăng nhập Quản trị viên thành công!' : `Chào mừng ${user.name} quay trở lại!`);
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Đã đăng xuất tài khoản.');
  };

  const register = (name: string, email: string, phone?: string) => {
    const newUser: User = {
      id: Date.now(),
      name,
      email,
      phone,
      role: 'CUSTOMER'
    };
    setCurrentUser(newUser);
    showToast('Đăng ký tài khoản thành công!');
    return newUser;
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
