<script setup lang="ts">
import { ref } from "vue";
import { User, Mail, CheckCircle, Loader } from "lucide-vue-next";
import { usePassengers } from "../../composables/usePassengers";
import { useToast } from "../../composables/useToast";

interface FormErrors {
  first_name?: string;
  last_name?: string;
  username?: string;
  password?: string;
  phone_number?: string;
  date_of_birth?: string;
  email?: string;
  street?: string;
  city?: string;
  province?: string;
  barangay?: string;
  region?: string;
  termsAgreed?: string;
  privacyAgreed?: string;
}

const currentStep = ref(1);
const totalSteps = 3;
const isSubmitting = ref(false);

// Define the steps for the multi-step wizard
const wizardSteps = [
  { number: 1, title: "Personal Info", icon: User },
  { number: 2, title: "Contact Info", icon: Mail },
  { number: 3, title: "Review", icon: CheckCircle },
];

// Form data
const formData = ref({
  // Personal Info
  first_name: "",
  last_name: "",
  middleName: "",
  username: "",
  password: "",
  date_of_birth: "",

  // Contact Info
  phone_number: "",
  email: "",

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
    if (!formData.value.username.trim()) {
      errors.value.username = "Username is required";
      isValid = false;
    }
    if (!formData.value.password.trim()) {
      errors.value.password = "Password is required";
      isValid = false;
    } else if (formData.value.password.length < 6) {
      errors.value.password = "Password must be at least 6 characters";
      isValid = false;
    }
    if (!formData.value.date_of_birth) {
      errors.value.date_of_birth = "Date of birth is required";
      isValid = false;
    }
  }

  if (step === 2) {
    if (!formData.value.phone_number.trim()) {
      errors.value.phone_number = "Phone number is required";
      isValid = false;
    }
    if (!formData.value.email.trim()) {
      errors.value.email = "Email is required";
      isValid = false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.value.email && !emailRegex.test(formData.value.email)) {
      errors.value.email = "Please enter a valid email address";
      isValid = false;
    }
  }

  if (step === 3) {
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
      formData.value.username.trim() &&
      formData.value.password.trim() &&
      formData.value.password.length >= 6 &&
      formData.value.date_of_birth
    );
  }

  if (step === 2) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      formData.value.phone_number.trim() &&
      formData.value.email.trim() &&
      emailRegex.test(formData.value.email)
    );
  }

  if (step === 3) {
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
      const { createPassenger } = usePassengers();
      const { success, error: showError } = useToast();

      // Map form data to passenger payload (exclude checkboxes)
      const passengerPayload = {
        first_name: formData.value.first_name,
        last_name: formData.value.last_name,
        middle_name: formData.value.middleName || undefined,
        username: formData.value.username,
        password: formData.value.password,
        date_of_birth: new Date(formData.value.date_of_birth),
        phone_number: formData.value.phone_number,
        email: formData.value.email,
      };

      const result = await createPassenger(passengerPayload);

      if (result.success) {
        // Show success toast and redirect
        success("Passenger created successfully!");
        setTimeout(() => {
          // Redirect to passengers page (toast will persist across navigation)
          window.location.href = "/passengers";
        }, 2000);
      } else {
        // Show error toast
        console.error("Create passenger failed:", result.message);
        showError(result.message || "Failed to create passenger");
        isSubmitting.value = false;
      }
    } catch (error) {
      console.error("Submit error:", error);
      const { error: showError } = useToast();
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      showError(errorMessage);
      isSubmitting.value = false;
    }
  }
};
</script>

<template>
  <div class="w-full max-w-5xl mx-auto px-4 md:px-0">
    <!-- Multi-Step Wizard Progress Indicator -->
    <uiMultiStepWizard :steps="wizardSteps" :current-step="currentStep" />

    <!-- Form Content -->
    <div
      class="bg-secondary rounded-lg p-4 md:p-8 border border-secondary-light"
    >
      <!-- Step 1: Personal Info -->
      <div v-show="currentStep === 1">
        <h3 class="text-lg md:text-2xl font-semibold text-white mb-2">
          Personal Info
        </h3>
        <p class="text-sm md:text-base text-gray-400 mb-6">
          Enter the passenger's personal information
        </p>

        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                id="username"
                v-model="formData.username"
                label="Username"
                placeholder="Enter username"
                :required="true"
                :error="errors.username"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <uiFormInput
                id="password"
                v-model="formData.password"
                label="Password"
                type="password"
                placeholder="Enter password (min 6 characters)"
                :required="true"
                :error="errors.password"
              />
            </div>
            <div>
              <uiFormDateInput
                id="date_of_birth"
                v-model="formData.date_of_birth"
                label="Date of Birth"
                :required="true"
                :error="errors.date_of_birth"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Contact Info -->
      <div v-show="currentStep === 2">
        <h3 class="text-lg md:text-2xl font-semibold text-white mb-2">
          Contact Info
        </h3>
        <p class="text-sm md:text-base text-gray-400 mb-6">
          Enter the passenger's contact information
        </p>

        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <uiFormInput
                id="email"
                v-model="formData.email"
                label="Email Address"
                placeholder="passenger@example.com"
                :required="true"
                :error="errors.email"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Review -->
      <div v-show="currentStep === 3">
        <h3 class="text-lg md:text-2xl font-semibold text-white mb-2">
          Review
        </h3>
        <p class="text-sm md:text-base text-gray-400 mb-6">
          Review all information before submitting
        </p>

        <div class="space-y-6">
          <!-- Personal Info Summary -->
          <div class="bg-secondary-light rounded-lg p-4">
            <h4 class="text-base md:text-lg font-semibold text-white mb-3">
              Personal Information
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-400">Name:</span>
                <span class="text-white ml-2"
                  >{{ formData.first_name }} {{ formData.middleName }}
                  {{ formData.last_name }}</span
                >
              </div>
              <div>
                <span class="text-gray-400">Username:</span>
                <span class="text-white ml-2">@{{ formData.username }}</span>
              </div>
              <div>
                <span class="text-gray-400">Date of Birth:</span>
                <span class="text-white ml-2">{{
                  formData.date_of_birth
                }}</span>
              </div>
            </div>
          </div>

          <!-- Contact Info Summary -->
          <div class="bg-secondary-light rounded-lg p-4">
            <h4 class="text-base md:text-lg font-semibold text-white mb-3">
              Contact Information
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-400">Phone Number:</span>
                <span class="text-white ml-2">{{ formData.phone_number }}</span>
              </div>
              <div>
                <span class="text-gray-400">Email Address:</span>
                <span class="text-white ml-2">{{ formData.email }}</span>
              </div>
            </div>
          </div>

          <!-- Agreements -->
          <div class="space-y-3">
            <div class="flex items-start gap-3">
              <input
                id="terms"
                v-model="formData.termsAgreed"
                type="checkbox"
                class="mt-1 w-4 h-4 rounded bg-secondary-dark border-gray-700 text-primary flex-shrink-0"
              />
              <label for="terms" class="text-xs md:text-sm text-gray-300">
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
                class="mt-1 w-4 h-4 rounded bg-secondary-dark border-gray-700 text-primary flex-shrink-0"
              />
              <label for="privacy" class="text-xs md:text-sm text-gray-300">
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
        class="flex flex-col-reverse md:flex-row items-center justify-between gap-3 md:gap-0 mt-8 pt-6 border-t border-secondary-light"
      >
        <button
          v-if="currentStep > 1"
          class="w-full md:w-auto px-4 py-2 md:p-3 btn-primary flex items-center justify-center gap-2 text-sm md:text-base"
          @click="previousStep"
        >
          Previous
        </button>
        <div v-else></div>

        <button
          v-if="currentStep < totalSteps"
          :disabled="!isCurrentStepValid()"
          class="w-full md:w-auto px-4 py-2 md:p-3 btn-primary flex items-center justify-center gap-2 text-sm md:text-base disabled:opacity-30 disabled:cursor-not-allowed"
          @click="nextStep"
        >
          Next Step
        </button>

        <button
          v-else
          :disabled="isSubmitting || !isCurrentStepValid()"
          class="w-full md:w-auto px-4 py-2 md:p-3 btn-primary flex items-center justify-center gap-2 text-sm md:text-base disabled:opacity-30 disabled:cursor-not-allowed"
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
