'use client';

/**
 * AuthContext.tsx
 * 
 * Contexto global para gestionar la autenticación de usuarios.
 * Proporciona estado y funciones para login, registro y logout.
 * Los datos del usuario se persisten en localStorage.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';

interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthReady: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // Cargar datos del localStorage al iniciar
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser) as Partial<AuthUser> & { name?: string };
        const fallbackName = userData.name || userData.email?.split('@')[0] || 'Usuario';
        const [firstName = 'Usuario', ...rest] = fallbackName.split(' ');
        const lastName = rest.join(' ') || 'Mercado';
        const normalizedUser: AuthUser = {
          id: userData.id || 'local-user',
          firstName: userData.firstName || firstName,
          lastName: userData.lastName || lastName,
          email: userData.email || 'sin-correo@kivra.com',
          phone: userData.phone || null,
        };
        setUser(normalizedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error al cargar usuario:', error);
      }
    }

    setIsAuthReady(true);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Por favor completa todos los campos');
    }

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload?.error || 'Error al iniciar sesion');
    }

    const userData = payload.user as AuthUser;
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const register = useCallback(async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }) => {
    if (!data.firstName || !data.lastName || !data.email || !data.phone || !data.password || !data.confirmPassword) {
      throw new Error('Por favor completa todos los campos');
    }

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload?.error || 'Error al registrarse');
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, isAuthReady, user, login, register, logout }),
    [isAuthenticated, isAuthReady, user, login, register, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
