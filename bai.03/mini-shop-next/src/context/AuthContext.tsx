'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from '@/types';
import { createClient } from '@/utils/supabase/client';
import { useToast } from './ToastContext';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// Helper: Convert Supabase auth.users to App User Model
function mapSupabaseAuthUser(supabaseUser: SupabaseAuthUser): User {
  const meta = supabaseUser.user_metadata || {};
  const email = supabaseUser.email || '';
  const isAdmin = email.toLowerCase().includes('admin') || meta.role === 'ADMIN';

  return {
    id: supabaseUser.id,
    name: meta.name || meta.full_name || email.split('@')[0] || 'Khách hàng',
    email,
    phone: meta.phone || supabaseUser.phone || '',
    role: isAdmin ? 'ADMIN' : 'CUSTOMER'
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();
  const supabase = createClient();

  // Initialize and listen to Auth state changes
  useEffect(() => {
    let mounted = true;

    async function getInitialUser() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (!error && user && mounted) {
          setCurrentUser(mapSupabaseAuthUser(user));
        }
      } catch (err) {
        console.error('Error fetching initial auth user:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    getInitialUser();

    // Subscribe to auth state changes (login, logout, token refresh, cross-tabs)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(mapSupabaseAuthUser(session.user));
      } else {
        setCurrentUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Real Supabase Login
  const login = async (email: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Supabase login error:', error);
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Email hoặc mật khẩu không chính xác.');
      } else if (error.message.includes('Email not confirmed')) {
        throw new Error('Tài khoản chưa được xác nhận email. Vui lòng kiểm tra hộp thư.');
      } else {
        throw new Error(error.message || 'Đăng nhập thất bại.');
      }
    }

    if (!data.user) {
      throw new Error('Không tìm thấy thông tin người dùng.');
    }

    const user = mapSupabaseAuthUser(data.user);
    setCurrentUser(user);
    showToast(user.role === 'ADMIN' ? 'Đăng nhập Quản trị viên thành công!' : `Chào mừng ${user.name} quay trở lại!`);
    return user;
  };

  // Real Supabase Register
  const register = async (name: string, email: string, password: string, phone?: string): Promise<User> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone: phone || ''
        }
      }
    });

    if (error) {
      console.error('Supabase register error:', error);
      if (error.message.includes('User already registered')) {
        throw new Error('Địa chỉ email này đã được đăng ký tài khoản.');
      } else if (error.message.includes('Password should be at least')) {
        throw new Error('Mật khẩu cần tối thiểu 6 ký tự.');
      } else {
        throw new Error(error.message || 'Đăng ký tài khoản thất bại.');
      }
    }

    if (!data.user) {
      throw new Error('Đăng ký không thành công, vui lòng thử lại.');
    }

    const user = mapSupabaseAuthUser(data.user);
    setCurrentUser(user);
    showToast('Đăng ký tài khoản thành công!');
    return user;
  };

  // Real Supabase Logout
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      showToast('Đã đăng xuất tài khoản.');
    } catch (err) {
      console.error('Supabase logout error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
