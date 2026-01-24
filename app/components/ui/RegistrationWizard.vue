<script setup lang="ts">
import { ref } from "vue";
import { User, CarTaxiFront, MapPin, CheckCircle } from "lucide-vue-next";

const emit = defineEmits(["submit"]);

interface FormErrors {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  date_of_birth?: string;
  license_number?: string;
  license_expiration_date?: string;
  ownership?: string;
  vehicle_plate_number?: string;
  street?: string;
  city?: string;
  province?: string;
  baranggay?: string;
  region?: string;
  termsAgreed?: string;
  privacyAgreed?: string;
}

const currentStep = ref(1);
const totalSteps = 4;
const isSubmitting = ref(false);

// Define the steps for the multi-step wizard
const wizardSteps = [
  { number: 1, title: "Personal Info", icon: User },
  { number: 2, title: "Vehicle Details", icon: CarTaxiFront },
  { number: 3, title: "Address", icon: MapPin },
  { number: 4, title: "Review", icon: CheckCircle },
];

// Form data
const formData = ref({
  // Personal Info
  first_name: "",
  last_name: "",
  middleName: "",
  phone_number: "",
  date_of_birth: "",
  license_number: "",
  license_expiration_date: "",

  // Vehicle Details
  ownership: "",
  vehicle_plate_number: "",

  // Address
  region: "",
  province: "",
  city: "",
  baranggay: "",
  street: "",

  // Review
  termsAgreed: false,
  privacyAgreed: false,
});

const errors = ref<FormErrors>({});

const ownershipOptions = [
  { value: "owned", label: "Owned" },
  { value: "rented", label: "Rented" },
  { value: "company", label: "Company Owned" },
  { value: "other", label: "Other" },
];

const validateStep = (step: number) => {
  errors.value = {};
  let isValid = true;

  if (step === 1) {
    if (!formData.value.first_name.trim()) {
      errors.value.first_name = "First name is required";
      isValid = false;
    }
    if (!formData.value.last_name.trim()) {
      errors.value.last_name = "Last name is required";
      isValid = false;
    }
    if (!formData.value.phone_number.trim()) {
      errors.value.phone_number = "Phone number is required";
      isValid = false;
    }
    if (!formData.value.date_of_birth) {
      errors.value.date_of_birth = "Date of birth is required";
      isValid = false;
    }
    if (!formData.value.license_number.trim()) {
      errors.value.license_number = "License number is required";
      isValid = false;
    }
    if (!formData.value.license_expiration_date) {
      errors.value.license_expiration_date = "License expiry date is required";
      isValid = false;
    }
  }

  if (step === 2) {
    if (!formData.value.ownership) {
      errors.value.ownership = "Ownership type is required";
      isValid = false;
    }
    if (!formData.value.vehicle_plate_number.trim()) {
      errors.value.vehicle_plate_number = "Plate number is required";
      isValid = false;
    }
  }

  if (step === 3) {
    if (!formData.value.street.trim()) {
      errors.value.street = "Street address is required";
      isValid = false;
    }
    if (!formData.value.city.trim()) {
      errors.value.city = "City is required";
      isValid = false;
    }
    if (!formData.value.province) {
      errors.value.province = "Province is required";
      isValid = false;
    }
    if (!formData.value.region) {
      errors.value.region = "Region is required";
      isValid = false;
    }
    if (!formData.value.baranggay) {
      errors.value.baranggay = "Baranggay is required";
      isValid = false;
    }
  }

  if (step === 4) {
    if (!formData.value.termsAgreed) {
      errors.value.termsAgreed = "You must agree to the terms";
      isValid = false;
    }
    if (!formData.value.privacyAgreed) {
      errors.value.privacyAgreed = "You must agree to the privacy policy";
      isValid = false;
    }
  }

  return isValid;
};

const nextStep = () => {
  if (validateStep(currentStep.value)) {
    if (currentStep.value < totalSteps) {
      currentStep.value++;
    }
  }
};

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
    errors.value = {};
  }
};

const handleSubmit = async () => {
  if (validateStep(currentStep.value)) {
    isSubmitting.value = true;
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      emit("submit", formData.value);
    } finally {
      isSubmitting.value = false;
    }
  }
};
</script>

<template>
  <div class="w-[900px] max-w-5xl mx-auto">
    <!-- Multi-Step Wizard Progress Indicator -->
    <uiMultiStepWizard :steps="wizardSteps" :current-step="currentStep" />

    <!-- Form Content -->
    <div class="bg-secondary rounded-lg p-8">
      <!-- Step 1: Personal Info -->
      <div v-show="currentStep === 1">
        <h3 class="text-2xl font-semibold text-white mb-2">Personal Info</h3>
        <p class="text-gray-400 mb-6">
          Enter the driver's personal information
        </p>

        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <uiFormInput
                id="first_name"
                v-model="formData.first_name"
                label="First Name"
                placeholder="Enter First Name"
              />
              <p v-if="errors.first_name" class="text-danger text-sm mt-1">
                {{ errors.first_name }}
              </p>
            </div>

            <div>
              <uiFormInput
                id="last_name"
                v-model="formData.last_name"
                label="Last Name"
                placeholder="Enter Last Name"
              />
              <p v-if="errors.last_name" class="text-danger text-sm mt-1">
                {{ errors.last_name }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <uiFormInput
                id="middleName"
                v-model="formData.middleName"
                label="Middle Name (Optional)"
                placeholder="Enter Middle Name"
              />
            </div>
            <div>
              <uiFormInput
                id="phone_number"
                v-model="formData.phone_number"
                label="Phone Number"
                placeholder="+63 912 345 6789"
              />
              <p v-if="errors.phone_number" class="text-danger text-sm mt-1">
                {{ errors.phone_number }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <uiFormInput
                id="date_of_birth"
                v-model="formData.date_of_birth"
                label="Date of Birth"
                type="date"
              />
              <p v-if="errors.date_of_birth" class="text-danger text-sm mt-1">
                {{ errors.date_of_birth }}
              </p>
            </div>
            <div>
              <uiFormInput
                id="license_number"
                v-model="formData.license_number"
                label="License Number"
                placeholder="DL-XXXX-XXXXX"
              />
              <p v-if="errors.license_number" class="text-danger text-sm mt-1">
                {{ errors.license_number }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <uiFormInput
                id="license_expiration_date"
                v-model="formData.license_expiration_date"
                label="License Expiry Date"
                type="date"
              />
              <p
                v-if="errors.license_expiration_date"
                class="text-danger text-sm mt-1"
              >
                {{ errors.license_expiration_date }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Vehicle Details -->
      <div v-show="currentStep === 2">
        <h3 class="text-2xl font-semibold text-white mb-2">Vehicle Details</h3>
        <p class="text-gray-400 mb-6">Enter the vehicle information</p>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-white mb-2">
              Ownership <span class="text-danger">*</span>
            </label>
            <select
              v-model="formData.ownership"
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.ownership }"
            >
              <option value="" disabled>Select ownership type</option>
              <option
                v-for="option in ownershipOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
            <p v-if="errors.ownership" class="text-danger text-sm mt-1">
              {{ errors.ownership }}
            </p>
          </div>

          <div>
            <uiFormInput
              id="vehicle_plate_number"
              v-model="formData.vehicle_plate_number"
              label="Plate Number"
              placeholder="ABC-1234"
            />
            <p
              v-if="errors.vehicle_plate_number"
              class="text-danger text-sm mt-1"
            >
              {{ errors.vehicle_plate_number }}
            </p>
          </div>
        </div>
      </div>

      <!-- Step 3: Address -->
      <div v-show="currentStep === 3">
        <h3 class="text-2xl font-semibold text-white mb-2">Address</h3>
        <p class="text-gray-400 mb-6">Enter the driver's address</p>

        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <uiFormInput
                id="region"
                v-model="formData.region"
                label="Region"
                placeholder="Enter region"
              />
              <p v-if="errors.region" class="text-danger text-sm mt-1">
                {{ errors.region }}
              </p>
            </div>

            <div>
              <uiFormInput
                id="province"
                v-model="formData.province"
                label="Province"
                placeholder="Enter province"
              />
              <p v-if="errors.province" class="text-danger text-sm mt-1">
                {{ errors.province }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <uiFormInput
                id="city"
                v-model="formData.city"
                label="City"
                placeholder="Enter city"
              />
              <p v-if="errors.city" class="text-danger text-sm mt-1">
                {{ errors.city }}
              </p>
            </div>
            <div>
              <uiFormInput
                id="baranggay"
                v-model="formData.baranggay"
                label="Baranggay"
                placeholder="Enter baranggay"
              />
              <p v-if="errors.baranggay" class="text-danger text-sm mt-1">
                {{ errors.baranggay }}
              </p>
            </div>
          </div>
          <div>
            <uiFormInput
              id="street"
              v-model="formData.street"
              label="Street"
              placeholder="Enter street"
            />
            <p v-if="errors.street" class="text-danger text-sm mt-1">
              {{ errors.street }}
            </p>
          </div>
        </div>
      </div>

      <!-- Step 4: Review -->
      <div v-show="currentStep === 4">
        <h3 class="text-2xl font-semibold text-white mb-2">Review</h3>
        <p class="text-gray-400 mb-6">
          Review all information before submitting
        </p>

        <div class="space-y-6">
          <!-- Personal Info Summary -->
          <div class="bg-gray-800 rounded-lg p-4">
            <h4 class="text-lg font-semibold text-white mb-3">
              Personal Information
            </h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-400">Name:</span>
                <span class="text-white ml-2"
                  >{{ formData.first_name }} {{ formData.middleName }}
                  {{ formData.last_name }}</span
                >
              </div>
              <div>
                <span class="text-gray-400">Phone Number:</span>
                <span class="text-white ml-2">{{ formData.phone_number }}</span>
              </div>
              <div>
                <span class="text-gray-400">Date of Birth:</span>
                <span class="text-white ml-2">{{
                  formData.date_of_birth
                }}</span>
              </div>
              <div>
                <span class="text-gray-400">License Number:</span>
                <span class="text-white ml-2">{{
                  formData.license_number
                }}</span>
              </div>
              <div>
                <span class="text-gray-400">License Expiry:</span>
                <span class="text-white ml-2">{{
                  formData.license_expiration_date
                }}</span>
              </div>
            </div>
          </div>

          <!-- Vehicle Details Summary -->
          <div class="bg-gray-800 rounded-lg p-4">
            <h4 class="text-lg font-semibold text-white mb-3">
              Vehicle Details
            </h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-400">Ownership:</span>
                <span class="text-white ml-2 capitalize">{{
                  formData.ownership
                }}</span>
              </div>
              <div>
                <span class="text-gray-400">Plate Number:</span>
                <span class="text-white ml-2">{{
                  formData.vehicle_plate_number
                }}</span>
              </div>
            </div>
          </div>

          <!-- Address Summary -->
          <div class="bg-gray-800 rounded-lg p-4">
            <h4 class="text-lg font-semibold text-white mb-3">Address</h4>
            <div class="text-sm">
              <span class="text-gray-400">Full Address:</span>
              <span class="text-white ml-2">
                {{ formData.region }}, {{ formData.province }},
                {{ formData.city }}, {{ formData.baranggay }},
                {{ formData.street }},
              </span>
            </div>
          </div>

          <!-- Agreements -->
          <div class="space-y-3">
            <div class="flex items-start gap-3">
              <input
                id="terms"
                v-model="formData.termsAgreed"
                type="checkbox"
                class="mt-1 w-4 h-4 rounded bg-gray-800 border-gray-700 text-blue-500 focus:ring-2 focus:ring-blue-500"
              />
              <label for="terms" class="text-sm text-gray-300">
                I agree to the
                <a href="#" class="text-blue-500 hover:underline"
                  >Terms and Conditions</a
                >
              </label>
            </div>
            <p v-if="errors.termsAgreed" class="text-danger text-sm">
              {{ errors.termsAgreed }}
            </p>

            <div class="flex items-start gap-3">
              <input
                id="privacy"
                v-model="formData.privacyAgreed"
                type="checkbox"
                class="mt-1 w-4 h-4 rounded bg-gray-800 border-gray-700 text-blue-500 focus:ring-2 focus:ring-blue-500"
              />
              <label for="privacy" class="text-sm text-gray-300">
                I agree to the
                <a href="#" class="text-blue-500 hover:underline"
                  >Privacy Policy</a
                >
              </label>
            </div>
            <p v-if="errors.privacyAgreed" class="text-danger text-sm">
              {{ errors.privacyAgreed }}
            </p>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div
        class="flex items-center justify-between mt-8 pt-6 border-t border-gray-700"
      >
        <button
          v-if="currentStep > 1"
          class="p-3 btn-primary flex items-center gap-2 text-base"
          @click="previousStep"
        >
          Previous
        </button>
        <div v-else></div>

        <button
          v-if="currentStep < totalSteps"
          class="p-3 btn-primary flex items-center gap-2 text-base"
          @click="nextStep"
        >
          Next Step
        </button>

        <button
          v-else
          :disabled="isSubmitting"
          class="p-3 btn-primary flex items-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleSubmit"
        >
          <span v-if="!isSubmitting">Submit Registration</span>
          <span v-else class="flex items-center gap-2">
            <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Submitting...
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
