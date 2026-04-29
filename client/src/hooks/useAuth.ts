import { useState, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuth, clearAuth, user, isAuthenticated } = useAuthStore();

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      // Backend returns: { accessToken, refreshToken, user, message }
      const { accessToken, refreshToken, user: userData } = res.data;
      if (!accessToken || !userData) {
        throw new Error('Invalid response from server');
      }
      setAuth(userData, accessToken, refreshToken);
      return { success: true };
    } catch (err: any) {
      // Axios error: the actual message is in err.response.data.error
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'Login failed. Please try again.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, [setAuth]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      const { accessToken, refreshToken, user: userData } = res.data;
      if (!accessToken || !userData) {
        throw new Error('Invalid response from server');
      }
      setAuth(userData, accessToken, refreshToken);
      return { success: true };
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'Registration failed. Please try again.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, [setAuth]);

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  return {
    login,
    register,
    logout,
    isLoading,
    error,
    clearError: () => setError(null),
    user,
    isAuthenticated,
  };
}
