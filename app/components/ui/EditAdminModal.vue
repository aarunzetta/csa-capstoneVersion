<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { X, Loader } from "lucide-vue-next";
import type { Admin } from "../../types/admin";
import { useToast } from "../../composables/useToast";

const props = defineProps<{
  isOpen: boolean;
  admin: Admin | null;
  adminsComposable?: ReturnType<
    typeof import("../../composables/useAdmins").useAdmins
  >;
}>();

const emit = defineEmits<{
  close: [];
}>();

// Form data
const formData = ref({
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  role: "admin" as "super_admin" | "admin" | "moderator",
  is_active: "1",
});

// Form errors
const errors = ref<{
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  role?: string;
  is_active?: string;
}>({});

// Loading state
const isSubmitting = ref(false);

// Initialize form data when admin prop changes
watch(
  () => props.admin,
  (newAdmin) => {
    if (newAdmin) {
      formData.value = {
        first_name: newAdmin.first_name,
        last_name: newAdmin.last_name,
        email: newAdmin.email,
        phone_number: newAdmin.phone_number || "",
        role: newAdmin.role,
        is_active: newAdmin.is_active.toString(),
      };
      errors.value = {};
    }
  },
  { immediate: true },
);

// Check if form has changes
const hasChanges = computed(() => {
  if (!props.admin) return false;

  return (
    formData.value.first_name !== props.admin.first_name ||
    formData.value.last_name !== props.admin.last_name ||
    formData.value.email !== props.admin.email ||
    (formData.value.phone_number || null) !==
      (props.admin.phone_number || null) ||
    formData.value.role !== props.admin.role ||
    parseInt(formData.value.is_active) !== props.admin.is_active
  );
});

// Validate form
const validateForm = () => {
  errors.value = {};
  let isValid = true;

  if (!formData.value.first_name.trim()) {
    errors.value.first_name = "First name is required";
    isValid = false;
  }

  if (!formData.value.last_name.trim()) {
    errors.value.last_name = "Last name is required";
    isValid = false;
  }

  if (!formData.value.email.trim()) {
    errors.value.email = "Email is required";
    isValid = false;
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.value.email)) {
      errors.value.email = "Please enter a valid email address";
      isValid = false;
    }
  }

  if (!formData.value.role) {
    errors.value.role = "Role is required";
    isValid = false;
  }

  return isValid;
};

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm() || !props.admin) return;

  isSubmitting.value = true;
  try {
    const { updateAdmin } =
      props.adminsComposable ||
      (await import("../../composables/useAdmins")).useAdmins();
    const { success, error: showError } = useToast();

    // Map form data to admin payload
    const adminPayload = {
      first_name: formData.value.first_name,
      last_name: formData.value.last_name,
      email: formData.value.email,
      phone_number: formData.value.phone_number || undefined,
      role: formData.value.role,
      is_active: parseInt(formData.value.is_active),
    };

    const result = await updateAdmin(props.admin.admin_id, adminPayload);

    if (result.success) {
      // Show success toast and close modal
      success("Admin updated successfully!");
      emit("close");
    } else {
      // Show error toast
      showError(result.message || "Failed to update admin");
    }
  } catch (err: unknown) {
    const { error: showError } = useToast();
    console.error("Update admin error:", err);
    showError("An unexpected error occurred");
  } finally {
    isSubmitting.value = false;
  }
};

// Handle backdrop click
const handleBackdropClick = () => {
  emit("close");
};

// Handle modal click (prevent backdrop click)
const handleModalClick = (e: MouseEvent) => {
  e.stopPropagation();
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center"
  >
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black/50" @click="handleBackdropClick"></div>

    <!-- Modal -->
    <div
      class="relative bg-secondary rounded-lg shadow-2xl max-w-sm md:max-w-2xl w-full mx-4 border border-secondary-light"
      @click="handleModalClick"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between p-4 md:p-6 border-b border-secondary-light"
      >
        <h2 class="text-lg md:text-2xl font-semibold text-white">Edit Admin</h2>
        <button
          class="text-gray-400 hover:text-white transition-colors"
          @click="handleBackdropClick"
        >
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Content -->
      <div
        v-if="admin"
        class="p-4 md:p-6 max-h-[calc(100vh-200px)] overflow-y-auto"
      >
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <!-- Personal Information -->
          <div>
            <h3 class="text-base md:text-lg font-semibold text-white mb-4">
              Personal Information
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <uiFormInput
                  id="first_name"
                  v-model="formData.first_name"
                  label="First Name"
                  placeholder="Enter first name"
                  :required="true"
                  :error="errors.first_name"
                />
              </div>
              <div>
                <uiFormInput
                  id="last_name"
                  v-model="formData.last_name"
                  label="Last Name"
                  placeholder="Enter last name"
                  :required="true"
                  :error="errors.last_name"
                />
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div>
            <h3 class="text-base md:text-lg font-semibold text-white mb-4">
              Contact Information
            </h3>
            <div class="space-y-4">
              <div>
                <uiFormInput
                  id="email"
                  v-model="formData.email"
                  label="Email Address"
                  type="email"
                  placeholder="admin@example.com"
                  :required="true"
                  :error="errors.email"
                />
              </div>
              <div>
                <uiFormInput
                  id="phone_number"
                  v-model="formData.phone_number"
                  label="Phone Number"
                  placeholder="Enter phone number (optional)"
                  :error="errors.phone_number"
                />
              </div>
            </div>
          </div>

          <!-- Role and Status -->
          <div>
            <h3 class="text-base md:text-lg font-semibold text-white mb-4">
              Role and Status
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <uiFormSelect
                  id="role"
                  v-model="formData.role"
                  label="Role"
                  :required="true"
                  :error="errors.role"
                  :options="[
                    { value: 'super_admin', label: 'Super Admin' },
                    { value: 'admin', label: 'Admin' },
                    { value: 'moderator', label: 'Moderator' },
                  ]"
                />
              </div>
              <div>
                <uiFormSelect
                  id="is_active"
                  v-model="formData.is_active"
                  label="Status"
                  :required="true"
                  :error="errors.is_active"
                  :options="[
                    { value: '1', label: 'Active' },
                    { value: '0', label: 'Suspended' },
                  ]"
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div
        class="flex flex-col-reverse md:flex-row justify-end gap-3 p-4 md:p-6 border-t border-secondary-light"
      >
        <button
          type="button"
          class="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors text-sm md:text-base"
          @click="handleBackdropClick"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
          :disabled="!hasChanges || isSubmitting"
          @click="handleSubmit"
        >
          <Loader v-if="isSubmitting" class="w-4 h-4 animate-spin" />
          {{ isSubmitting ? "Saving..." : "Save Changes" }}
        </button>
      </div>
    </div>
  </div>
</template>
