
import axios from 'axios';
// Import the type, not the implementation, to avoid premature loading.
import type { ChatRequestPayload, ChatResponseData, sendMessageToBackend } from './api';

// Mock the entire axios module.
jest.mock('axios');

// Cast axios to its mocked type for type-safe mocking.
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Service', () => {
  // This will hold the module instance, loaded after mocks are set.
  let api: { sendMessageToBackend: typeof sendMessageToBackend };

  // Create a reusable mock for the axios instance (apiClient).
  const mockedApiClient = {
    post: jest.fn(),
    get: jest.fn(),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  };

  beforeEach(() => {
    // Reset modules before each test to isolate them.
    jest.resetModules();

    // Configure the mock for axios.create() to return our mocked apiClient.
    // This MUST be done before requiring the module.
    mockedAxios.create.mockReturnValue(mockedApiClient as any);

    // Now, load the api module. It will get the mocked version of axios.
    api = require('./api');

    // Clear any previous mock calls.
    mockedApiClient.post.mockClear();
  });

  describe('sendMessageToBackend', () => {
    it('should send a message and return the bot response', async () => {
      const mockPayload: ChatRequestPayload = {
        message: 'Hello',
        history: [],
        user_name: 'TestUser',
      };
      const mockResponseData: ChatResponseData = { response: 'Hi there!' };

      // The response interceptor in api.ts returns response.data directly.
      // So, we mock what the function should return, not the full axios response.
      mockedApiClient.post.mockResolvedValue(mockResponseData);

      const result = await api.sendMessageToBackend(mockPayload);

      // Verify that the mock was called correctly.
      expect(mockedApiClient.post).toHaveBeenCalledTimes(1);
      expect(mockedApiClient.post).toHaveBeenCalledWith('/chat', mockPayload);

      // Verify that the function returns the expected data.
      expect(result).toEqual(mockResponseData);
    });

    it('should throw an error if the API call fails', async () => {
      const mockPayload: ChatRequestPayload = {
        message: 'Error test',
        history: [],
        user_name: 'TestUser',
      };
      const mockError = new Error('Network error');

      // Mock the post request to reject with an error.
      mockedApiClient.post.mockRejectedValue(mockError);

      // Verify that the promise is rejected and the correct error is thrown.
      await expect(api.sendMessageToBackend(mockPayload)).rejects.toThrow('Network error');
      expect(mockedApiClient.post).toHaveBeenCalledTimes(1);
    });
  });
});
