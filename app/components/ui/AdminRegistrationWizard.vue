<script setup lang="ts">
import { ref } from "vue";
import { User, Shield, UserPlus, CheckCircle, Loader } from "lucide-vue-next";
import { useAdmins } from "../../composables/useAdmins";
import { useToast } from "../../composables/useToast";
import { useRouter } from "vue-router";

interface FormErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  termsAgreed?: string;
  privacyAgreed?: string;
}

const currentStep = ref(1);
const totalSteps = 3;
const isSubmitting = ref(false);

// Define the steps for the multi-step wizard
const wizardSteps = [
  { number: 1, title: "Personal Info", icon: User },
  { number: 2, title: "Account Setup", icon: Shield },
  { number: 3, title: "Review", icon: CheckCircle },
];

// Form data
const formData = ref({
  // Personal Info
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",

  // Account Setup
  username: "",
  password: "",
  confirmPassword: "",
  role: "admin" as "super_admin" | "admin" | "moderator",

  // Terms
  termsAgreed: false,
  privacyAgreed: false,
});

// Form errors
const errors = ref<FormErrors>({});

// Role descriptions
const roleDescriptions = {
  super_admin:
    "Full system access with all privileges including user management and system configuration",
  admin:
    "Administrative access for managing users, content, and basic system settings",
  moderator:
    "Limited access for content moderation and basic administrative tasks",
};

// Step validation function
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
    // Phone validation (optional)
    if (
      formData.value.phone_number &&
      !/^\+?[\d\s\-(]+$/.test(formData.value.phone_number)
    ) {
      errors.value.phone_number = "Please enter a valid phone number";
      isValid = false;
    }
  }

  if (step === 2) {
    if (!formData.value.username.trim()) {
      errors.value.username = "Username is required";
      isValid = false;
    } else if (formData.value.username.length < 3) {
      errors.value.username = "Username must be at least 3 characters";
      isValid = false;
    }
    if (!formData.value.password.trim()) {
      errors.value.password = "Password is required";
      isValid = false;
    } else if (formData.value.password.length < 8) {
      errors.value.password = "Password must be at least 8 characters";
      isValid = false;
    }
    if (!formData.value.confirmPassword.trim()) {
      errors.value.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.value.password !== formData.value.confirmPassword) {
      errors.value.confirmPassword = "Passwords do not match";
      isValid = false;
    }
    if (!formData.value.role) {
      errors.value.role = "Role is required";
      isValid = false;
    }
  }

  if (step === 3) {
    if (!formData.value.termsAgreed) {
      errors.value.termsAgreed = "You must agree to the Terms of Service";
      isValid = false;
    }
    if (!formData.value.privacyAgreed) {
      errors.value.privacyAgreed = "You must agree to the Privacy Policy";
      isValid = false;
    }
  }

  return isValid;
};

// Check if current step is valid
const isCurrentStepValid = () => {
  const step = currentStep.value;

  if (step === 1) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      formData.value.first_name.trim() &&
      formData.value.last_name.trim() &&
      formData.value.email.trim() &&
      emailRegex.test(formData.value.email) &&
      (!formData.value.phone_number ||
        /^\+?[\d\s\-(]+$/.test(formData.value.phone_number))
    );
  }

  if (step === 2) {
    return (
      formData.value.username.trim() &&
      formData.value.username.length >= 3 &&
      formData.value.password.trim() &&
      formData.value.password.length >= 8 &&
      formData.value.confirmPassword.trim() &&
      formData.value.password === formData.value.confirmPassword &&
      formData.value.role
    );
  }

  if (step === 3) {
    return formData.value.termsAgreed && formData.value.privacyAgreed;
  }

  return true;
};

// Navigation functions
const nextStep = () => {
  if (validateStep(currentStep.value)) {
    if (currentStep.value < totalSteps) {
      currentStep.value++;
    }
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
    errors.value = {};
  }
};

// Initialize composables outside the function
const adminsComposable = useAdmins();
const { createAdmin } = adminsComposable;
const { success, error: showError } = useToast();
const router = useRouter();

// Form submission
const handleSubmit = async () => {
  if (!validateStep(currentStep.value)) return;

  isSubmitting.value = true;

  try {
    const adminPayload = {
      first_name: formData.value.first_name,
      last_name: formData.value.last_name,
      email: formData.value.email,
      phone_number: formData.value.phone_number || undefined,
      username: formData.value.username,
      password: formData.value.password,
      role: formData.value.role,
    };

    const result = await createAdmin(adminPayload);

    if (result.success) {
      success("Admin created successfully!");
      // Redirect to admins list
      await router.push("/admins");
    } else {
      showError(result.message || "Failed to create admin");
    }
  } catch (err: unknown) {
    console.error("Create admin error:", err);
    showError("An unexpected error occurred");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="w-[900px] max-w-5xl mx-auto">
    <!-- Multi-Step Wizard Progress Indicator -->
    <uiMultiStepWizard :steps="wizardSteps" :current-step="currentStep" />

    <!-- Form Content -->
    <div class="bg-secondary rounded-lg p-8 border border-secondary-light">
      <!-- Step 1: Personal Information -->
      <div v-if="currentStep === 1" class="space-y-6">
        <div>
          <h3 class="text-2xl font-semibold text-white mb-2">Personal Info</h3>
          <p class="text-gray-400 mb-6">
            Enter the admin's personal information
          </p>
        </div>

        <div class="grid grid-cols-2 gap-6">
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

        <div>
          <uiFormInput
            id="email"
            v-model="formData.email"
            label="Email Address"
            placeholder="Enter email address"
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

      <!-- Step 2: Account Setup -->
      <div v-if="currentStep === 2" class="space-y-6">
        <div class="flex items-center gap-3 mb-6">
          <Shield class="w-6 h-6 text-primary" />
          <h2 class="text-xl font-semibold text-white">Account Setup</h2>
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

        <div>
          <uiFormInput
            id="password"
            v-model="formData.password"
            label="Password"
            type="password"
            placeholder="Enter password"
            :required="true"
            :error="errors.password"
          />
          <p class="text-xs text-gray-400 mt-1">
            Password must be at least 8 characters and contain uppercase,
            lowercase, and numbers
          </p>
        </div>

        <div>
          <uiFormInput
            id="confirmPassword"
            v-model="formData.confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Confirm password"
            :required="true"
            :error="errors.confirmPassword"
          />
        </div>

        <div>
          <uiFormSelect
            id="role"
            v-model="formData.role"
            label="Admin Role"
            :required="true"
            :error="errors.role"
            :options="[
              { value: 'super_admin', label: 'Super Admin' },
              { value: 'admin', label: 'Admin' },
              { value: 'moderator', label: 'Moderator' },
            ]"
          />
          <p class="text-xs text-gray-400 mt-2">
            {{ roleDescriptions[formData.role] }}
          </p>
        </div>
      </div>

      <!-- Step 3: Review -->
      <div v-if="currentStep === 3" class="space-y-6">
        <div class="flex items-center gap-3 mb-6">
          <CheckCircle class="w-6 h-6 text-primary" />
          <h2 class="text-xl font-semibold text-white">Review Information</h2>
        </div>

        <!-- Personal Information Summary -->
        <div class="border border-secondary-light rounded-lg p-4">
          <h3 class="text-lg font-medium text-white mb-3">
            Personal Information
          </h3>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span class="text-gray-400">Name:</span>
              <span class="ml-2 text-white">
                {{ formData.first_name }} {{ formData.last_name }}
              </span>
            </div>
            <div>
              <span class="text-gray-400">Email:</span>
              <span class="ml-2 text-white">{{ formData.email }}</span>
            </div>
            <div>
              <span class="text-gray-400">Phone:</span>
              <span class="ml-2 text-white">
                {{ formData.phone_number || "Not provided" }}
              </span>
            </div>
          </div>
        </div>

        <!-- Account Setup Summary -->
        <div class="border border-secondary-light rounded-lg p-4">
          <h3 class="text-lg font-medium text-white mb-3">Account Setup</h3>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span class="text-gray-400">Username:</span>
              <span class="ml-2 text-white">{{ formData.username }}</span>
            </div>
            <div>
              <span class="text-gray-400">Role:</span>
              <span class="ml-2 text-white capitalize">
                {{ formData.role.replace("_", " ") }}
              </span>
            </div>
          </div>
        </div>

        <!-- Terms and Privacy -->
        <div class="border border-secondary-light rounded-lg p-4">
          <h3 class="text-lg font-medium text-white mb-3">Agreements</h3>
          <div class="space-y-3">
            <label class="flex items-start gap-3 cursor-pointer">
              <input
                v-model="formData.termsAgreed"
                type="checkbox"
                class="mt-1"
                :class="{ 'border-danger': errors.termsAgreed }"
              />
              <span class="text-sm text-gray-300">
                I agree to the Terms of Service and understand the
                responsibilities of this role
              </span>
            </label>
            <p v-if="errors.termsAgreed" class="text-danger text-xs">
              {{ errors.termsAgreed }}
            </p>

            <label class="flex items-start gap-3 cursor-pointer">
              <input
                v-model="formData.privacyAgreed"
                type="checkbox"
                class="mt-1"
                :class="{ 'border-danger': errors.privacyAgreed }"
              />
              <span class="text-sm text-gray-300">
                I agree to the Privacy Policy and understand how my data will be
                handled
              </span>
            </label>
            <p v-if="errors.privacyAgreed" class="text-danger text-xs">
              {{ errors.privacyAgreed }}
            </p>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div
        class="flex justify-between items-center mt-8 pt-6 border-t border-secondary-light"
      >
        <button
          v-if="currentStep > 1"
          class="flex items-center gap-2 px-4 py-2 btn-secondary text-white"
          @click="prevStep"
        >
          Previous
        </button>

        <div v-else></div>

        <button
          v-if="currentStep < totalSteps"
          :disabled="!isCurrentStepValid()"
          class="flex items-center gap-2 px-4 py-2 btn-primary text-white"
          :class="{ 'opacity-50 cursor-not-allowed': !isCurrentStepValid() }"
          @click="nextStep"
        >
          Next
        </button>

        <button
          v-else
          :disabled="!isCurrentStepValid() || isSubmitting"
          class="flex items-center gap-2 px-4 py-2 btn-primary text-white"
          :class="{
            'opacity-50 cursor-not-allowed':
              !isCurrentStepValid() || isSubmitting,
          }"
          @click="handleSubmit"
        >
          <Loader v-if="isSubmitting" class="w-4 h-4 animate-spin" />
          <UserPlus v-else class="w-4 h-4" />
          {{ isSubmitting ? "Creating..." : "Create Admin" }}
        </button>
      </div>
    </div>
  </div>
</template>
