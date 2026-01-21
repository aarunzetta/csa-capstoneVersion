import type { Admin } from "../types";

export const useAdmins = () => {
  const admins = ref<Admin[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // for API integration
  const fetchAdmins = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      // Will Replace with actual API call when ready
      // const response = await $fetch<Admin[]>('/api/admins');
      // admins.value = response;

      // Mock data for now
      admins.value = [
        {
          admin_id: 1,
          username: "jojoKing",
          first_name: "Joe",
          last_name: "King",
          email: "joeking@gmail.com",
          role: "moderator",
          is_active: 2,
          registered_at: new Date("2023-01-15T10:00:00Z"),
          last_login: new Date("2024-06-10T08:30:00Z"),
        },
        {
          admin_id: 2,
          username: "sara565",
          first_name: "Sara",
          last_name: "Liu",
          email: "saraliu77@gmail.com",
          role: "admin",
          is_active: 1,
          registered_at: new Date("2022-11-20T14:45:00Z"),
          last_login: new Date("2026-01-19T16:15:00Z"),
        },
        {
          admin_id: 3,
          username: "mikeT99",
          first_name: "Mike",
          last_name: "Tyson",
          email: "mikeyty10@work.com",
          role: "superadmin",
          is_active: 1,
          registered_at: new Date("2023-05-05T09:20:00Z"),
          last_login: new Date("2026-01-21T09:40:00Z"),
        },
      ];
    } catch (err) {
      error.value = "Failed to fetch admins";
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const deleteAdmin = async (id: number) => {
    try {
      // will replace with actual API call when ready
      // await $fetch(`/api/admins/${id}`, { method: 'DELETE' });

      admins.value = admins.value.filter(
        (r: { admin_id: number }) => r.admin_id !== id,
      );
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return {
    admins,
    isLoading,
    error,
    fetchAdmins,
    deleteAdmin,
  };
};
