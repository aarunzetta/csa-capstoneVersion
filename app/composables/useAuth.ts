import type { Admin } from "../types";

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  admin: Admin;
}

export const useAuth = () => {
  const { apiFetch, setToken, removeToken, getToken } = useApi();
  const router = useRouter();

  const currentAdmin = useState<Admin | null>("currentAdmin", () => null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Login function
  const login = async (username: string, password: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      if (response.success) {
        // Save token
        setToken(response.token);

        // Save admin data
        currentAdmin.value = response.admin;

        // Redirect to dashboard
        await router.push("/dashboard");

        return { success: true };
      } else {
        error.value = response.message;
        return { success: false, message: response.message };
      }
    } catch (err: unknown) {
      console.error("Login error:", err);

      if (err instanceof Error) {
        error.value = err.message;
        return { success: false, message: err.message };
      }

      error.value = "Login failed";
      return { success: false, message: "Login failed" };
    } finally {
      isLoading.value = false;
    }
  };

  // Logout function
  const logout = async () => {
    removeToken();
    currentAdmin.value = null;
    await router.push("/");
  };

  // Check if user is authenticated
  const isAuthenticated = computed(() => {
    return !!getToken();
  });

  // Fetch current admin info
  const fetchCurrentAdmin = async () => {
    try {
      const response = await apiFetch<{ success: boolean; admin: Admin }>(
        "/auth/me",
      );

      if (response.success) {
        currentAdmin.value = response.admin;
      }
    } catch (err) {
      console.error("Failed to fetch current admin:", err);
      // If token is invalid, logout
      await logout();
    }
  };

  // Initialize auth state on app load
  const initAuth = async () => {
    if (isAuthenticated.value && !currentAdmin.value) {
      await fetchCurrentAdmin();
    }
  };

  return {
    currentAdmin,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated,
    fetchCurrentAdmin,
    initAuth,
  };
};
