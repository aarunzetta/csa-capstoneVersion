<script setup lang="ts">
import { X, Clock, Route, User, CarTaxiFront } from "lucide-vue-next";
import type { Ride } from "../../types/ride";
import { formatDate } from "../../utils/dateFormatter";

defineProps<{
  isOpen: boolean;
  ride: Ride | null;
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
      class="relative bg-secondary rounded-lg shadow-2xl max-w-sm md:max-w-2xl lg:max-w-4xl w-full mx-4 border border-secondary-light"
      @click="handleModalClick"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between p-4 md:p-6 border-b border-secondary-light"
      >
        <h2 class="text-lg md:text-2xl font-semibold text-white">
          Ride Details
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
        v-if="ride"
        class="p-4 md:p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto"
      >
        <!-- Participants Section -->
        <div>
          <div class="flex items-center gap-2 mb-4">
            <User class="text-primary w-5 md:w-6 h-5 md:h-6" />
            <h3 class="text-base md:text-lg font-semibold text-white">
              Participants
            </h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-secondary-light rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <CarTaxiFront class="text-gray-400 w-4 md:w-5 h-4 md:h-5" />
                <p class="text-gray-400 text-xs md:text-sm">Driver</p>
              </div>
              <p class="text-white font-medium text-sm md:text-base">
                {{ ride.driver_first_name }} {{ ride.driver_last_name }}
              </p>
              <p class="text-white text-xs font-medium">
                #{{ ride.driver_id }}
              </p>
            </div>
            <div class="bg-secondary-light rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <User class="text-gray-400 w-4 md:w-5 h-4 md:h-5" />
                <p class="text-gray-400 text-xs md:text-sm">Passenger</p>
              </div>
              <p class="text-white font-medium text-sm md:text-base">
                {{ ride.passenger_first_name }} {{ ride.passenger_last_name }}
              </p>
              <p class="text-white text-xs font-medium">
                #{{ ride.passenger_id }}
              </p>
            </div>
          </div>
        </div>

        <!-- Route Overview Section -->
        <div>
          <div class="flex items-center gap-2 mb-4">
            <Route class="text-primary w-5 md:w-6 h-5 md:h-6" />
            <h3 class="text-base md:text-lg font-semibold text-white">
              Route Overview
            </h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="bg-secondary-light rounded-lg p-4">
              <p class="text-gray-400 text-xs md:text-sm mb-2">
                Pickup Location
              </p>
              <p class="text-white font-medium text-sm md:text-base">
                {{ ride.pickup_address }}
              </p>
              <div class="mt-2 text-xs text-gray-400">
                Coordinates: {{ ride.pickup_latitude }},
                {{ ride.pickup_longitude }}
              </div>
            </div>
            <div class="bg-secondary-light rounded-lg p-4">
              <p class="text-gray-400 text-xs md:text-sm mb-2">
                Dropoff Location
              </p>
              <p class="text-white font-medium text-sm md:text-base">
                {{ ride.dropoff_address }}
              </p>
              <div class="mt-2 text-xs text-gray-400">
                Coordinates: {{ ride.dropoff_latitude }},
                {{ ride.dropoff_longitude }}
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-gray-400 text-xs md:text-sm">Distance</p>
              <p class="text-info font-medium text-sm md:text-base">
                {{ ride.ride_distance_km }} km
              </p>
            </div>
            <div>
              <p class="text-gray-400 text-xs md:text-sm">Duration</p>
              <p class="text-success font-medium text-sm md:text-base">
                {{ ride.ride_duration_minutes }} min
              </p>
            </div>
          </div>
        </div>

        <!-- Timeline Section -->
        <div>
          <div class="flex items-center gap-2 mb-4">
            <Clock class="text-primary w-5 md:w-6 h-5 md:h-6" />
            <h3 class="text-base md:text-lg font-semibold text-white">
              Timeline
            </h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-gray-400 text-xs md:text-sm">Started At</p>
              <p class="text-white font-medium text-sm md:text-base">
                {{ formatDate(ride.started_at, true) }}
              </p>
            </div>
            <div>
              <p class="text-gray-400 text-xs md:text-sm">Completed At</p>
              <p class="text-white font-medium text-sm md:text-base">
                {{ formatDate(ride.completed_at, true) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
