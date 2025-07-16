import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';

// Define the structure of a message object for the UI.
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Define the structure for API error responses for consistent error handling.
interface ErrorResponse {
  detail: string;
}

// --- Configuration for Retries ---
const MAX_RETRIES = 3; // Maximum number of retries for transient errors
const RETRY_DELAY_MS = 1000; // Initial delay in milliseconds before retrying

// Function to introduce a delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Function to check if an error is transient and should be retried
const isTransientError = (error: AxiosError): boolean => {
  // Retry on network errors (no response) or 5xx server errors
  return (
    axios.isAxiosError(error) &&
    (!error.response || (error.response.status >= 500 && error.response.status < 600))
  );
};

// Create a single, configured axios instance for the entire application.
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Set a timeout for requests to prevent them from hanging indefinitely.
  timeout: 10000,
});

// --- Axios Interceptors ---
// Interceptors are middleware that can globally handle requests and responses.

// Request Interceptor: Use this to inject authentication tokens, logs, or other headers.
apiClient.interceptors.request.use(
  (config) => {
    const startTime = performance.now();
    // Store start time for response interceptor
    config.headers['x-request-start-time'] = startTime;

    console.log(
      JSON.stringify({
        level: 'info',
        message: `API Request Started: ${config.method?.toUpperCase()} ${config.url}`,
        timestamp: new Date().toISOString(),
        method: config.method?.toUpperCase(),
        url: config.url,
      })
    );
    // For example, you could retrieve a token from localStorage here.
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    console.error(
      JSON.stringify({
        level: 'error',
        message: 'API Request Error',
        timestamp: new Date().toISOString(),
        error: error.message,
        stack: error.stack,
      })
    );
    return Promise.reject(error);
  }
);

// Response Interceptor: Use this to handle responses globally.
apiClient.interceptors.response.use(
  // Any status code that lie within the range of 2xx cause this function to trigger
  (response: AxiosResponse) => {
    const startTime = response.config.headers['x-request-start-time'] as number;
    const duration = performance.now() - startTime;

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
    return response.data;
  },
  async (error: AxiosError<ErrorResponse>) => {
    const config = error.config as AxiosRequestConfig & { _retryCount?: number };
    config._retryCount = config._retryCount || 0;

    const startTime = config.headers?.['x-request-start-time'] as number;
    const duration = performance.now() - startTime;

    if (isTransientError(error) && config._retryCount < MAX_RETRIES) {
      config._retryCount++;
      const delayMs = RETRY_DELAY_MS * Math.pow(2, config._retryCount - 1); // Exponential backoff
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
      await delay(delayMs);
      return apiClient(config); // Retry the request
    }

    // Log final error after retries or for non-transient errors
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
      return Promise.reject(new Error(error.response.data.detail || 'An unexpected API error occurred.'));
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
      return Promise.reject(new Error('Network error: Please check your connection.'));
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
      return Promise.reject(new Error(error.message));
    }
  }
);


// --- Type-Safe API Contracts ---

// Define the structure of the request payload for the chat endpoint.
export interface ChatRequestPayload {
  message: string;
  history: { user: string; assistant: string }[];
  user_name: string;
}

// Define the structure of the successful response from the chat endpoint.
export interface ChatResponseData {
  response: string;
}


// --- API Service Functions ---

/**
 * Sends a message to the backend chatbot and returns its response.
 * @param payload - The data to be sent to the chat endpoint.
 * @returns A promise that resolves to the chatbot's response.
 */
export const sendMessageToBackend = async (payload: ChatRequestPayload): Promise<ChatResponseData> => {
  try {
    // The interceptor will automatically handle the response data extraction and retries.
    const data: ChatResponseData = await apiClient.post('/chat', payload);
    return data;
  } catch (error) {
    // The interceptor handles logging, so we just re-throw for the hook to catch.
    throw error;
  }
};

// You can add other type-safe API functions here. For example:
export interface Project {
  id: string;
  name: string;
  description: string;
}

export const getProjects = async (): Promise<Project[]> => {
  try {
    const data: Project[] = await apiClient.get('/projects');
    return data;
  } catch (error) {
    throw error;
  }
};

export {};

