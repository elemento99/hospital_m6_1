export interface Appointment {
  id: string;
  doctor_id: number;
  service_id: number;
  patient_name: string;
  appointment_date: string;
  created_at?: string;
  updated_at?: string;
  status: string;
  time: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  years_experience: number;
  availability: string[];
}

export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
}

export interface HospitalContextType {
  appointments: Appointment[];
  doctors: Doctor[];
  services: Service[];
  loading: boolean;
  error: string | null;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Promise<void>;
  cancelAppointment: (id: string) => Promise<void>;
  getDoctors: () => Promise<void>;
  getServices: () => Promise<void>;
  getAppointments: () => Promise<void>;
  addDoctor: (doctor: Omit<Doctor, 'id'>) => Promise<void>;
}
