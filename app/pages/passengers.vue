<script setup lang="ts">
import { onMounted } from "vue";
import type { TableColumn } from "../types";
import { usePassengers } from "../composables/usePassengers";
import { formatDate } from "../utils/dateFormatter";

// Define columns for the Passengers table
const columns: TableColumn[] = [
  { key: "passenger_name", label: "Passenger", sortable: true },
  { key: "username", label: "Username", sortable: true },
  { key: "date_of_birth", label: "Date of Birth", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "phone_number", label: "Phone Number", sortable: false },
  { key: "registered_at", label: "Registered At", sortable: true },
];

// Use the passenger composable
const { passengers, isLoading, error, fetchPassengers } = usePassengers();

// Fetch passengers when component mounts
onMounted(() => {
  fetchPassengers();
});
</script>

<template>
  <div class="flex flex-col gap-8">
    <h2 class="text-white text-4xl">Passengers</h2>
    <!-- Loading State -->
    <div v-if="isLoading" class="text-white">Loading Passengers...</div>

    <!-- Error State -->
    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <div v-else>
      <!-- Passengers Table -->
      <tablesDataTable
        :columns="columns"
        :data="passengers"
        :actions="true"
        :default-entries-per-page="10"
        :action-buttons="{
          view: true,
          edit: true,
          suspend: false,
          delete: true,
        }"
        :action-labels="{
          edit: 'Edit Passenger',
          delete: 'Delete Passenger',
        }"
      >
        <!-- Custom formatting for passenger name -->
        <template #cell-passenger_name="{ item }">
          <span class="text-gray-300 flex flex-col"
            >{{ item.last_name }}, {{ item.first_name }} {{ item.middle_name }}
            <span class="text-xs">#{{ item.passenger_id }}</span></span
          >
        </template>

        <!-- Custom formatting for dates -->
        <template #cell-date_of_birth="{ value }">
          <span class="text-gray-300">{{ formatDate(value, false) }}</span>
        </template>
        <template #cell-registered_at="{ value }">
          <span class="text-gray-300">{{ formatDate(value, false) }}</span>
        </template>
      </tablesDataTable>
    </div>
  </div>
</template>
