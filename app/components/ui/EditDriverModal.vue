<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { X, Loader } from "lucide-vue-next";
import type { Driver } from "../../types/driver";
import { formatDate } from "../../utils/dateFormatter";
import { useToast } from "../../composables/useToast";

const props = defineProps<{
  isOpen: boolean;
  driver: Driver | null;
  driversComposable?: ReturnType<
    typeof import("../../composables/useDrivers").useDrivers
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
  date_of_birth: "",
  phone_number: "",
  license_number: "",
  license_expiration_date: "",
  license_status: "active" as Driver["license_status"],
  vehicle_ownership: "owned" as Driver["vehicle_ownership"],
  vehicle_plate_number: "",
  address_region: "",
  address_province: "",
  address_city: "",
  address_barangay: "",
  address_street: "",
});

const isSubmitting = ref(false);
const originalData = ref<typeof formData.value | null>(null);

// Options for dropdowns
const licenseStatusOptions = [
  { value: "active", label: "Active" },
  { value: "expired", label: "Expired" },
  { value: "suspended", label: "Suspended" },
  { value: "revoked", label: "Revoked" },
];

const vehicleOwnershipOptions = [
  { value: "owned", label: "Owned" },
  { value: "rented", label: "Rented" },
  { value: "company", label: "Company" },
  { value: "other", label: "Other" },
];

// Computed property to check if form has changes
const hasChanges = computed(() => {
  if (!originalData.value || !props.driver) return false;

  // Compare each field individually to avoid date formatting issues
  const fields = [
    "first_name",
    "last_name",
    "middle_name",
    "phone_number",
    "license_number",
    "license_status",
    "vehicle_ownership",
    "vehicle_plate_number",
    "address_region",
    "address_province",
    "address_city",
    "address_barangay",
    "address_street",
  ];

  for (const field of fields) {
    if (
      formData.value[field as keyof typeof formData.value] !==
      originalData.value[field as keyof typeof originalData.value]
    ) {
      return true;
    }
  }

  // Handle dates separately with proper comparison
  const formDOB = new Date(formData.value.date_of_birth).getTime();
  const origDOB = new Date(originalData.value.date_of_birth).getTime();
  if (formDOB !== origDOB) return true;

  const formExp = new Date(formData.value.license_expiration_date).getTime();
  const origExp = new Date(
    originalData.value.license_expiration_date,
  ).getTime();
  if (formExp !== origExp) return true;

  return false;
});

// Watch for driver changes and populate form
watch(
  () => props.driver,
  (newDriver) => {
    if (newDriver) {
      const newFormData = {
        first_name: newDriver.first_name,
        last_name: newDriver.last_name,
        middle_name: newDriver.middle_name || "",
        date_of_birth: formatDate(newDriver.date_of_birth, false)
          .split(",")
          .join(""),
        phone_number: newDriver.phone_number,
        license_number: newDriver.license_number,
        license_expiration_date: formatDate(
          newDriver.license_expiration_date,
          false,
        )
          .split(",")
          .join(""),
        license_status: newDriver.license_status,
        vehicle_ownership: newDriver.vehicle_ownership,
        vehicle_plate_number: newDriver.vehicle_plate_number,
        address_region: newDriver.address_region,
        address_province: newDriver.address_province,
        address_city: newDriver.address_city,
        address_barangay: newDriver.address_barangay,
        address_street: newDriver.address_street,
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
  if (!props.driver) return;

  isSubmitting.value = true;
  try {
    const { updateDriver } =
      props.driversComposable ||
      (await import("../../composables/useDrivers")).useDrivers();

    // Map form data to driver payload
    const driverPayload = {
      first_name: formData.value.first_name,
      last_name: formData.value.last_name,
      middle_name: formData.value.middle_name || undefined,
      date_of_birth: new Date(formData.value.date_of_birth),
      phone_number: formData.value.phone_number,
      license_number: formData.value.license_number,
      license_expiration_date: new Date(formData.value.license_expiration_date),
      license_status: formData.value.license_status,
      vehicle_ownership: formData.value.vehicle_ownership,
      vehicle_plate_number: formData.value.vehicle_plate_number,
      address_region: formData.value.address_region,
      address_province: formData.value.address_province,
      address_city: formData.value.address_city,
      address_barangay: formData.value.address_barangay,
      address_street: formData.value.address_street,
    };

    const result = await updateDriver(props.driver.driver_id, driverPayload);

    if (result.success) {
      success("Driver updated successfully!");
      emit("close");
    } else {
      showError(result.message || "Failed to update driver");
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
        <h2 class="text-2xl font-semibold text-white">Edit Driver</h2>
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
              <uiFormDateInput
                id="edit_date_of_birth"
                v-model="formData.date_of_birth"
                label="Date of Birth"
                :required="true"
              />
              <uiFormInput
                id="edit_phone_number"
                v-model="formData.phone_number"
                label="Phone Number"
                placeholder="Enter phone number"
                :required="true"
              />
            </div>
          </div>

          <!-- License Information -->
          <div>
            <h3 class="text-lg font-semibold text-white mb-4">
              License Information
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <uiFormInput
                id="edit_license_number"
                v-model="formData.license_number"
                label="License Number"
                placeholder="Enter license number"
                :required="true"
              />
              <uiFormDateInput
                id="edit_license_expiration_date"
                v-model="formData.license_expiration_date"
                label="License Expiration Date"
                :required="true"
              />
            </div>
            <div class="grid grid-cols-2 gap-4 mt-4">
              <uiFormSelect
                id="edit_license_status"
                v-model="formData.license_status"
                label="License Status"
                :options="licenseStatusOptions"
                :required="true"
              />
            </div>
          </div>

          <!-- Vehicle Information -->
          <div>
            <h3 class="text-lg font-semibold text-white mb-4">
              Vehicle Information
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <uiFormInput
                id="edit_vehicle_plate_number"
                v-model="formData.vehicle_plate_number"
                label="Vehicle Plate Number"
                placeholder="Enter plate number"
                :required="true"
              />
              <uiFormSelect
                id="edit_vehicle_ownership"
                v-model="formData.vehicle_ownership"
                label="Vehicle Ownership"
                :options="vehicleOwnershipOptions"
                :required="true"
              />
            </div>
          </div>

          <!-- Address Information -->
          <div>
            <h3 class="text-lg font-semibold text-white mb-4">
              Address Information
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <uiFormInput
                id="edit_region"
                v-model="formData.address_region"
                label="Region"
                placeholder="Enter region"
                :required="true"
              />
              <uiFormInput
                id="edit_province"
                v-model="formData.address_province"
                label="Province"
                placeholder="Enter province"
                :required="true"
              />
              <uiFormInput
                id="edit_city"
                v-model="formData.address_city"
                label="City"
                placeholder="Enter city"
                :required="true"
              />
              <uiFormInput
                id="edit_barangay"
                v-model="formData.address_barangay"
                label="Barangay"
                placeholder="Enter barangay"
                :required="true"
              />
              <uiFormInput
                id="edit_street"
                v-model="formData.address_street"
                label="Street"
                placeholder="Enter street"
                :required="true"
                class="col-span-2"
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
          form="edit-driver-form"
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
