<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { X, Loader } from "lucide-vue-next";
import type { Passenger } from "../../types/passenger";
import { formatDate } from "../../utils/dateFormatter";
import { useToast } from "../../composables/useToast";

const props = defineProps<{
  isOpen: boolean;
  passenger: Passenger | null;
  passengersComposable?: ReturnType<
    typeof import("../../composables/usePassengers").usePassengers
  >;
}>();

const emit = defineEmits<{
  close: [];
}>();

const { success, error: showError } = useToast();

// Form data
const formData = ref({
  first_name: "",
  last_name: "",
  middle_name: "",
  username: "",
  date_of_birth: "",
  phone_number: "",
  email: "",
});

const isSubmitting = ref(false);
const originalData = ref<typeof formData.value | null>(null);

// Computed property to check if form has changes
const hasChanges = computed(() => {
  if (!originalData.value || !props.passenger) return false;

  // Compare each field individually to avoid date formatting issues
  const fields = [
    "first_name",
    "last_name",
    "middle_name",
    "username",
    "phone_number",
    "email",
  ];

  for (const field of fields) {
    if (
      formData.value[field as keyof typeof formData.value] !==
      originalData.value[field as keyof typeof originalData.value]
    ) {
      return true;
    }
  }

  // Handle date separately with proper comparison
  const formDOB = new Date(formData.value.date_of_birth).getTime();
  const origDOB = new Date(originalData.value.date_of_birth).getTime();
  if (formDOB !== origDOB) return true;

  return false;
});

// Watch for passenger changes and populate form
watch(
  () => props.passenger,
  (newPassenger) => {
    if (newPassenger) {
      const newFormData = {
        first_name: newPassenger.first_name,
        last_name: newPassenger.last_name,
        middle_name: newPassenger.middle_name || "",
        username: newPassenger.username,
        date_of_birth: formatDate(newPassenger.date_of_birth, false)
          .split(",")
          .join(""),
        phone_number: newPassenger.phone_number,
        email: newPassenger.email,
      };

      formData.value = newFormData;
      originalData.value = { ...newFormData };
    }
  },
  { immediate: true },
);

const handleBackdropClick = () => {
  emit("close");
};

const handleModalClick = (e: MouseEvent) => {
  e.stopPropagation();
};

const handleSubmit = async () => {
  if (!props.passenger) return;

  isSubmitting.value = true;
  try {
    const { updatePassenger } =
      props.passengersComposable ||
      (await import("../../composables/usePassengers")).usePassengers();

    // Map form data to passenger payload
    const passengerPayload = {
      first_name: formData.value.first_name,
      last_name: formData.value.last_name,
      middle_name: formData.value.middle_name || undefined,
      username: formData.value.username,
      date_of_birth: new Date(formData.value.date_of_birth),
      phone_number: formData.value.phone_number,
      email: formData.value.email,
    };

    const result = await updatePassenger(
      props.passenger.passenger_id,
      passengerPayload,
    );

    if (result.success) {
      success("Passenger updated successfully!");
      emit("close");
    } else {
      showError(result.message || "Failed to update passenger");
    }
  } catch (error) {
    console.error("Update error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    showError(errorMessage);
  } finally {
    isSubmitting.value = false;
  }
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
      class="relative bg-secondary rounded-lg shadow-2xl max-w-4xl w-full mx-4 border border-secondary-light"
      @click="handleModalClick"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between p-6 border-b border-secondary-light"
      >
        <h2 class="text-2xl font-semibold text-white">Edit Passenger</h2>
        <button
          class="text-gray-400 hover:text-white transition-colors"
          @click="handleBackdropClick"
        >
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <!-- Personal Information -->
          <div>
            <h3 class="text-lg font-semibold text-white mb-4">
              Personal Information
            </h3>
            <div class="grid grid-cols-3 gap-4">
              <uiFormInput
                id="edit_first_name"
                v-model="formData.first_name"
                label="First Name"
                placeholder="Enter first name"
                :required="true"
              />
              <uiFormInput
                id="edit_last_name"
                v-model="formData.last_name"
                label="Last Name"
                placeholder="Enter last name"
                :required="true"
              />
              <uiFormInput
                id="edit_middle_name"
                v-model="formData.middle_name"
                label="Middle Name"
                placeholder="Enter middle name"
              />
            </div>
            <div class="grid grid-cols-2 gap-4 mt-4">
              <uiFormInput
                id="edit_username"
                v-model="formData.username"
                label="Username"
                placeholder="Enter username"
                :required="true"
              />
              <uiFormDateInput
                id="edit_date_of_birth"
                v-model="formData.date_of_birth"
                label="Date of Birth"
                :required="true"
              />
            </div>
          </div>

          <!-- Contact Information -->
          <div>
            <h3 class="text-lg font-semibold text-white mb-4">
              Contact Information
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <uiFormInput
                id="edit_phone_number"
                v-model="formData.phone_number"
                label="Phone Number"
                placeholder="Enter phone number"
                :required="true"
              />
              <uiFormInput
                id="edit_email"
                v-model="formData.email"
                label="Email Address"
                placeholder="Enter email address"
                :required="true"
              />
            </div>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="flex justify-end gap-3 p-6 border-t border-secondary-light">
        <button
          type="button"
          class="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
          @click="handleBackdropClick"
        >
          Cancel
        </button>
        <button
          type="submit"
          form="edit-passenger-form"
          class="px-4 py-2 rounded-lg btn-primary flex items-center gap-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          :disabled="isSubmitting || !hasChanges"
          @click="handleSubmit"
        >
          <Loader v-if="isSubmitting" class="w-4 h-4 animate-spin" />
          <span>{{ isSubmitting ? "Updating..." : "Save Changes" }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
