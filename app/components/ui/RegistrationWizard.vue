<script setup lang="ts">
import { ref } from "vue";
import {
  User,
  CarTaxiFront,
  MapPin,
  CheckCircle,
  Loader,
} from "lucide-vue-next";

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
  barangay?: string;
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
  barangay: "",
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
      errors.value.license_expiration_date =
        "License expiration date is required";
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
    if (!formData.value.barangay) {
      errors.value.barangay = "Barangay is required";
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

const isCurrentStepValid = () => {
  const step = currentStep.value;

  if (step === 1) {
    return (
      formData.value.first_name.trim() &&
      formData.value.last_name.trim() &&
      formData.value.phone_number.trim() &&
      formData.value.date_of_birth &&
      formData.value.license_number.trim() &&
      formData.value.license_expiration_date
    );
  }

  if (step === 2) {
    return (
      formData.value.ownership && formData.value.vehicle_plate_number.trim()
    );
  }

  if (step === 3) {
    return (
      formData.value.street.trim() &&
      formData.value.city.trim() &&
      formData.value.province &&
      formData.value.region &&
      formData.value.barangay
    );
  }

  if (step === 4) {
    return formData.value.termsAgreed && formData.value.privacyAgreed;
  }

  return true;
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
    <div class="bg-secondary rounded-lg p-8 border border-secondary-light">
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
                :required="true"
                :error="errors.first_name"
              />
            </div>

            <div>
              <uiFormInput
                id="last_name"
                v-model="formData.last_name"
                label="Last Name"
                placeholder="Enter Last Name"
                :required="true"
                :error="errors.last_name"
              />
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
                :required="true"
                :error="errors.phone_number"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <uiFormDateInput
                id="date_of_birth"
                v-model="formData.date_of_birth"
                label="Date of Birth"
                :required="true"
                :error="errors.date_of_birth"
              />
            </div>
            <div>
              <uiFormInput
                id="license_number"
                v-model="formData.license_number"
                label="License Number"
                placeholder="DL-XXXX-XXXXX"
                :required="true"
                :error="errors.license_number"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <uiFormDateInput
                id="license_expiration_date"
                v-model="formData.license_expiration_date"
                label="License Expiration Date"
                :required="true"
                :error="errors.license_expiration_date"
              />
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
            <uiFormSelect
              id="ownership"
              v-model="formData.ownership"
              label="Ownership Type"
              :options="ownershipOptions"
              :required="true"
              :error="errors.ownership"
            />
          </div>

          <div>
            <uiFormInput
              id="vehicle_plate_number"
              v-model="formData.vehicle_plate_number"
              label="Plate Number"
              placeholder="ABC-1234"
              :required="true"
              :error="errors.vehicle_plate_number"
            />
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
                :required="true"
                :error="errors.region"
              />
            </div>

            <div>
              <uiFormInput
                id="province"
                v-model="formData.province"
                label="Province"
                placeholder="Enter province"
                :required="true"
                :error="errors.province"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <uiFormInput
                id="city"
                v-model="formData.city"
                label="City"
                placeholder="Enter city"
                :required="true"
                :error="errors.city"
              />
            </div>
            <div>
              <uiFormInput
                id="barangay"
                v-model="formData.barangay"
                label="Barangay"
                placeholder="Enter barangay"
                :required="true"
                :error="errors.barangay"
              />
            </div>
          </div>
          <div>
            <uiFormInput
              id="street"
              v-model="formData.street"
              label="Street"
              placeholder="Enter street"
              :required="true"
              :error="errors.street"
            />
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
          <div class="bg-secondary-light rounded-lg p-4">
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
          <div class="bg-secondary-light rounded-lg p-4">
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
          <div class="bg-secondary-light rounded-lg p-4">
            <h4 class="text-lg font-semibold text-white mb-3">Address</h4>
            <div class="text-sm">
              <span class="text-gray-400">Full Address:</span>
              <span class="text-white ml-2">
                {{ formData.region }}, {{ formData.province }},
                {{ formData.city }}, {{ formData.barangay }},
                {{ formData.street }}
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
                class="mt-1 w-4 h-4 rounded bg-secondary-dark border-gray-700 text-primary"
              />
              <label for="terms" class="text-sm text-gray-300">
                I agree to the
                <a href="#" class="text-primary hover:underline"
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
                class="mt-1 w-4 h-4 rounded bg-secondary-dark border-gray-700 text-primary"
              />
              <label for="privacy" class="text-sm text-gray-300">
                I agree to the
                <a href="#" class="text-primary hover:underline"
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
        class="flex items-center justify-between mt-8 pt-6 border-t border-secondary-light"
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
          :disabled="!isCurrentStepValid()"
          class="p-3 btn-primary flex items-center gap-2 text-base disabled:opacity-30 disabled:cursor-not-allowed"
          @click="nextStep"
        >
          Next Step
        </button>

        <button
          v-else
          :disabled="isSubmitting || !isCurrentStepValid()"
          class="p-3 btn-primary flex items-center gap-2 text-base disabled:opacity-30 disabled:cursor-not-allowed"
          @click="handleSubmit"
        >
          <span v-if="!isSubmitting">Submit Registration</span>
          <span v-else class="flex items-center gap-2">
            <Loader class="animate-spin h-5 w-5" />
            Submitting...
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
