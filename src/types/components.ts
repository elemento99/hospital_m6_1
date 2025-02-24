import { ReactNode } from 'react';
import { Doctor, Appointment } from './hospital';

export interface LayoutProps {
  children: ReactNode;
}

export interface DoctorCardProps {
  doctor: Doctor;
}

export interface AppointmentCardProps {
  appointment: Appointment;
  onCancel?: (id: string) => void;
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
}

export interface ErrorAlertProps {
  message: string;
  onClose?: () => void;
}

export interface ConfirmModalProps {
  show: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'user';
} 