import type { Ride } from "../types";

interface RidesResponse {
  success: boolean;
  count: number;
  data: Ride[];
}

interface RideResponse {
  success: boolean;
  data: Ride;
}

export const useRides = () => {
  const { apiFetch } = useApi();

  const rides = ref<Ride[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Fetch all rides from API
  const fetchRides = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiFetch<RidesResponse>("/rides");

      if (response.success) {
        rides.value = response.data;
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = "Failed to fetch rides";
      }
      console.error("Fetch rides error:", err);
    } finally {
      isLoading.value = false;
    }
  };

  // Get single ride by ID
  const getRideById = async (id: number) => {
    try {
      const response = await apiFetch<RideResponse>(`/rides/${id}`);
      return response.data;
    } catch (err: unknown) {
      console.error("Get ride error:", err);
      throw err;
    }
  };

  return {
    rides,
    isLoading,
    error,
    fetchRides,
    getRideById,
  };
};
