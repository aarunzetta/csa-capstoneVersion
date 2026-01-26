<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { TableColumn } from "../../types";
import type { Passenger } from "../../types/passenger";
import { usePassengers } from "../../composables/usePassengers";
import { formatDate } from "../../utils/dateFormatter";
import { UserPlus } from "lucide-vue-next";

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
const passengersComposable = usePassengers();
const { passengers, isLoading, error, fetchPassengers } = passengersComposable;

// Modal state
const isModalOpen = ref(false);
const selectedPassenger = ref<Passenger | null>(null);
const isEditModalOpen = ref(false);
const selectedEditPassenger = ref<Passenger | null>(null);

const handleViewPassenger = (passenger: Passenger) => {
  selectedPassenger.value = passenger;
  isModalOpen.value = true;
};

const handleEditPassenger = (passenger: Passenger) => {
  selectedEditPassenger.value = passenger;
  isEditModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedPassenger.value = null;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  selectedEditPassenger.value = null;
};

// Fetch passengers when component mounts
onMounted(() => {
  fetchPassengers();
});
</script>

<template>
  <div class="flex flex-col h-screen overflow-y-auto">
    <!-- Sticky Header -->
    <div class="sticky top-0 z-10">
      <layoutHeader>
        <template #actions>
          <NuxtLink
            to="/passengers/register"
            class="p-3 btn-primary flex items-center gap-2 text-base"
          >
            <UserPlus class="w-5 h-5" /><span>Register New Passenger</span>
          </NuxtLink></template
        >
      </layoutHeader>
    </div>
    <!-- Page Content -->
    <div class="bg-secondary-dark text-white p-6 flex-1">
      <div class="flex flex-col gap-8">
        <div>
          <h2 class="text-white text-4xl">Passengers</h2>
          <p class="text-gray-400 text-base mt-2">
            Manage and view all registered passengers
          </p>
        </div>
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
            @view="handleViewPassenger"
            @edit="handleEditPassenger"
          >
            <!-- Custom formatting for passenger name -->
            <template #cell-passenger_name="{ item }">
              <span class="text-gray-300 flex flex-col"
                >{{ item.last_name }}, {{ item.first_name }}
                {{ item.middle_name }}
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
    </div>
    <uiPassengerDetailsModal
      :is-open="isModalOpen"
      :passenger="selectedPassenger"
      @close="closeModal"
    />
    <uiEditPassengerModal
      :is-open="isEditModalOpen"
      :passenger="selectedEditPassenger"
      :passengers-composable="passengersComposable"
      @close="closeEditModal"
    />
  </div>
</template>
