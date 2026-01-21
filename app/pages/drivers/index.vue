<script setup lang="ts">
import { onMounted } from "vue";
import type { TableColumn } from "../../types";
import { useDrivers } from "../../composables/useDrivers";
import { formatDate } from "../../utils/dateFormatter";

// Define columns for the Rides table
const columns: TableColumn[] = [
  { key: "driver_id", label: "Driver ID", sortable: true },
  { key: "driver_name", label: "Driver Name", sortable: false },
  { key: "date_of_birth", label: "Date of Birth", sortable: true },
  { key: "phone_number", label: "Phone Number", sortable: false },
  { key: "license_status", label: "License Status", sortable: true },
  {
    key: "vehicle_plate_number",
    label: "Vehicle Plate Number",
    sortable: false,
  },
  { key: "vehicle_ownership", label: "Vehicle Ownership", sortable: true },
  { key: "register_at", label: "Registered At", sortable: true },
];

// Use the rides composable
const { drivers, isLoading, error, fetchDrivers } = useDrivers();

// Fetch rides when component mounts
onMounted(() => {
  fetchDrivers();
});

type ColorMap = Record<string, string>;

const getStatusColor = (
  value: string,
  map: ColorMap,
  fallback = "text-white",
): string => {
  return map[value] || fallback;
};

const licenseStatusColors: ColorMap = {
  active: "text-success",
  expired: "text-warning",
  suspended: "text-warning",
  revoked: "text-danger",
};

const vehicleOwnershipColors: ColorMap = {
  owned: "text-info",
  rented: "text-warning",
  company: "text-success",
  other: "text-secondary-light",
};
</script>

<template>
  <div class="flex flex-col gap-8">
    <h2 class="text-white text-4xl">Drivers</h2>
    <!-- Loading State -->
    <div v-if="isLoading" class="text-white">Loading drivers...</div>

    <!-- Error State -->
    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <div v-else>
      <!-- Rides Table -->
      <tablesDataTable
        :columns="columns"
        :data="drivers"
        :actions="true"
        :default-entries-per-page="10"
      >
        <!-- Custom formatting for driver name -->
        <template #cell-driver_name="{ item }">
          <span class="text-gray-300"
            >{{ item.last_name }}, {{ item.first_name }}
            {{ item.middle_name }}</span
          >
        </template>

        <!-- Custom formatting for license status -->
        <template #cell-license_status="{ value }">
          <span :class="getStatusColor(value, licenseStatusColors)">{{
            value
          }}</span>
        </template>

        <!-- Custom formatting for vehicle ownership -->
        <template #cell-vehicle_ownership="{ value }">
          <span :class="getStatusColor(value, vehicleOwnershipColors)">{{
            value
          }}</span>
        </template>

        <!-- Custom formatting for dates -->
        <template #cell-date_of_birth="{ value }">
          <span class="text-gray-300">{{ formatDate(value, false) }}</span>
        </template>
        <template #cell-register_at="{ value }">
          <span class="text-gray-300">{{ formatDate(value, false) }}</span>
        </template>
      </tablesDataTable>
    </div>
  </div>
</template>
