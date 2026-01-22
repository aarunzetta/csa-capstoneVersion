export const useApi = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase || "http://localhost:5000/api";

  // Get token from localStorage
  const getToken = () => {
    if (import.meta.client) {
      return localStorage.getItem("auth_token");
    }
    return null;
  };

  // Set token to localStorage
  const setToken = (token: string) => {
    if (import.meta.client) {
      localStorage.setItem("auth_token", token);
    }
  };

  // Remove token from localStorage
  const removeToken = () => {
    if (import.meta.client) {
      localStorage.removeItem("auth_token");
    }
  };

  // Create authorized fetch with token
  const apiFetch = async <T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> => {
    const token = getToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    // Add Authorization header if token exists
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "An error occurred",
      }));
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`,
      );
    }

    return response.json();
  };

  return {
    apiFetch,
    getToken,
    setToken,
    removeToken,
    baseURL,
  };
};
