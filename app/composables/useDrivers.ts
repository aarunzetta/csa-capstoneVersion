import type { Driver } from "../types";

export const useDrivers = () => {
  const drivers = ref<Driver[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // for API integration
  const fetchDrivers = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      // Will Replace with actual API call when ready
      // const response = await $fetch<Ride[]>('/api/drivers');
      // drivers.value = response;

      // Mock data for now
      drivers.value = [
        {
          driver_id: 101,
          first_name: "John",
          last_name: "Doe",
          middle_name: "Arsol",
          date_of_birth: new Date("1985-06-15"),
          address_region: "Region 1",
          address_province: "Province A",
          address_city: "City X",
          address_barangay: "Barangay 5",
          address_street: "123 Main St",
          phone_number: "09171234567",
          license_number: "D1234567",
          license_expiration_date: new Date("2026-12-31"),
          license_status: "active",
          vehicle_ownership: "owned",
          vehicle_plate_number: "ABC-1234",
          qr_code: "QR1234567890",
          register_at: new Date("2020-01-10"),
        },
        {
          driver_id: 102,
          first_name: "Jane",
          last_name: "Smith",
          middle_name: "Marie",
          date_of_birth: new Date("1990-03-22"),
          address_region: "Region 2",
          address_province: "Province B",
          address_city: "City Y",
          address_barangay: "Barangay 6",
          address_street: "456 Oak Ave",
          phone_number: "09179876543",
          license_number: "D7654321",
          license_expiration_date: new Date("2025-08-15"),
          license_status: "expired",
          vehicle_ownership: "owned",
          vehicle_plate_number: "XYZ-9999",
          qr_code: "QR9999999999",
          register_at: new Date("2021-03-15"),
        },
        {
          driver_id: 103,
          first_name: "Mike",
          last_name: "Johnson",
          middle_name: "Lee",
          date_of_birth: new Date("1988-11-05"),
          address_region: "Region 3",
          address_province: "Province C",
          address_city: "City Z",
          address_barangay: "Barangay 7",
          address_street: "789 Pine St",
          phone_number: "09175551234",
          license_number: "D1111111",
          license_expiration_date: new Date("2027-05-20"),
          license_status: "suspended",
          vehicle_ownership: "rented",
          vehicle_plate_number: "DEF-5678",
          qr_code: "QR5678567856",
          register_at: new Date("2019-07-01"),
        },
      ];
    } catch (err) {
      error.value = "Failed to fetch rides";
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const deleteDriver = async (id: number) => {
    try {
      // will replace with actual API call when ready
      // await $fetch(`/api/drivers/${id}`, { method: 'DELETE' });

      drivers.value = drivers.value.filter(
        (r: { driver_id: number }) => r.driver_id !== id,
      );
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return {
    drivers,
    isLoading,
    error,
    fetchDrivers,
    deleteDriver,
  };
};
