<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { TableColumn } from "../../types";
import type { Driver } from "../../types/driver";
import { useDrivers } from "../../composables/useDrivers";
import { formatDate } from "../../utils/dateFormatter";
import {
  getStatusColor,
  type ColorMap,
} from "../../utils/statusColorFormatter";
import { capitalize } from "../../utils/capitalizeFormatter";
import { UserPlus, Download } from "lucide-vue-next";

// Define columns for the Drivers table
const columns: TableColumn[] = [
  { key: "driver_name", label: "Driver", sortable: false },
  { key: "date_of_birth", label: "Date of Birth", sortable: true },
  { key: "phone_number", label: "Phone Number", sortable: false },
  { key: "license_status", label: "License Status", sortable: true },
  {
    key: "vehicle_plate_number",
    label: "Vehicle Plate Number",
    sortable: false,
  },
  { key: "vehicle_ownership", label: "Vehicle Ownership", sortable: true },
  { key: "registered_at", label: "Registered At", sortable: true },
];

// Define filters for the Drivers table
const filters = [
  {
    key: "license_status",
    label: "License Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Suspended", value: "suspended" },
      { label: "Expired", value: "expired" },
      { label: "Revoked", value: "revoked" },
    ],
  },
  {
    key: "vehicle_ownership",
    label: "Vehicle Ownership",
    options: [
      { label: "Owned", value: "owned" },
      { label: "Rented", value: "rented" },
      { label: "Company", value: "company" },
      { label: "Other", value: "other" },
    ],
  },
];

// Use the drivers composable
const driversComposable = useDrivers();
const { drivers, isLoading, error, fetchDrivers } = driversComposable;

// Fetch drivers when component mounts
onMounted(() => {
  fetchDrivers();
});

const licenseStatusColors: ColorMap = {
  active:
    "text-success border border-success py-[6px] px-3 rounded-2xl bg-teal-900",
  expired:
    "text-danger border border-danger py-[6px] px-3 rounded-2xl bg-rose-950",
  suspended:
    "text-warning border border-warning py-[6px] px-3 rounded-2xl bg-amber-950",
  revoked:
    "text-gray-600 border border-gray-600 py-[6px] px-3 rounded-2xl bg-gray-900",
};

const vehicleOwnershipColors: ColorMap = {
  owned: "text-info border border-info py-[6px] px-3 rounded-2xl bg-blue-950",
  rented:
    "text-warning border border-warning py-[6px] px-3 rounded-2xl bg-amber-950",
  company:
    "text-success border border-success py-[6px] px-3 rounded-2xl bg-teal-900",
  other:
    "text-secondary-light border border-secondary-light py-[6px] px-3 rounded-2xl bg-slate-300",
};

const isModalOpen = ref(false);
const selectedDriver = ref<Driver | null>(null);
const isEditModalOpen = ref(false);
const selectedEditDriver = ref<Driver | null>(null);

const handleViewDriver = (driver: Driver) => {
  selectedDriver.value = driver;
  isModalOpen.value = true;
};

const handleEditDriver = (driver: Driver) => {
  selectedEditDriver.value = driver;
  isEditModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedDriver.value = null;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  selectedEditDriver.value = null;
};
</script>

<template>
  <div class="flex flex-col h-screen overflow-y-auto">
    <!-- Sticky Header -->
    <div class="sticky top-0 z-10">
      <layoutHeader>
        <template #actions>
          <button class="p-3 btn-secondary flex items-center gap-2 text-base">
            <Download class="w-5 h-5" /><span>Export</span>
          </button>
          <NuxtLink
            to="/drivers/register"
            class="p-3 btn-primary flex items-center gap-2 text-base"
          >
            <UserPlus class="w-5 h-5" /><span>Register New Driver</span>
          </NuxtLink>
        </template>
      </layoutHeader>
    </div>
    <!-- Page Content -->
    <div class="bg-secondary-dark text-white p-6 flex-1">
      <div class="flex flex-col gap-8">
        <div>
          <h2 class="text-white text-4xl font-semibold">Drivers</h2>
          <p class="text-gray-400 text-base mt-1">
            Manage and monitor all registered drivers
          </p>
        </div>
        <!-- Loading State -->
        <div v-if="isLoading" class="text-white">Loading drivers...</div>

        <!-- Error State -->
        <div v-else-if="error" class="text-danger">{{ error }}</div>

        <div v-else>
          <!-- Drivers Table -->
          <tablesDataTable
            :columns="columns"
            :data="drivers"
            :actions="true"
            :default-entries-per-page="10"
            :filters="filters"
            :action-buttons="{
              view: true,
              edit: true,
              suspend: false,
              delete: false,
            }"
            :action-labels="{
              edit: 'Edit Driver',
              delete: 'Delete Driver',
            }"
            @view="handleViewDriver"
            @edit="handleEditDriver"
          >
            <!-- Custom formatting for driver name -->
            <template #cell-driver_name="{ item }">
              <span class="flex flex-col"
                >{{ item.last_name }}, {{ item.first_name }}
                {{ item.middle_name }}
                <span class="text-xs">#{{ item.driver_id }}</span>
              </span>
            </template>

            <!-- Custom formatting for license status -->
            <template #cell-license_status="{ value }">
              <span
                class="text-sm"
                :class="getStatusColor(value, licenseStatusColors)"
                >{{ capitalize(value) }}</span
              >
            </template>

            <!-- Custom formatting for vehicle ownership -->
            <template #cell-vehicle_ownership="{ value }">
              <span
                class="text-sm"
                :class="getStatusColor(value, vehicleOwnershipColors)"
                >{{ capitalize(value) }}</span
              >
            </template>

            <!-- Custom formatting for dates -->
            <template #cell-date_of_birth="{ value }">
              <span>{{ formatDate(value, false) }}</span>
            </template>
            <template #cell-registered_at="{ value }">
              <span>{{ formatDate(value, false) }}</span>
            </template>
          </tablesDataTable>
        </div>
      </div>
    </div>
    <uiDriverDetailsModal
      :is-open="isModalOpen"
      :driver="selectedDriver"
      @close="closeModal"
    />
    <uiEditDriverModal
      :is-open="isEditModalOpen"
      :driver="selectedEditDriver"
      :drivers-composable="driversComposable"
      @close="closeEditModal"
    />
  </div>
</template>
