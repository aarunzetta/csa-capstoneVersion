<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "../composables/useAuth";
import { useSeoTitle } from "../composables/useSeoTitle";

useSeoTitle("Login");

definePageMeta({
  layout: false,
  middleware: "auth",
});

const { login, isLoading } = useAuth();

const username = ref("");
const password = ref("");
const errorMessage = ref("");

const handleLogin = async () => {
  // Clear previous errors
  errorMessage.value = "";

  // Validate inputs
  if (!username.value || !password.value) {
    errorMessage.value = "Please enter both username and password";
    return;
  }

  // Call login function
  const result = await login(username.value, password.value);

  if (!result.success) {
    errorMessage.value = result.message || "Login failed";
  }
  // If success, the login composable will redirect to dashboard
};
</script>

<template>
  <div
    class="min-h-screen bg-secondary-dark flex items-center justify-center p-4"
  >
    <!-- Card Container -->
    <div
      class="p-8 w-full max-w-3xl bg-secondary grid grid-cols-1 sm:grid-cols-2 border border-secondary-light shadow-xl rounded-xl gap-1"
    >
      <!-- Left Side -->
      <div class="col-span-1">
        <!-- Header -->
        <div class="mb-8 text-center">
          <h1 class="text-3xl font-bold text-white mb-2">
            ComSecApp<br />Management System
          </h1>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-4">
          <p class="text-danger text-sm">{{ errorMessage }}</p>
        </div>

        <!-- Form -->
        <form class="space-y-6" @submit.prevent="handleLogin">
          <!-- Username Field -->
          <uiFormInput
            id="username"
            v-model="username"
            label="Username"
            placeholder="Enter username"
            :disabled="isLoading"
          />

          <!-- Password Field -->
          <uiFormInput
            id="password"
            v-model="password"
            type="password"
            label="Password"
            placeholder="Enter password"
            :disabled="isLoading"
          />

          <!-- Login Button -->
          <button
            type="submit"
            class="w-full btn-primary"
            :disabled="isLoading"
          >
            {{ isLoading ? "Logging in..." : "Login" }}
          </button>
        </form>
      </div>

      <!-- Right Side -->
      <div class="hidden sm:flex col-span-1 items-center justify-center">
        <NuxtImg
          src="/cma_logo.png"
          alt="cma_logo"
          format="webp"
          loading="lazy"
        />
      </div>
    </div>
  </div>
</template>
