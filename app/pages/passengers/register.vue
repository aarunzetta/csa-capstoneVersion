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
            to="/passengers"
            class="p-3 flex items-center gap-2 text-base text-gray-400 hover:text-white transition-colors duration-200 ease-in-out"
          >
            <ArrowLeft class="w-5 h-5" />
            <span>Back to Passengers</span>
          </NuxtLink>
        </template>
      </layoutHeader>
    </div>
    <!-- Page Content -->
    <div class="bg-secondary-dark text-white p-6 flex-1">
      <div class="flex flex-col gap-8">
        <div>
          <h2 class="text-white text-3xl font-semibold">
            Register New Passenger
          </h2>
          <p class="text-gray-400 text-base mt-1">
            Complete the form below to register a new passenger
          </p>
        </div>

        <!-- FORM-->
        <uiPassengerRegistrationWizard />
      </div>
    </div>
  </div>
</template>
