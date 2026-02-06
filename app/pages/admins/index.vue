<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { TableColumn } from "../../types";
import type { Admin } from "../../types/admin";
import { useAdmins } from "../../composables/useAdmins";
import { formatDate } from "../../utils/dateFormatter";
import { formatLastLogin } from "../../utils/lastLoginFormatter";
import {
  getStatusColor,
  type ColorMap,
} from "../../utils/statusColorFormatter";
import { Dot, Plus, Download } from "lucide-vue-next";
import { capitalize } from "../../utils/capitalizeFormatter";
import { formatRole } from "../../utils/roleFormatter";
import { useToast } from "../../composables/useToast";

// Define columns for the admins table
const columns: TableColumn[] = [
  { key: "admin_name", label: "Admin", sortable: true },
  { key: "role", label: "Role", sortable: false },
  { key: "is_active", label: "Status", sortable: false },
  {
    key: "last_login_at",
    label: "Last Login",
    sortable: true,
    hideOn: "mobile",
  },
  {
    key: "registered_at",
    label: "Registered At",
    sortable: true,
    hideOn: "mobile-tablet",
  },
];

const filters = [
  {
    key: "role",
    label: "Role",
    options: [
      { label: "Admin", value: "admin" },
      { label: "Moderator", value: "moderator" },
      { label: "Super Admin", value: "super_admin" },
    ],
  },
];

// Use the admins composable
const adminsComposable = useAdmins();
const { admins, isLoading, error, fetchAdmins } = adminsComposable;

// Modal state
const isModalOpen = ref(false);
const selectedAdmin = ref<Admin | null>(null);
const isEditModalOpen = ref(false);
const selectedEditAdmin = ref<Admin | null>(null);

const handleViewAdmin = (admin: Admin) => {
  selectedAdmin.value = admin;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedAdmin.value = null;
};

const handleEditAdmin = (admin: Admin) => {
  selectedEditAdmin.value = admin;
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  selectedEditAdmin.value = null;
};

const handleSuspendAdmin = async (admin: Admin) => {
  const { updateAdmin } = adminsComposable;
  const { success, error: showError } = useToast();

  try {
    // Toggle the admin status
    const newStatus = admin.is_active === 1 ? 0 : 1;
    const result = await updateAdmin(admin.admin_id, { is_active: newStatus });

    if (result.success) {
      const action = newStatus === 1 ? "activated" : "suspended";
      success(`Admin ${action} successfully!`);
    } else {
      showError(
        result.message ||
          `Failed to ${newStatus === 1 ? "activate" : "suspend"} admin`,
      );
    }
  } catch (err: unknown) {
    console.error("Suspend/activate admin error:", err);
    showError("An unexpected error occurred");
  }
};

// Fetch admins when component mounts
onMounted(() => {
  fetchAdmins();
});

const roleColors: ColorMap = {
  super_admin:
    "text-success  border border-success px-2 py-2 md:py-[6px] md:px-3 rounded-2xl bg-teal-900 text-nowrap",
  admin:
    "text-info border border-info px-2 py-2 md:py-[6px] md:px-3 rounded-2xl bg-blue-950 text-nowrap",
  moderator:
    "text-warning border border-warning px-2 py-2 md:py-[6px] md:px-3 rounded-2xl bg-amber-950 text-nowrap",
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
        <template #actions>
          <button class="p-3 btn-secondary flex items-center gap-2 text-base">
            <Download class="w-4 h-4 lg:w-5 lg:h-5" /><span
              class="text-sm lg:text-base"
              >Export</span
            >
          </button>
          <NuxtLink
            to="/admins/register"
            class="p-3 btn-primary flex items-center gap-2 text-base"
          >
            <Plus class="w-4 h-4 lg:w-5 lg:h-5" /><span
              class="text-sm lg:text-base"
              >Add Admin</span
            >
          </NuxtLink></template
        >
      </layoutHeader>
    </div>
    <!-- Page Content -->
    <div class="bg-secondary-dark text-white p-6 flex-1">
      <div class="flex flex-col gap-8">
        <div>
          <h2 class="text-white text-2xl md:text-3xl lg:text-4xl font-semibold">
            Admins
          </h2>
          <p class="text-gray-400 text-sm md:text-base mt-2">
            Manage administrative users and permissions
          </p>
        </div>
        <!-- Loading State -->
        <div v-if="isLoading">
          <skeletonTableSkeleton :rows="8" :columns="6" />
        </div>
        <!-- Error State -->
        <div v-else-if="error" class="text-red-500">{{ error }}</div>

        <div v-else>
          <!-- admins Table -->
          <tablesDataTable
            :columns="columns"
            :data="admins"
            :actions="true"
            :default-entries-per-page="10"
            :filters="filters"
            :action-buttons="{
              view: true,
              edit: true,
              suspend: true,
              delete: false,
            }"
            :action-labels="{
              edit: 'Edit Admin',
              suspend: 'Suspend',
            }"
            @view="handleViewAdmin"
            @edit="handleEditAdmin"
            @suspend="handleSuspendAdmin"
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
                class="text-xs md:text-sm"
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
    <uiAdminDetailsModal
      :is-open="isModalOpen"
      :admin="selectedAdmin"
      @close="closeModal"
    />
    <uiEditAdminModal
      :is-open="isEditModalOpen"
      :admin="selectedEditAdmin"
      :admins-composable="adminsComposable"
      @close="closeEditModal"
    />
  </div>
</template>
