<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";
</script>

<template>
  <div class="flex flex-col h-screen overflow-y-auto">
    <!-- Sticky Header -->
    <div class="sticky top-0 z-20">
      <layoutHeader>
        <template #actions>
          <NuxtLink
            to="/admins"
            class="p-3 flex items-center gap-2 text-base text-gray-400 hover:text-white transition-colors duration-200 ease-in-out"
          >
            <ArrowLeft class="w-4 h-4 lg:w-5 lg:h-5" />
            <span class="text-sm lg:text-base">Back to Admins</span>
          </NuxtLink>
        </template>
      </layoutHeader>
    </div>
    <!-- Page Content -->
    <div class="bg-secondary-dark text-white p-6 flex-1">
      <div class="flex flex-col gap-8">
        <div>
          <h2 class="text-white text-xl md:text-2xl lg:text-3xl font-semibold">
            Register New Admin
          </h2>
          <p class="text-gray-400 text-sm md:text-base mt-1">
            Complete the form below to register a new admin
          </p>
        </div>

        <!-- Admin Registration Wizard -->
        <uiAdminRegistrationWizard />
      </div>
    </div>
  </div>
</template>
