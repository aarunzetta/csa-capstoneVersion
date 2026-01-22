interface DashboardStats {
  totalPassengers: number;
  totalDrivers: number;
  totalRides: number;
  totalAdmins: number;
  todayRides: number;
  activeDrivers: number;
}

interface DashboardResponse {
  success: boolean;
  data: DashboardStats;
}

export const useDashboard = () => {
  const { apiFetch } = useApi();

  const stats = ref<DashboardStats>({
    totalPassengers: 0,
    totalDrivers: 0,
    totalRides: 0,
    totalAdmins: 0,
    todayRides: 0,
    activeDrivers: 0,
  });

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Fetch dashboard statistics
  const fetchStats = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiFetch<DashboardResponse>("/dashboard/stats");

      if (response.success) {
        stats.value = response.data;
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = "Failed to fetch dashboard statistics";
      }
      console.error("Fetch dashboard statistics error:", err);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    stats,
    isLoading,
    error,
    fetchStats,
  };
};
