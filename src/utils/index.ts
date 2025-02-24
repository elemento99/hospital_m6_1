import { AxiosError } from 'axios';

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString();
};

export const formatTime = (time: string): string => {
  return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError && error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

export const getUserRole = (): string | null => {
  return localStorage.getItem('role');
};

export const clearAuth = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
};

export const setAuth = (token: string, role: string): void => {
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
}; 