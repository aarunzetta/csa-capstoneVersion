import type { Passenger } from "../types";

export const usePassengers = () => {
  const passengers = ref<Passenger[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // for API integration
  const fetchPassengers = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      // Will Replace with actual API call when ready
      // const response = await $fetch<Ride[]>('/api/passengers');
      // passengers.value = response;

      // Mock data for now
      passengers.value = [
        {
          passenger_id: 201,
          first_name: "Alice",
          last_name: "Johnson",
          middle_name: "Lynn",
          username: "alicej",
          date_of_birth: new Date("2000-07-15"),
          phone_number: "09171234568",
          email: "alice_johnson@gmail.com",
          password_hash: "hashed_password_1",
          registered_at: new Date("2022-05-20"),
        },
      ];
    } catch (err) {
      error.value = "Failed to fetch passengers";
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const deletePassenger = async (id: number) => {
    try {
      // will replace with actual API call when ready
      // await $fetch(`/api/passengers/${id}`, { method: 'DELETE' });

      passengers.value = passengers.value.filter(
        (r: { passenger_id: number }) => r.passenger_id !== id,
      );
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return {
    passengers,
    isLoading,
    error,
    fetchPassengers,
    deletePassenger,
  };
};
