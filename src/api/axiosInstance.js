import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:7198"; 

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("authToken");

    // Add authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for tracking
    config.metadata = config.metadata || {};
    config.metadata.startTime = new Date();

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  },
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const duration = new Date() - response.config.metadata.startTime;
    // console.log(
    //   `[${response.config.method.toUpperCase()}] ${response.config.url} - ${response.status} (${duration}ms)`,
    // );

    return response;
  },
  (error) => {
    const { response, config } = error;

    // Handle different error scenarios
    if (response) {
      switch (response.status) {
        case 400:
          console.error("Bad Request:", response.data);
          break;

        case 401:
          console.warn("Unauthorized access - token may have expired");

          if (!config.url.includes("/api/Auth/login")) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            window.location.href = "/login";
          }

          break;

        case 403:
          console.error(
            "Forbidden: You do not have permission to access this resource",
          );
          break;

        case 404:
          console.error("Not Found:", config.url);
          break;

        case 409:
          console.error("Conflict:", response.data);
          break;

        case 422:
          console.error("Unprocessable Entity:", response.data);
          break;

        case 429:
          console.error("Too Many Requests - Rate limited");
          break;

        case 500:
          console.error("Server Error:", response.data);
          break;

        case 503:
          console.error("Service Unavailable");
          break;

        default:
          console.error(`HTTP Error ${response.status}:`, response.data);
      }

      // Create error object with detailed information
      const errorMessage =
        response.data?.message ||
        response.data?.error ||
        `HTTP Error ${response.status}`;

      error.message = errorMessage;
      error.statusCode = response.status;
      error.data = response.data;
    } else if (error.request) {
      console.error("No response received:", error.request);
      error.message = "No response from server. Please check your connection.";
    } else {
      console.error("Error setting up request:", error.message);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
