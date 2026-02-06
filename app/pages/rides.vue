<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { TableColumn } from "../types";
import type { Ride } from "../types/ride";
import { useRides } from "../composables/useRides";
import { formatDate } from "../utils/dateFormatter";
import { Download } from "lucide-vue-next";
import { useSeoTitle } from "../composables/useSeoTitle";

useSeoTitle("Rides");

// Define columns for the Rides table
const columns: TableColumn[] = [
  { key: "ride_id", label: "Ride ID", sortable: true, hideOn: "mobile" },
  { key: "driver_name", label: "Driver", sortable: true },
  {
    key: "passenger_name",
    label: "Passenger",
    sortable: true,
  },
  {
    key: "pickup_address",
    label: "Pickup Location",
    sortable: false,
    hideOn: "mobile",
  },
  {
    key: "dropoff_address",
    label: "Dropoff Location",
    sortable: false,
    hideOn: "mobile",
  },
  { key: "ride_distance_km", label: "Distance (km)", sortable: false },
  { key: "ride_duration_minutes", label: "Duration (min)", sortable: false },
  {
    key: "started_at",
    label: "Started At",
    sortable: true,
    hideOn: "mobile-tablet",
  },
  {
    key: "completed_at",
    label: "Completed At",
    sortable: true,
    hideOn: "mobile-tablet",
  },
];

// Use the rides composable
const { rides, isLoading, error, fetchRides } = useRides();

// Modal state
const isModalOpen = ref(false);
const selectedRide = ref<Ride | null>(null);

const handleViewRide = (ride: Ride) => {
  selectedRide.value = ride;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedRide.value = null;
};

// Fetch rides when component mounts
onMounted(() => {
  fetchRides();
});
</script>

<template>
  <div class="flex flex-col h-screen overflow-y-auto">
    <!-- Sticky Header -->
    <div class="sticky top-0 z-10">
      <layoutHeader>
        <template #actions>
          <button class="p-3 btn-secondary flex items-center gap-2 text-base">
            <Download class="w-4 h-4 lg:w-5 lg:h-5" /><span
              class="text-sm lg:text-base"
              >Export</span
            >
          </button></template
        >
      </layoutHeader>
    </div>
    <!-- Page Content -->
    <div class="bg-secondary-dark text-white p-6 flex-1">
      <div class="flex flex-col gap-8">
        <div>
          <h2 class="text-white text-2xl md:text-3xl lg:text-4xl font-semibold">
            Rides
          </h2>
          <p class="text-gray-400 text-sm md:text-base mt-2">
            Track and view all ride transactions
          </p>
        </div>
        <!-- Loading State -->
        <div v-if="isLoading">
          <skeletonTableSkeleton :rows="8" :columns="6" />
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-red-500">{{ error }}</div>

        <div v-else>
          <!-- Rides Table -->
          <tablesDataTable
            :columns="columns"
            :data="rides"
            :actions="true"
            :default-entries-per-page="10"
            :action-buttons="{
              view: true,
              edit: false,
              suspend: false,
              delete: false,
            }"
            @view="handleViewRide"
          >
            <!-- Custom formatting for passenger -->
            <template #cell-passenger_name="{ item }">
              <span class="text-gray-300 flex flex-col"
                >{{ item.passenger_last_name }}, {{ item.passenger_first_name }}
                <span class="text-xs">#{{ item.passenger_id }}</span></span
              >
            </template>

            <!-- Custom formatting for driver -->
            <template #cell-driver_name="{ item }">
              <span class="text-gray-300 flex flex-col"
                >{{ item.driver_last_name }}, {{ item.driver_first_name }}
                <span class="text-xs">#{{ item.driver_id }}</span></span
              >
            </template>

            <!-- Custom formatting for distance -->
            <template #cell-ride_distance_km="{ value }">
              <span class="text-info">{{ value }} km</span>
            </template>
            <!-- Custom formatting for duration -->
            <template #cell-ride_duration_minutes="{ value }">
              <span class="text-success">{{ value }} min</span>
            </template>

            <!-- Custom formatting for dates -->
            <template #cell-started_at="{ value }">
              <span class="text-gray-400">{{ formatDate(value) }}</span>
            </template>
            <template #cell-completed_at="{ value }">
              <span class="text-gray-400">{{ formatDate(value) }}</span>
            </template>
          </tablesDataTable>
        </div>
      </div>
    </div>
    <uiRideDetailsModal
      :is-open="isModalOpen"
      :ride="selectedRide"
      @close="closeModal"
    />
  </div>
</template>
