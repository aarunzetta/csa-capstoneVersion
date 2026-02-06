<script setup lang="ts">
import { X, CircleUser } from "lucide-vue-next";
import type { Passenger } from "../../types/passenger";
import { formatDate } from "../../utils/dateFormatter";

defineProps<{
  isOpen: boolean;
  passenger: Passenger | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

const handleBackdropClick = () => {
  emit("close");
};

const handleModalClick = (e: MouseEvent) => {
  e.stopPropagation();
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
      class="relative bg-secondary rounded-lg shadow-2xl max-w-sm md:max-w-2xl w-full mx-4 border border-secondary-light"
      @click="handleModalClick"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between p-4 md:p-6 border-b border-secondary-light"
      >
        <h2 class="text-lg md:text-2xl font-semibold text-white">
          Passenger Details
        </h2>
        <button
          class="text-gray-400 hover:text-white transition-colors"
          @click="handleBackdropClick"
        >
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Content -->
      <div
        v-if="passenger"
        class="p-4 md:p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto"
      >
        <!-- Personal Information Section -->
        <div>
          <div
            class="flex flex-col md:flex-row items-center md:items-start gap-4"
          >
            <div>
              <CircleUser class="text-primary w-16 md:w-20 h-16 md:h-20" />
            </div>
            <div class="w-full">
              <div class="flex flex-col gap-2">
                <p class="text-white font-medium text-base md:text-lg">
                  {{ passenger.first_name }} {{ passenger.middle_name }}
                  {{ passenger.last_name }}
                </p>
              </div>
              <div class="flex flex-col md:flex-row md:items-center gap-2">
                <p class="text-gray-400 text-xs md:text-sm">Username:</p>
                <p class="text-white font-medium text-sm md:text-base">
                  @{{ passenger.username }}
                </p>
              </div>

              <div class="flex flex-col md:flex-row md:items-center gap-2">
                <p class="text-gray-400 text-xs md:text-sm">Passenger ID:</p>
                <p class="text-white font-medium text-sm md:text-base">
                  #{{ passenger.passenger_id }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Personal and Contact Information Section -->
        <div>
          <h3 class="text-base md:text-lg font-semibold text-white mb-4">
            Personal and Contact Information
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-gray-400 text-xs md:text-sm">Date of Birth</p>
              <p class="font-medium text-white text-sm md:text-base">
                {{ formatDate(passenger.date_of_birth, false) }}
              </p>
            </div>

            <div>
              <p class="text-gray-400 text-xs md:text-sm">Phone Number</p>
              <p class="text-white font-medium text-sm md:text-base">
                {{ passenger.phone_number }}
              </p>
            </div>

            <div>
              <p class="text-gray-400 text-xs md:text-sm">Email Address</p>
              <p class="text-white font-medium text-sm md:text-base break-all">
                {{ passenger.email }}
              </p>
            </div>
          </div>
        </div>

        <!-- Date Section -->
        <div class="border-t border-secondary-light pt-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-gray-400 text-xs md:text-sm">Registered At</p>
              <p class="text-white font-medium text-sm md:text-base">
                {{ formatDate(passenger.registered_at, false) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
