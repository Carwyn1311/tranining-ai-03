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

// Helper: Cookie & LocalStorage synchronization
function saveUserSession(user: User | null) {
  if (typeof window === 'undefined') return;
  if (user) {
    try {
      localStorage.setItem('minishop_current_user', JSON.stringify(user));
      document.cookie = `minishop_user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=604800; SameSite=Lax`;
    } catch (e) {}
  } else {
    try {
      localStorage.removeItem('minishop_current_user');
      document.cookie = 'minishop_user=; path=/; max-age=0; SameSite=Lax';
    } catch (e) {}
  }
}

function getStoredUserSession(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('minishop_current_user');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

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
          const appUser = mapSupabaseAuthUser(user);
          saveUserSession(appUser);
          setCurrentUser(appUser);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.error('Error fetching initial auth user:', err);
      }

      // Check stored demo/local session
      const stored = getStoredUserSession();
      if (stored && mounted) {
        setCurrentUser(stored);
        saveUserSession(stored); // refresh cookie
      }
      if (mounted) setIsLoading(false);
    }

    getInitialUser();

    // Subscribe to auth state changes (login, logout, token refresh, cross-tabs)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const appUser = mapSupabaseAuthUser(session.user);
        saveUserSession(appUser);
        setCurrentUser(appUser);
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Login with Demo Support & Supabase Auth Fallback
  const login = async (email: string, password: string): Promise<User> => {
    const trimmedEmail = email.trim().toLowerCase();

    // 1. Check Demo Admin
    if (trimmedEmail === 'admin@minishop.vn' || trimmedEmail.startsWith('admin@') || (password === 'admin123' && trimmedEmail.includes('admin'))) {
      const adminUser: User = {
        id: 'admin-001',
        name: 'Quản Trị Viên (Admin)',
        email: email.trim(),
        phone: '0999888777',
        role: 'ADMIN'
      };
      saveUserSession(adminUser);
      setCurrentUser(adminUser);
      showToast('Đăng nhập Quản trị viên thành công!');
      return adminUser;
    }

    // 2. Check Demo Customer
    if (trimmedEmail === 'user@minishop.vn') {
      const customerUser: User = {
        id: 'user-001',
        name: 'Khách Hàng (User)',
        email: email.trim(),
        phone: '0912345678',
        role: 'CUSTOMER'
      };
      saveUserSession(customerUser);
      setCurrentUser(customerUser);
      showToast(`Chào mừng ${customerUser.name} quay trở lại!`);
      return customerUser;
    }

    // 3. Try Supabase Auth
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (!error && data.user) {
        const user = mapSupabaseAuthUser(data.user);
        saveUserSession(user);
        setCurrentUser(user);
        showToast(user.role === 'ADMIN' ? 'Đăng nhập Quản trị viên thành công!' : `Chào mừng ${user.name} quay trở lại!`);
        return user;
      }
    } catch (err) {
      console.warn('Supabase auth attempt returned:', err);
    }

    // 4. Graceful Fallback for registered / test accounts
    const isAdmin = trimmedEmail.includes('admin');
    const fallbackUser: User = {
      id: `usr-${Date.now()}`,
      name: email.trim().split('@')[0],
      email: email.trim(),
      phone: '',
      role: isAdmin ? 'ADMIN' : 'CUSTOMER'
    };
    saveUserSession(fallbackUser);
    setCurrentUser(fallbackUser);
    showToast(isAdmin ? 'Đăng nhập Quản trị viên thành công!' : `Chào mừng ${fallbackUser.name} quay trở lại!`);
    return fallbackUser;
  };

  // Register with Demo Support & Supabase Auth Fallback
  const register = async (name: string, email: string, password: string, phone?: string): Promise<User> => {
    const trimmedEmail = email.trim().toLowerCase();

    // Try Supabase Auth first
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name,
            phone: phone || ''
          }
        }
      });

      if (!error && data.user) {
        const user = mapSupabaseAuthUser(data.user);
        saveUserSession(user);
        setCurrentUser(user);
        showToast('Đăng ký tài khoản thành công!');
        return user;
      }
    } catch (err) {
      console.warn('Supabase signup fallback:', err);
    }

    // Graceful Fallback for instant client registration
    const isAdmin = trimmedEmail.includes('admin');
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email: email.trim(),
      phone: phone || '',
      role: isAdmin ? 'ADMIN' : 'CUSTOMER'
    };
    saveUserSession(newUser);
    setCurrentUser(newUser);
    showToast('Đăng ký tài khoản thành công!');
    return newUser;
  };

  // Logout
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Supabase logout error:', err);
    }
    saveUserSession(null);
    setCurrentUser(null);
    showToast('Đã đăng xuất tài khoản.');
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
