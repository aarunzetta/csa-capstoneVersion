<script setup lang="ts">
import { Users, IdCard, CarTaxiFront, UserStar } from "lucide-vue-next";
import { onMounted } from "vue";
import type { TableColumn } from "../types";
import { useRides } from "../composables/useRides";
import { useDashboard } from "../composables/useDashboard";
import { formatDate } from "../utils/dateFormatter";

definePageMeta({
  middleware: "auth",
});

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

// Use the dashboard composable
const { stats, fetchStats } = useDashboard();

// Fetch data when component mounts
onMounted(() => {
  fetchStats();
  fetchRides();
});
</script>

<template>
  <div class="flex flex-col gap-8">
    <div>
      <h2 class="text-white text-4xl">Dashboard</h2>
      <p class="text-gray-400 text-base mt-2">
        Overview of system statistics and recent activity
      </p>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <uiCard
        id="rides"
        label="Rides"
        :value="stats.totalRides"
        :icon="CarTaxiFront"
        href="/rides"
      />
      <uiCard
        id="passengers"
        label="Passengers"
        :value="stats.totalPassengers"
        :icon="Users"
        href="/passengers"
      />
      <uiCard
        id="drivers"
        label="Drivers"
        :value="stats.totalDrivers"
        :icon="IdCard"
        href="/drivers"
      />
      <uiCard
        id="admins"
        label="Admins"
        :value="stats.totalAdmins"
        :icon="UserStar"
        href="/admins"
      />
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-gray-100">Loading rides...</div>

    <!-- Error State -->
    <div v-else-if="error" class="text-danger">{{ error }}</div>

    <div v-else>
      <h3 class="text-gray-100 text-2xl mb-4">View Latest Rides</h3>
      <!-- Rides Table -->
      <tablesDataTable
        :columns="columns"
        :data="rides"
        :actions="true"
        :action-buttons="{
          view: true,
          edit: false,
          suspend: false,
          delete: false,
        }"
      >
        <!-- Custom formatting for dates -->
        <template #cell-completed_at="{ value }">
          <span>{{ formatDate(value) }}</span>
        </template>
      </tablesDataTable>
    </div>
  </div>
</template>
