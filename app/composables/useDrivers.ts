import type { Driver } from "../types";

interface DriversResponse {
  success: boolean;
  count: number;
  data: Driver[];
}

interface DriverResponse {
  success: boolean;
  data: Driver;
}

interface DeleteResponse {
  success: boolean;
  message: string;
}

export const useDrivers = () => {
  const { apiFetch } = useApi();

  const drivers = ref<Driver[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Fetch all drivers from API
  const fetchDrivers = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiFetch<DriversResponse>("/drivers");

      if (response.success) {
        drivers.value = response.data;
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = "Failed to fetch drivers";
      }
      console.error("Fetch drivers error:", err);
    } finally {
      isLoading.value = false;
    }
  };

  // Get single driver by ID
  const getDriverById = async (id: number) => {
    try {
      const response = await apiFetch<DriverResponse>(`/drivers/${id}`);
      return response.data;
    } catch (err: unknown) {
      console.error("Get driver error:", err);
      throw err;
    }
  };

  // Create new driver
  const createDriver = async (driverData: Partial<Driver>) => {
    try {
      const response = await apiFetch<{
        success: boolean;
        message: string;
        data: Driver;
      }>("/drivers", {
        method: "POST",
        body: JSON.stringify(driverData),
      });

      if (response.success) {
        // Refresh the list
        await fetchDrivers();
        return { success: true, data: response.data };
      }

      return { success: false, message: response.message };
    } catch (err: unknown) {
      console.error("Create driver error:", err);
      if (err instanceof Error) {
        return { success: false, message: err.message };
      }
      return { success: false, message: "Failed to create driver" };
    }
  };

  // Update driver
  const updateDriver = async (id: number, driverData: Partial<Driver>) => {
    try {
      const response = await apiFetch<{ success: boolean; message: string }>(
        `/drivers/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(driverData),
        },
      );

      if (response.success) {
        // Refresh the list
        await fetchDrivers();
        return { success: true };
      }

      return { success: false, message: response.message };
    } catch (err: unknown) {
      console.error("Update driver error:", err);
      if (err instanceof Error) {
        return { success: false, message: err.message };
      }
      return { success: false, message: "Failed to update driver" };
    }
  };

  // Delete driver
  const deleteDriver = async (id: number) => {
    try {
      const response = await apiFetch<DeleteResponse>(`/drivers/${id}`, {
        method: "DELETE",
      });

      if (response.success) {
        // Remove from local array
        drivers.value = drivers.value.filter(
          (driver) => driver.driver_id !== id,
        );
        return { success: true };
      }

      return { success: false, message: response.message };
    } catch (err: unknown) {
      console.error("Delete driver error:", err);
      if (err instanceof Error) {
        return { success: false, message: err.message };
      }
      return { success: false, message: "Failed to delete driver" };
    }
  };

  return {
    drivers,
    isLoading,
    error,
    fetchDrivers,
    getDriverById,
    createDriver,
    updateDriver,
    deleteDriver,
  };
};
