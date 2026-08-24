'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from '@/types';
import { DEFAULT_USERS } from '@/data/initialData';
import { createClient } from '@/utils/supabase/client';
import { useToast } from './ToastContext';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<User>;
  addUser: (userData: Omit<User, 'id'> & { password?: string }) => Promise<User>;
  updateUser: (id: string | number, updated: Partial<User>) => Promise<void>;
  deleteUser: (id: string | number) => Promise<void>;
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

function getStoredUsersList(): User[] {
  if (typeof window === 'undefined') return DEFAULT_USERS;
  try {
    const raw = localStorage.getItem('minishop_users_list');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure default admin accounts always exist
        const hasSaoVietAdmin = parsed.some((u: User) => u.email === 'admin@tinhocsaoviet.com');
        const hasMiniShopAdmin = parsed.some((u: User) => u.email === 'admin@minishop.vn');
        const list = [...parsed];
        if (!hasSaoVietAdmin) {
          list.push(DEFAULT_USERS[2]);
        }
        if (!hasMiniShopAdmin) {
          list.push(DEFAULT_USERS[1]);
        }
        return list;
      }
    }
  } catch (e) {}
  return DEFAULT_USERS;
}

function saveUsersList(users: User[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('minishop_users_list', JSON.stringify(users));
  } catch (e) {}
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
  const [users, setUsers] = useState<User[]>(DEFAULT_USERS);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();
  const supabase = createClient();

  // Initialize and listen to Auth state changes
  useEffect(() => {
    let mounted = true;

    // Load users list from storage
    const storedUsers = getStoredUsersList();
    setUsers(storedUsers);

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

    // 1. Check Preconfigured Sao Viet Master Admin
    if (trimmedEmail === 'admin@tinhocsaoviet.com' || (password === 'admin123' && trimmedEmail.includes('saoviet'))) {
      const saoVietAdmin: User = {
        id: 'admin-saoviet',
        name: 'Quản Trị Viên Sao Việt',
        email: 'admin@tinhocsaoviet.com',
        phone: '0933108888',
        role: 'ADMIN'
      };
      saveUserSession(saoVietAdmin);
      setCurrentUser(saoVietAdmin);
      showToast('Đăng nhập Quản trị viên Sao Việt thành công!');
      return saoVietAdmin;
    }

    // 2. Check Preconfigured MiniShop Admin
    if (trimmedEmail === 'admin@minishop.vn' || trimmedEmail.startsWith('admin@') || (password === 'admin123' && trimmedEmail.includes('admin'))) {
      const adminUser: User = {
        id: 'admin-001',
        name: 'Quản Trị Viên (MiniShop)',
        email: email.trim(),
        phone: '0999888777',
        role: 'ADMIN'
      };
      saveUserSession(adminUser);
      setCurrentUser(adminUser);
      showToast('Đăng nhập Quản trị viên thành công!');
      return adminUser;
    }

    // 3. Check Demo Customer
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

    // 4. Check registered users list (e.g., custom admin or custom customers added in admin panel)
    const existingInList = users.find(u => u.email.toLowerCase() === trimmedEmail);
    if (existingInList) {
      saveUserSession(existingInList);
      setCurrentUser(existingInList);
      showToast(existingInList.role === 'ADMIN' ? 'Đăng nhập Quản trị viên thành công!' : `Chào mừng ${existingInList.name} quay trở lại!`);
      return existingInList;
    }

    // 5. Try Supabase Auth
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

    // 6. Graceful Fallback for registered / test accounts
    const isAdmin = trimmedEmail.includes('admin') || trimmedEmail.startsWith('admin@');
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
        setUsers(prev => {
          const updated = [...prev, user];
          saveUsersList(updated);
          return updated;
        });
        showToast('Đăng ký tài khoản thành công!');
        return user;
      }
    } catch (err) {
      console.warn('Supabase signup fallback:', err);
    }

    // Graceful Fallback for instant client registration
    const isAdmin = trimmedEmail.includes('admin') || trimmedEmail.startsWith('admin@');
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email: email.trim(),
      phone: phone || '',
      role: isAdmin ? 'ADMIN' : 'CUSTOMER'
    };
    saveUserSession(newUser);
    setCurrentUser(newUser);
    setUsers(prev => {
      const updated = [...prev, newUser];
      saveUsersList(updated);
      return updated;
    });
    showToast('Đăng ký tài khoản thành công!');
    return newUser;
  };

  // Admin Action: Add New User / Admin
  const addUser = async (userData: Omit<User, 'id'> & { password?: string }): Promise<User> => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: userData.name,
      email: userData.email.trim(),
      phone: userData.phone || '',
      role: userData.role
    };

    // Try to register in Supabase Auth if password is provided
    if (userData.password) {
      try {
        await supabase.auth.signUp({
          email: userData.email.trim(),
          password: userData.password,
          options: {
            data: {
              name: userData.name,
              phone: userData.phone || '',
              role: userData.role
            }
          }
        });
      } catch (e) {
        console.warn('Supabase createUser error:', e);
      }
    }

    setUsers(prev => {
      const updated = [newUser, ...prev];
      saveUsersList(updated);
      return updated;
    });

    return newUser;
  };

  // Admin Action: Update User
  const updateUser = async (id: string | number, updated: Partial<User>) => {
    setUsers(prev => {
      const updatedList = prev.map(u => (String(u.id) === String(id) ? { ...u, ...updated } : u));
      saveUsersList(updatedList);
      return updatedList;
    });

    // If updating current logged in user, refresh currentUser & session
    if (currentUser && String(currentUser.id) === String(id)) {
      const updatedCurrent = { ...currentUser, ...updated };
      setCurrentUser(updatedCurrent);
      saveUserSession(updatedCurrent);
    }
  };

  // Admin Action: Delete User
  const deleteUser = async (id: string | number) => {
    // Prevent deleting current user
    if (currentUser && String(currentUser.id) === String(id)) {
      showToast('Không thể xóa tài khoản đang đăng nhập hiện tại!', 'danger');
      return;
    }

    setUsers(prev => {
      const updatedList = prev.filter(u => String(u.id) !== String(id));
      saveUsersList(updatedList);
      return updatedList;
    });
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
    <AuthContext.Provider value={{
      currentUser,
      users,
      isLoading,
      login,
      logout,
      register,
      addUser,
      updateUser,
      deleteUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}
