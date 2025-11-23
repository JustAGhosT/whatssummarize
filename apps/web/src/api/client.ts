import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private client: AxiosInstance;
  private authToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for auth token
    this.client.interceptors.request.use(
      (config) => {
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  // Auth methods
  async register(email: string, password: string, name?: string) {
    return this.post('/auth/register', { email, password, name });
  }

  async login(email: string, password: string) {
    const response = await this.post('/auth/login', { email, password });
    if (response.token) {
      this.setAuthToken(response.token);
    }
    return response;
  }

  logout() {
    this.setAuthToken(null);
  }

  // Group methods
  getGroups() {
    return this.get('/groups');
  }

  getGroup(id: string) {
    return this.get(`/groups/${id}`);
  }

  createGroup(name: string, description?: string) {
    return this.post('/groups', { name, description });
  }

  getGroupMessages(groupId: string, page = 1, limit = 50) {
    return this.get(`/groups/${groupId}/messages?page=${page}&limit=${limit}`);
  }

  // HTTP methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();

// Initialize auth token from localStorage if it exists
const savedToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
if (savedToken) {
  apiClient.setAuthToken(savedToken);
}
