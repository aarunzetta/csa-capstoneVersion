import type { Ride } from "../types";

export const useRides = () => {
  const rides = ref<Ride[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // for API integration
  const fetchRides = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      // Will Replace with actual API call when ready
      // const response = await $fetch<Ride[]>('/api/rides');
      // rides.value = response;

      // Mock data for now
      rides.value = [
        {
          ride_id: 1,
          driver_id: 101,
          passenger_id: 201,
          pickup_latitude: 14.5995,
          pickup_longitude: 120.9842,
          pickup_address: "SM North EDSA, Quezon City",
          dropoff_latitude: 14.5547,
          dropoff_longitude: 121.0244,
          dropoff_address: "BGC, Taguig City",
          ride_distance_km: 12.5,
          ride_duration_minutes: 35,
          started_at: new Date("2024-01-20T08:30:00"),
          completed_at: new Date("2024-01-20T09:05:00"),
        },
        {
          ride_id: 2,
          driver_id: 102,
          passenger_id: 202,
          pickup_latitude: 14.6091,
          pickup_longitude: 121.0223,
          pickup_address: "Ortigas Center, Pasig City",
          dropoff_latitude: 14.5378,
          dropoff_longitude: 121.0199,
          dropoff_address: "Makati CBD",
          ride_distance_km: 8.3,
          ride_duration_minutes: 25,
          started_at: new Date("2024-01-20T09:15:00"),
          completed_at: new Date("2024-01-20T09:40:00"),
        },
        {
          ride_id: 3,
          driver_id: 103,
          passenger_id: 203,
          pickup_latitude: 14.5764,
          pickup_longitude: 121.0851,
          pickup_address: "Eastwood City, Quezon City",
          dropoff_latitude: 14.5995,
          dropoff_longitude: 120.9842,
          dropoff_address: "SM North EDSA",
          ride_distance_km: 6.7,
          ride_duration_minutes: 20,
          started_at: new Date("2024-01-20T10:00:00"),
          completed_at: new Date("2024-01-20T10:20:00"),
        },
        {
          ride_id: 4,
          driver_id: 103,
          passenger_id: 203,
          pickup_latitude: 14.5764,
          pickup_longitude: 121.0851,
          pickup_address: "Eastwood City, Quezon City",
          dropoff_latitude: 14.5995,
          dropoff_longitude: 120.9842,
          dropoff_address: "SM North EDSA",
          ride_distance_km: 6.7,
          ride_duration_minutes: 20,
          started_at: new Date("2024-01-20T10:00:00"),
          completed_at: new Date("2024-01-20T10:20:00"),
        },
        {
          ride_id: 5,
          driver_id: 103,
          passenger_id: 203,
          pickup_latitude: 14.5764,
          pickup_longitude: 121.0851,
          pickup_address: "Eastwood City, Quezon City",
          dropoff_latitude: 14.5995,
          dropoff_longitude: 120.9842,
          dropoff_address: "SM North EDSA",
          ride_distance_km: 6.7,
          ride_duration_minutes: 20,
          started_at: new Date("2024-01-20T10:00:00"),
          completed_at: new Date("2024-01-20T10:20:00"),
        },
      ];
    } catch (err) {
      error.value = "Failed to fetch rides";
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const deleteRide = async (id: number) => {
    try {
      // will replace with actual API call when ready
      // await $fetch(`/api/rides/${id}`, { method: 'DELETE' });

      rides.value = rides.value.filter(
        (r: { ride_id: number }) => r.ride_id !== id,
      );
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return {
    rides,
    isLoading,
    error,
    fetchRides,
    deleteRide,
  };
};
