import type { Admin } from "../types";
import { useApi } from "./useApi";

interface AdminsResponse {
  success: boolean;
  count: number;
  data: Admin[];
}

interface AdminResponse {
  success: boolean;
  data: Admin;
}

interface DeleteResponse {
  success: boolean;
  message: string;
}

export const useAdmins = () => {
  const { apiFetch } = useApi();
  const admins = ref<Admin[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Fetch all admins from API
  const fetchAdmins = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiFetch<AdminsResponse>("/admins");

      if (response.success) {
        admins.value = response.data;
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = "Failed to fetch admins";
      }
      console.error("Fetch admins error:", err);
    } finally {
      isLoading.value = false;
    }
  };

  // Get single admin by ID
  const getAdminById = async (id: number) => {
    try {
      const response = await apiFetch<AdminResponse>(`/admins/${id}`);
      return response.data;
    } catch (err: unknown) {
      console.error("Get admin error:", err);
      throw err;
    }
  };

  // Create new admin
  const createAdmin = async (
    adminData: Partial<Admin> & { password: string },
  ) => {
    try {
      const response = await apiFetch<{
        success: boolean;
        message: string;
        data: Admin;
      }>("/admins", {
        method: "POST",
        body: JSON.stringify(adminData),
      });

      if (response.success) {
        // Refresh the list
        await fetchAdmins();
        return { success: true, data: response.data };
      }

      return { success: false, message: response.message };
    } catch (err: unknown) {
      console.error("Create admin error:", err);
      if (err instanceof Error) {
        return { success: false, message: err.message };
      }
      return { success: false, message: "Failed to create admin" };
    }
  };

  // Update admin
  const updateAdmin = async (id: number, adminData: Partial<Admin>) => {
    try {
      const response = await apiFetch<{ success: boolean; message: string }>(
        `/admins/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(adminData),
        },
      );

      if (response.success) {
        // Refresh the list
        await fetchAdmins();
        return { success: true };
      }

      return { success: false, message: response.message };
    } catch (err: unknown) {
      console.error("Update admin error:", err);
      if (err instanceof Error) {
        return { success: false, message: err.message };
      }
      return { success: false, message: "Failed to update admin" };
    }
  };

  // Delete admin
  const deleteAdmin = async (id: number) => {
    try {
      const response = await apiFetch<DeleteResponse>(`/admins/${id}`, {
        method: "DELETE",
      });

      if (response.success) {
        // Remove from local array
        admins.value = admins.value.filter((admin) => admin.admin_id !== id);
        return { success: true };
      }

      return { success: false, message: response.message };
    } catch (err: unknown) {
      console.error("Delete admin error:", err);
      if (err instanceof Error) {
        return { success: false, message: err.message };
      }
      return { success: false, message: "Failed to delete admin" };
    }
  };

  return {
    admins,
    isLoading,
    error,
    fetchAdmins,
    getAdminById,
    createAdmin,
    updateAdmin,
    deleteAdmin,
  };
};
