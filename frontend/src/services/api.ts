import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  file_url?: string;
}

interface ErrorResponse {
  detail: string;
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const isTransientError = (error: AxiosError): boolean => {
  return (
    axios.isAxiosError(error) &&
    (!error.response || (error.response.status >= 500 && error.response.status < 600))
  );
};

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const startTime = performance.now();
    config.headers['x-request-start-time'] = startTime;

    if (process.env.NODE_ENV !== 'production') {
      console.log(
        JSON.stringify({
          level: 'info',
          message: `API Request Started: ${config.method?.toUpperCase()} ${config.url}`,
          timestamp: new Date().toISOString(),
          method: config.method?.toUpperCase(),
          url: config.url,
        })
      );
    }

    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        JSON.stringify({
          level: 'error',
          message: 'API Request Error',
          timestamp: new Date().toISOString(),
          error: error.message,
          stack: error.stack,
        })
      );
    }
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const startTime = response.config.headers['x-request-start-time'] as number;
    const duration = performance.now() - startTime;

    if (process.env.NODE_ENV !== 'production') {
      console.log(
        JSON.stringify({
          level: 'info',
          message: `API Request Succeeded: ${response.config.method?.toUpperCase()} ${response.config.url}`,
          timestamp: new Date().toISOString(),
          method: response.config.method?.toUpperCase(),
          url: response.config.url,
          status: response.status,
          durationMs: duration.toFixed(2),
        })
      );
    }
    return response.data;
  },
  async (error: AxiosError<ErrorResponse>) => {
    const config = error.config as AxiosRequestConfig & { _retryCount?: number };
    config._retryCount = config._retryCount || 0;

    const startTime = config.headers?.['x-request-start-time'] as number;
    const duration = performance.now() - startTime;

    if (isTransientError(error) && config._retryCount < MAX_RETRIES) {
      config._retryCount++;
      const delayMs = RETRY_DELAY_MS * Math.pow(2, config._retryCount - 1);
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          JSON.stringify({
            level: 'warn',
            message: `Transient API Error: Retrying ${config.method?.toUpperCase()} ${config.url} (Attempt ${config._retryCount}/${MAX_RETRIES})`,
            timestamp: new Date().toISOString(),
            method: config.method?.toUpperCase(),
            url: config.url,
            status: error.response?.status,
            error: error.message,
            retryDelayMs: delayMs,
          })
        );
      }
      await delay(delayMs);
      return apiClient(config);
    }

    if (process.env.NODE_ENV !== 'production') {
      if (error.response) {
        console.error(
          JSON.stringify({
            level: 'error',
            message: 'API Error Response',
            timestamp: new Date().toISOString(),
            method: error.config?.method?.toUpperCase(),
            url: error.config?.url,
            status: error.response.status,
            data: error.response.data,
            durationMs: duration.toFixed(2),
            error: error.message,
            stack: error.stack,
          })
        );
      } else if (error.request) {
        console.error(
          JSON.stringify({
            level: 'error',
            message: 'Network Error: No response received',
            timestamp: new Date().toISOString(),
            method: error.config?.method?.toUpperCase(),
            url: error.config?.url,
            durationMs: duration.toFixed(2),
            error: error.message,
            stack: error.stack,
          })
        );
      } else {
        console.error(
          JSON.stringify({
            level: 'error',
            message: 'Error setting up request',
            timestamp: new Date().toISOString(),
            error: error.message,
            stack: error.stack,
          })
        );
      }
    }
    if (error.response) {
      return Promise.reject(new Error(error.response.data.detail || 'An unexpected API error occurred.'));
    }
    else if (error.request) {
      return Promise.reject(new Error('Network error: Please check your connection.'));
    }
    else {
      return Promise.reject(new Error(error.message));
    }
  }
);

export interface ChatRequestPayload {
  message: string;
  history: { user: string; assistant: string }[];
  user_name: string;
}

export interface ChatResponseData {
  response: string;
  file_url?: string;
}

export const sendMessageToBackend = async (payload: ChatRequestPayload): Promise<ChatResponseData> => {
  try {
    const data: ChatResponseData = await apiClient.post('/chat', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminTokenResponse {
  access_token: string;
  token_type: string;
}

export interface TechnicalSkill {
  id: number;
  name: string;
  category?: string;
  proficiency?: string;
  icon?: string;
}

export interface Project {
  id: number;
  title: string;
  category?: string;
  description?: string;
  technologies?: string;
  image_url?: string;
  project_url?: string;
  github_url?: string;
  is_featured: boolean;
}

export interface WorkExperience {
  id: number;
  company: string;
  position: string;
  location?: string;
  start_date: string;
  end_date?: string;
  description?: string;
  is_current: boolean;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field_of_study?: string;
  start_date: string;
  end_date?: string;
  description?: string;
}

export interface Certificate {
  id: number;
  title: string;
  issuer: string;
  date_issued?: string;
  url?: string;
  description?: string;
  is_professional: boolean;
}

export interface MemorableMoment {
  id: number;
  title: string;
  description?: string;
  date?: string;
  image_url?: string;
}

export interface CV {
  id: number;
  url: string;
  uploaded_at: string;
}

export const adminLogin = async (payload: AdminLoginRequest): Promise<AdminTokenResponse> => {
  return apiClient.post('/admin/login', payload);
};

export const getAdminProjects = async (): Promise<Project[]> => {
  return apiClient.get('/admin/projects');
};

export const createProject = async (formData: FormData): Promise<Project> => {
  return apiClient.post('/admin/projects/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const updateProject = async (id: number, formData: FormData): Promise<Project> => {
  return apiClient.put(`/admin/projects/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const deleteProject = async (id: number): Promise<void> => {
  return apiClient.delete(`/admin/projects/${id}`);
};

export const getAdminSkills = async (): Promise<TechnicalSkill[]> => {
  return apiClient.get('/admin/skills');
};

export const createSkill = async (formData: FormData): Promise<TechnicalSkill> => {
  return apiClient.post('/admin/skills/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const updateSkill = async (id: number, skill: Partial<TechnicalSkill>): Promise<TechnicalSkill> => {
  return apiClient.put(`/admin/skills/${id}`, skill);
};

export const deleteSkill = async (id: number): Promise<void> => {
  return apiClient.delete(`/admin/skills/${id}`);
};

export const getAdminExperience = async (): Promise<WorkExperience[]> => {
  return apiClient.get('/admin/experience');
};

export const createExperience = async (experience: any): Promise<WorkExperience> => {
  return apiClient.post('/admin/experience', experience);
};

export const updateExperience = async (id: number, experience: any): Promise<WorkExperience> => {
  return apiClient.put(`/admin/experience/${id}`, experience);
};

export const deleteExperience = async (id: number): Promise<void> => {
  return apiClient.delete(`/admin/experience/${id}`);
};

export const getAdminEducation = async (): Promise<Education[]> => {
  return apiClient.get('/admin/education');
};

export const createEducation = async (education: any): Promise<Education> => {
  return apiClient.post('/admin/education', education);
};

export const updateEducation = async (id: number, education: any): Promise<Education> => {
  return apiClient.put(`/admin/education/${id}`, education);
};

export const deleteEducation = async (id: number): Promise<void> => {
  return apiClient.delete(`/admin/education/${id}`);
};

export const getAdminCertificates = async (): Promise<Certificate[]> => {
  return apiClient.get('/admin/certificates');
};

export const createCertificate = async (formData: FormData): Promise<Certificate> => {
  return apiClient.post('/admin/certificates/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const updateCertificate = async (id: number, formData: FormData): Promise<Certificate> => {
  return apiClient.put(`/admin/certificates/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const deleteCertificate = async (id: number): Promise<void> => {
  return apiClient.delete(`/admin/certificates/${id}`);
};

export const getAdminMoments = async (): Promise<MemorableMoment[]> => {
  return apiClient.get('/admin/moments');
};

export const createMoment = async (formData: FormData): Promise<MemorableMoment> => {
  return apiClient.post('/admin/moments/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const updateMoment = async (id: number, formData: FormData): Promise<MemorableMoment> => {
  return apiClient.put(`/admin/moments/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const deleteMoment = async (id: number): Promise<void> => {
  return apiClient.delete(`/admin/moments/${id}`);
};

export const getAdminCVs = async (): Promise<CV[]> => {
  return apiClient.get('/admin/cv');
};

export const uploadCV = async (formData: FormData): Promise<CV> => {
  return apiClient.post('/admin/cv/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const deleteCV = async (id: number): Promise<void> => {
  return apiClient.delete(`/admin/cv/${id}`);
};

export const getLogFiles = async (): Promise<string[]> => {
  return apiClient.get('/admin/logs');
};

export const getLogContent = async (filename: string, limit = 100, offset = 0): Promise<any> => {
  return apiClient.get(`/admin/logs/${filename}`, {
    params: { limit, offset }
  });
};

export { };

