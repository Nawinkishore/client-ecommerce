import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Authorization Bearer token from localStorage if present as fallback
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Global response error handler with automatic token refresh via cookie or payload
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      typeof window !== "undefined"
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      try {
        const refreshRes = await axios.post(
          `${API_BASE_URL}/api/v1/auth/refresh`,
          refreshToken ? { refreshToken } : {},
          { withCredentials: true }
        );

        if (refreshRes.data?.success) {
          const { accessToken: newAccess, refreshToken: newRefresh } = refreshRes.data.data || {};
          if (newAccess) {
            localStorage.setItem("token", newAccess);
            originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          }
          if (newRefresh) {
            localStorage.setItem("refreshToken", newRefresh);
          }

          return apiClient(originalRequest);
        }
      } catch (refreshErr) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      }
    }

    const message =
      error.response?.data?.error?.message || error.message || "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);


