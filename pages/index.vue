<script setup>
import { ref } from "vue";

const username = ref("");
const password = ref("");

const handleLogin = () => {
  navigateTo("/dashboard");
};
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-primary-light via-primary to-primary-dark flex items-center justify-center p-4"
  >
    <!-- Card Container -->
    <div
      class="p-8 w-full max-w-3xl bg-secondary-dark grid grid-cols-1 sm:grid-cols-2 border border-secondary-dark shadow-xl rounded-xl gap-1"
    >
      <!-- Left Side -->
      <div class="col-span-1">
        <!-- Header -->
        <div class="mb-8 text-center">
          <h1 class="text-3xl font-bold text-white mb-2">
            ComSecApp<br />Management System
          </h1>
        </div>

        <!-- Form -->
        <form class="space-y-6" @submit.prevent="handleLogin">
          <!-- Username Field -->
          <uiFormInput
            id="username"
            v-model="username"
            label="Username"
            placeholder="Enter username"
          />

          <!-- Password Field -->
          <uiFormInput
            id="password"
            v-model="password"
            type="password"
            label="Password"
            placeholder="Enter password"
          />

          <!-- Login Button -->
          <button type="submit" class="w-full btn-primary">Login</button>
        </form>
      </div>

      <!-- Right Side -->
      <div class="hidden sm:flex col-span-1 items-center justify-center">
        <img src="/public/cma_logo.png" alt="cma_logo" />
      </div>
    </div>
  </div>
</template>
