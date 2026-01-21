<script setup lang="ts">
import { Users, IdCard, CarTaxiFront, UserStar } from "lucide-vue-next";
import { ref, onMounted } from "vue";
import type { TableColumn } from "../types";
import { useRides } from "../composables/useRides";

// Card statistics
const passengersCount = ref(1);
const ridesCount = ref(1);
const driversCount = ref(1);
const adminsCount = ref(1);

// Define columns for the Rides table
const columns: TableColumn[] = [
  { key: "ride_id", label: "Ride ID", sortable: true },
  { key: "driver_id", label: "Driver ID", sortable: true },
  { key: "passenger_id", label: "Passenger ID", sortable: true },
  { key: "pickup_address", label: "Pickup Location", sortable: false },
  { key: "dropoff_address", label: "Dropoff Location", sortable: false },
  { key: "completed_at", label: "Completed At", sortable: true },
];

// Use the rides composable
const { rides, isLoading, error, fetchRides } = useRides();

// Fetch rides when component mounts
onMounted(() => {
  fetchRides();
});

// Helper function to format dates
const formatDate = (date: Date) => {
  return new Date(date).toLocaleString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<template>
  <div class="flex flex-col gap-8">
    <h2 class="text-white text-4xl">Dashboard</h2>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <uiCard
        id="passengers"
        label="Passengers"
        :value="passengersCount"
        :icon="Users"
        href="/passengers"
      />
      <uiCard
        id="drivers"
        label="Drivers"
        :value="driversCount"
        :icon="IdCard"
        href="/drivers"
      />
      <uiCard
        id="rides"
        label="Rides"
        :value="ridesCount"
        :icon="CarTaxiFront"
        href="/rides"
      />
      <uiCard
        id="admins"
        label="Admins"
        :value="adminsCount"
        :icon="UserStar"
        href="/admins"
      />
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-white">Loading rides...</div>

    <!-- Error State -->
    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <!-- Rides Table -->
    <tablesDataTable v-else :columns="columns" :data="rides" :actions="false">
      <!-- Custom formatting for distance -->
      <template #cell-ride_distance_km="{ value }">
        <span class="text-blue-400">{{ value.toFixed(2) }} km</span>
      </template>
      <!-- Custom formatting for duration -->
      <template #cell-ride_duration_minutes="{ value }">
        <span class="text-green-400">{{ value }} min</span>
      </template>

      <!-- Custom formatting for dates -->
      <template #cell-completed_at="{ value }">
        <span class="text-gray-300">{{ formatDate(value) }}</span>
      </template>
    </tablesDataTable>
  </div>
</template>
