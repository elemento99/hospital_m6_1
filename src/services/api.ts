import axios, { AxiosInstance, AxiosError } from 'axios';
import { config } from '../config';
import { ApiError, LoginRequest, RegisterRequest, LoginResponse, AppointmentRequest } from '../types/api';
import { Doctor, Appointment } from '../types/hospital';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: config.defaultApiUrl,
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
        throw new Error(error.message || 'An error occurred');
      }
    );
  }

  public async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  }

  public async register(data: RegisterRequest): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>('/auth/register', data);
    return response.data;
  }

  public async getDoctors(): Promise<Doctor[]> {
    const response = await this.api.get<Doctor[]>('/doctors');
    return response.data;
  }

  public async getAppointments(): Promise<Appointment[]> {
    const response = await this.api.get<Appointment[]>('/appointments');
    return response.data;
  }

  public async createAppointment(data: AppointmentRequest): Promise<Appointment> {
    const response = await this.api.post<Appointment>('/appointments', data);
    return response.data;
  }

  public async cancelAppointment(id: string): Promise<void> {
    await this.api.delete(`/appointments/${id}`);
  }

  public async updateApiUrl(url: string): Promise<void> {
    this.api.defaults.baseURL = url;
  }
}

export const apiService = new ApiService(); 