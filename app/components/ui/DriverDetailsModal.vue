<script setup lang="ts">
import { X, CircleUser } from "lucide-vue-next";
import type { Driver } from "../../types/driver";
import { formatDate } from "../../utils/dateFormatter";
import { capitalize } from "../../utils/capitalizeFormatter";
import {
  getStatusColor,
  type ColorMap,
} from "../../utils/statusColorFormatter";

defineProps<{
  isOpen: boolean;
  driver: Driver | null;
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
      class="relative bg-secondary rounded-lg shadow-2xl max-w-2xl w-full mx-4 border border-secondary-light"
      @click="handleModalClick"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between p-6 border-b border-secondary-light"
      >
        <h2 class="text-2xl font-semibold text-white">Driver Details</h2>
        <button
          class="text-gray-400 hover:text-white transition-colors"
          @click="handleBackdropClick"
        >
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Content -->
      <div
        v-if="driver"
        class="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto"
      >
        <!-- Personal Information Section -->
        <div>
          <div class="flex items-center gap-2">
            <div>
              <CircleUser class="text-primary w-20 h-20" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <p class="text-white font-medium text-lg">
                  {{ driver.first_name }} {{ driver.middle_name }}
                  {{ driver.last_name }}
                </p>
                <p
                  class="text-xs"
                  :class="
                    getStatusColor(driver.license_status, licenseStatusColors)
                  "
                >
                  {{ capitalize(driver.license_status) }}
                </p>
              </div>
              <div class="flex items-center gap-2">
                <p class="text-gray-400 text-sm">License ID:</p>
                <p class="text-white font-medium">
                  {{ driver.license_number }}
                </p>
              </div>

              <div class="flex items-center gap-2">
                <p class="text-gray-400 text-sm">Driver ID:</p>
                <p class="text-white font-medium">#{{ driver.driver_id }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Personal and Contact Information Section -->
        <div>
          <h3 class="text-lg font-semibold text-white mb-4">
            Personal and Contact Information
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-gray-400 text-sm">Date of Birth</p>
              <p class="font-medium text-white">
                {{ formatDate(driver.date_of_birth, false) }}
              </p>
            </div>

            <div>
              <p class="text-gray-400 text-sm">Phone Number</p>
              <p class="text-white font-medium">{{ driver.phone_number }}</p>
            </div>

            <div class="col-span-2">
              <p class="text-gray-400 text-sm">Street</p>
              <p class="text-white font-medium">
                {{ driver.address_street }}, {{ driver.address_barangay }},
                {{ driver.address_city }}, {{ driver.address_province }},
                {{ driver.address_region }}
              </p>
            </div>
          </div>
        </div>

        <!-- Vehicle Information Section -->
        <div>
          <h3 class="text-lg font-semibold text-white mb-4">
            Vehicle Information
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-gray-400 text-sm">Plate Number</p>
              <p class="text-white font-medium">
                {{ driver.vehicle_plate_number }}
              </p>
            </div>
            <div>
              <p class="text-gray-400 text-sm">Ownership</p>
              <p class="text-white font-medium">
                {{ capitalize(driver.vehicle_ownership) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Date Section -->
        <div class="border-t border-secondary-light pt-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-gray-400 text-sm">Registered At</p>
              <p class="text-white font-medium">
                {{ formatDate(driver.registered_at, false) }}
              </p>
            </div>
            <div>
              <p class="text-gray-400 text-sm">License Expires</p>
              <p class="text-white font-medium">
                {{ formatDate(driver.license_expiration_date, false) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
