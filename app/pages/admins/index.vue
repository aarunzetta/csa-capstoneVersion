<script setup lang="ts">
import { onMounted } from "vue";
import type { TableColumn } from "../../types";
import { useAdmins } from "../../composables/useAdmins";
import { formatDate } from "../../utils/dateFormatter";
import { formatLastLogin } from "../../utils/lastLoginFormatter";
import {
  getStatusColor,
  type ColorMap,
} from "../../utils/statusColorFormatter";
import { Dot } from "lucide-vue-next";
import { capitalize } from "../../utils/capitalizeFormatter";
import { formatRole } from "../../utils/roleFormatter";

// Define columns for the admins table
const columns: TableColumn[] = [
  { key: "admin_name", label: "Admin", sortable: true },
  { key: "role", label: "Role", sortable: false },
  { key: "is_active", label: "Status", sortable: false },
  { key: "last_login_at", label: "Last Login", sortable: true },
  { key: "registered_at", label: "Registered At", sortable: true },
];

// Use the admins composable
const { admins, isLoading, error, fetchAdmins } = useAdmins();

// Fetch admins when component mounts
onMounted(() => {
  fetchAdmins();
});

const roleColors: ColorMap = {
  super_admin:
    "text-success  border border-success py-[6px] px-3 rounded-2xl bg-teal-900",
  admin: "text-info border border-info py-[6px] px-3 rounded-2xl bg-blue-950",
  moderator:
    "text-warning border border-warning py-[6px] px-3 rounded-2xl bg-amber-950",
};

const getStatusMeta = (value: number) => {
  if (value === 1) {
    return {
      label: "Active",
      color: "text-success",
    };
  }

  return {
    label: "Suspended",
    color: "text-danger",
  };
};
</script>

<template>
  <div class="flex flex-col h-screen overflow-y-auto">
    <!-- Sticky Header -->
    <div class="sticky top-0 z-10">
      <layoutHeader>
        <template #actions> </template>
      </layoutHeader>
    </div>
    <!-- Page Content -->
    <div class="bg-secondary-dark text-white p-6 flex-1">
      <div class="flex flex-col gap-8">
        <div>
          <h2 class="text-white text-4xl">Admins</h2>
          <p class="text-gray-400 text-base mt-2">
            Manage administrative users and permissions
          </p>
        </div>
        <!-- Loading State -->
        <div v-if="isLoading" class="text-white">Loading admins...</div>

        <!-- Error State -->
        <div v-else-if="error" class="text-red-500">{{ error }}</div>

        <div v-else>
          <!-- admins Table -->
          <tablesDataTable
            :columns="columns"
            :data="admins"
            :actions="true"
            :default-entries-per-page="10"
            :action-labels="{
              edit: 'Edit Admin',
              delete: 'Delete Admin',
            }"
          >
            <!-- Custom formatting for admin name -->
            <template #cell-admin_name="{ item }">
              <span class="flex flex-col"
                >{{ item.first_name }} {{ item.last_name }}
                <span class="text-xs">{{ item.email }}</span>
                <span class="text-xs">#{{ item.admin_id }}</span>
              </span>
            </template>

            <!-- Custom formatting for role -->
            <template #cell-role="{ value }">
              <span
                class="text-sm"
                :class="getStatusColor(value, roleColors)"
                >{{ capitalize(formatRole(value)) }}</span
              >
            </template>

            <!-- Custom formatting for status -->
            <template #cell-is_active="{ value }">
              <span class="flex items-center gap-1 text-white">
                <Dot :class="['w-6 h-6', getStatusMeta(value).color]" />
                <span>{{ getStatusMeta(value).label }}</span>
              </span>
            </template>

            <!-- Custom formatting for last login -->
            <template #cell-last_login_at="{ value }">
              <span>
                {{ formatLastLogin(value) }}
              </span>
            </template>

            <!-- Custom formatting for dates -->
            <template #cell-registered_at="{ value }">
              <span>{{ formatDate(value, false) }}</span>
            </template>
          </tablesDataTable>
        </div>
      </div>
    </div>
  </div>
</template>
