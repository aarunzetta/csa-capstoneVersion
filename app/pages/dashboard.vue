<script setup lang="ts">
import {
  Users,
  IdCard,
  CarTaxiFront,
  UserStar,
  Download,
  UserPlus,
  FileText,
} from "lucide-vue-next";
import { onMounted, ref } from "vue";
import type { TableColumn } from "../types";
import type { Ride } from "../types/ride";
import { useRides } from "../composables/useRides";
import { useDashboard } from "../composables/useDashboard";
import { formatDate } from "../utils/dateFormatter";
import { useSeoTitle } from "../composables/useSeoTitle";

definePageMeta({
  middleware: "auth",
});

useSeoTitle("Dashboard");

const quickActions = [
  {
    label: "Register Driver",
    icon: UserPlus,
    variant: "secondary" as const,
    action: () => {
      navigateTo("/drivers/register");
    },
  },
  {
    label: "Register Passenger",
    icon: UserPlus,
    variant: "secondary" as const,
    action: () => {
      navigateTo("/passengers/register");
    },
  },
  {
    label: "View Reports",
    icon: FileText,
    variant: "secondary" as const,
    action: () => {
      navigateTo("/feedbacks");
    },
  },
];
// Define columns for the Rides table
const columns: TableColumn[] = [
  { key: "driver_name", label: "Driver", sortable: true },
  { key: "passenger_name", label: "Passenger", sortable: true },
  {
    key: "pickup_address",
    label: "Pickup Location",
    sortable: false,
    hideOn: "mobile-tablet",
  },
  {
    key: "dropoff_address",
    label: "Dropoff Location",
    sortable: false,
    hideOn: "mobile-tablet",
  },
  { key: "completed_at", label: "Completed At", sortable: true },
];

// Reactive variable
const selectedDateRange = ref("30days");
const activityData = ref([]);

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
          </button>
        </template>
      </layoutHeader>
    </div>
    <!-- Page Content -->
    <div class="bg-secondary-dark text-white p-4 md:p-6 flex-1">
      <div class="flex flex-col gap-6 md:gap-8">
        <div
          class="flex flex-col md:flex-row md:justify-between md:items-start gap-4"
        >
          <div>
            <h2
              class="text-white text-2xl md:text-3xl lg:text-4xl font-semibold"
            >
              Dashboard
            </h2>
            <p class="text-gray-400 text-sm md:text-base mt-2">
              Overview of system statistics and recent activity
            </p>
          </div>
          <uiDateRangePicker
            id="dateRange"
            v-model="selectedDateRange"
            class="hidden lg:block"
          />
        </div>

        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <uiCard
            id="passengers"
            label="Total Passengers"
            :value="stats.totalPassengers"
            :icon="Users"
            href="/passengers"
          />
          <uiCard
            id="drivers"
            label="Total Drivers"
            :value="stats.totalDrivers"
            :icon="IdCard"
            href="/drivers"
          />
          <uiCard
            id="rides"
            label="Total Rides"
            :value="stats.totalRides"
            :icon="CarTaxiFront"
            href="/rides"
          />
          <uiCard
            id="admins"
            label="Total Admins"
            :value="stats.totalAdmins"
            :icon="UserStar"
            href="/admins"
          />
        </div>
        <div class="hidden lg:grid lg:grid-cols-4 gap-6">
          <widgetsActivityChart
            :data="activityData"
            :time-range="selectedDateRange"
            :height="300"
            title="Activity Trends"
            class="lg:col-span-3"
          />
          <widgetsQuickActions :actions="quickActions" />
        </div>

        <!-- Loading State -->
        <div v-if="isLoading">
          <skeletonTableSkeleton :rows="8" :columns="6" />
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-danger">{{ error }}</div>

        <div v-else>
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <widgetsRecentActivityFeed :max-items="4" class="lg:col-span-1" />
            <!-- Rides Table -->
            <tablesDataTable
              class="lg:col-span-3"
              :columns="columns"
              :data="rides"
              :actions="true"
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
                  >{{ item.passenger_last_name }},
                  {{ item.passenger_first_name }}
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
              <!-- Custom formatting for dates -->
              <template #cell-completed_at="{ value }">
                <span>{{ formatDate(value) }}</span>
              </template>
            </tablesDataTable>
          </div>
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
