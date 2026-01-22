import type { Passenger } from "../types";

interface PassengersResponse {
  success: boolean;
  count: number;
  data: Passenger[];
}

interface PassengerResponse {
  success: boolean;
  data: Passenger;
}

interface DeleteResponse {
  success: boolean;
  message: string;
}

export const usePassengers = () => {
  const { apiFetch } = useApi();

  const passengers = ref<Passenger[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Fetch all passengers from API
  const fetchPassengers = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiFetch<PassengersResponse>("/passengers");

      if (response.success) {
        passengers.value = response.data;
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = "Failed to fetch passengers";
      }
      console.error("Fetch passengers error:", err);
    } finally {
      isLoading.value = false;
    }
  };

  // Get single passenger by ID
  const getPassengerById = async (id: number) => {
    try {
      const response = await apiFetch<PassengerResponse>(`/passengers/${id}`);
      return response.data;
    } catch (err: unknown) {
      console.error("Get passenger error:", err);
      throw err;
    }
  };

  // Create new passenger
  const createPassenger = async (
    passengerData: Partial<Passenger> & { password: string },
  ) => {
    try {
      const response = await apiFetch<{
        success: boolean;
        message: string;
        data: Passenger;
      }>("/passengers", {
        method: "POST",
        body: JSON.stringify(passengerData),
      });

      if (response.success) {
        // Refresh the list
        await fetchPassengers();
        return { success: true, data: response.data };
      }

      return { success: false, message: response.message };
    } catch (err: unknown) {
      console.error("Create passenger error:", err);
      if (err instanceof Error) {
        return { success: false, message: err.message };
      }
      return { success: false, message: "Failed to create passenger" };
    }
  };

  // Update passenger
  const updatePassenger = async (
    id: number,
    passengerData: Partial<Passenger>,
  ) => {
    try {
      const response = await apiFetch<{ success: boolean; message: string }>(
        `/passengers/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(passengerData),
        },
      );

      if (response.success) {
        // Refresh the list
        await fetchPassengers();
        return { success: true };
      }

      return { success: false, message: response.message };
    } catch (err: unknown) {
      console.error("Update passenger error:", err);
      if (err instanceof Error) {
        return { success: false, message: err.message };
      }
      return { success: false, message: "Failed to update passenger" };
    }
  };

  // Delete passenger
  const deletePassenger = async (id: number) => {
    try {
      const response = await apiFetch<DeleteResponse>(`/passengers/${id}`, {
        method: "DELETE",
      });

      if (response.success) {
        // Remove from local array
        passengers.value = passengers.value.filter(
          (passenger) => passenger.passenger_id !== id,
        );
        return { success: true };
      }

      return { success: false, message: response.message };
    } catch (err: unknown) {
      console.error("Delete passenger error:", err);
      if (err instanceof Error) {
        return { success: false, message: err.message };
      }
      return { success: false, message: "Failed to delete passenger" };
    }
  };

  return {
    passengers,
    isLoading,
    error,
    fetchPassengers,
    getPassengerById,
    createPassenger,
    updatePassenger,
    deletePassenger,
  };
};
