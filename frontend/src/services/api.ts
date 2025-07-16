import axios, { AxiosError, AxiosResponse } from 'axios';

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
    // For example, you could retrieve a token from localStorage here.
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    // Handle request errors (e.g., network issues before the request is sent).
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Use this to handle responses globally.
apiClient.interceptors.response.use(
  // Any status code that lie within the range of 2xx cause this function to trigger
  (response: AxiosResponse) => response.data,
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  (error: AxiosError<ErrorResponse>) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx.
      console.error('API Error Response:', error.response.data);
      // Here, we return a consistent error message from the server's 'detail' field.
      return Promise.reject(new Error(error.response.data.detail || 'An unexpected API error occurred.'));
    } else if (error.request) {
      // The request was made but no response was received.
      console.error('Network Error:', error.request);
      return Promise.reject(new Error('Network error: Please check your connection.'));
    } else {
      // Something happened in setting up the request that triggered an Error.
      console.error('Error:', error.message);
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
    // The interceptor will automatically handle the response data extraction.
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

