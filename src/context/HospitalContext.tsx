import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { HospitalContextType, Appointment, Doctor, Service } from '../types/hospital';

interface ErrorResponse {
  message: string;
}

const HospitalContext = createContext<HospitalContextType | null>(null);

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalContextProvider');
  }
  return context;
};

interface HospitalContextProviderProps {
  children: ReactNode;
}

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message || 'An error occurred');
  }
);

export const HospitalContextProvider: React.FC<HospitalContextProviderProps> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getDoctors = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<Doctor[]>('/doctors');
      setDoctors(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getServices = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<Service[]>('/services');
      setServices(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAppointments = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<Appointment[]>('/appointments');
      setAppointments(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addAppointment = async (appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post<Appointment>('/appointments', appointment);
      setAppointments(prev => [...prev, response.data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(`/appointments/${id}`);
      setAppointments(prev => prev.filter(app => app.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addDoctor = useCallback(async (doctorData: Omit<Doctor, 'id'>): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post<Doctor>('/doctors', doctorData);
      setDoctors(prev => [...prev, response.data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value: HospitalContextType = {
    appointments,
    doctors,
    services,
    loading,
    error,
    addAppointment,
    cancelAppointment,
    getDoctors,
    getServices,
    getAppointments,
    addDoctor,
  };

  return (
    <HospitalContext.Provider value={value}>
      {children}
    </HospitalContext.Provider>
  );
}; 