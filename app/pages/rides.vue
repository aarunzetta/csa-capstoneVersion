<script setup lang="ts">
import { onMounted } from "vue";
import type { TableColumn } from "../types";
import { useRides } from "../composables/useRides";
import { formatDate } from "../utils/dateFormatter";

// Define columns for the Rides table
const columns: TableColumn[] = [
  { key: "ride_id", label: "Ride ID", sortable: true },
  { key: "driver_id", label: "Driver ID", sortable: true },
  { key: "passenger_id", label: "Passenger ID", sortable: true },
  { key: "pickup_address", label: "Pickup Location", sortable: false },
  { key: "dropoff_address", label: "Dropoff Location", sortable: false },
  { key: "ride_distance_km", label: "Distance (km)", sortable: false },
  { key: "ride_duration_minutes", label: "Duration (min)", sortable: false },
  { key: "started_at", label: "Started At", sortable: true },
  { key: "completed_at", label: "Completed At", sortable: true },
];

// Use the rides composable
const { rides, isLoading, error, fetchRides } = useRides();

// Fetch rides when component mounts
onMounted(() => {
  fetchRides();
});
</script>

<template>
  <div class="flex flex-col gap-8">
    <h2 class="text-white text-4xl">Rides</h2>
    <!-- Loading State -->
    <div v-if="isLoading" class="text-white">Loading rides...</div>

    <!-- Error State -->
    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <div v-else>
      <!-- Rides Table -->
      <tablesDataTable
        :columns="columns"
        :data="rides"
        :actions="false"
        :default-entries-per-page="10"
      >
        <!-- Custom formatting for distance -->
        <template #cell-ride_distance_km="{ value }">
          <span class="text-info">{{ value.toFixed(2) }} km</span>
        </template>
        <!-- Custom formatting for duration -->
        <template #cell-ride_duration_minutes="{ value }">
          <span class="text-success">{{ value }} min</span>
        </template>

        <!-- Custom formatting for dates -->
        <template #cell-started_at="{ value }">
          <span class="text-gray-300">{{ formatDate(value) }}</span>
        </template>
        <template #cell-completed_at="{ value }">
          <span class="text-gray-300">{{ formatDate(value) }}</span>
        </template>
      </tablesDataTable>
    </div>
  </div>
</template>
