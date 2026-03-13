import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface Restaurant {
  id: number;
  name: string;
  address: string;
  city: string;
  neighborhood?: string | null;
  region?: string | null;
  state: string;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  verified: boolean;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    const url = `${this.baseURL}${endpoint}${queryString ? '?' + queryString : ''}`;
    const response = await axios.get(url);
    return response.data;
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    const response = await axios.post(`${this.baseURL}${endpoint}`, data);
    return response.data;
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    const response = await axios.put(`${this.baseURL}${endpoint}`, data);
    return response.data;
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await axios.delete(`${this.baseURL}${endpoint}`);
    return response.data;
  }
}

export const api = new ApiClient(API_BASE_URL);

export const restaurantApi = {
  getAll: (filters?: {
    city?: string;
    neighborhood?: string;
    region?: string;
    search?: string;
    verified?: boolean;
    limit?: number;
    offset?: number;
  }) => api.get<Restaurant[]>('/restaurants', filters),

  getById: (id: number) => api.get<Restaurant>(`/restaurants/${id}`),

  create: (data: Partial<Restaurant>) => api.post<Restaurant>('/restaurants', data),

  update: (id: number, data: Partial<Restaurant>) => 
    api.put<Restaurant>(`/restaurants/${id}`, data),

  delete: (id: number) => api.delete(`/restaurants/${id}`),

  getCities: () => api.get<string[]>('/restaurants/cities'),

  getNeighborhoods: (city?: string) => 
    api.get<string[]>('/restaurants/neighborhoods', city ? { city } : undefined),

  getRegions: () => api.get<string[]>('/restaurants/regions'),
};
