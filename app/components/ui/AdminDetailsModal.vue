<script setup lang="ts">
import {
  X,
  Shield,
  Dot,
  CircleUser,
  User,
  Mail,
  Phone,
  Clock,
  Calendar,
} from "lucide-vue-next";
import type { Admin } from "../../types/admin";
import { formatDate } from "../../utils/dateFormatter";
import { formatLastLogin } from "../../utils/lastLoginFormatter";
import { capitalize } from "../../utils/capitalizeFormatter";
import { formatRole } from "../../utils/roleFormatter";
import {
  getStatusColor,
  type ColorMap,
} from "../../utils/statusColorFormatter";

defineProps<{
  isOpen: boolean;
  admin: Admin | null;
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
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center"
  >
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black/50" @click="handleBackdropClick"></div>

    <!-- Modal -->
    <div
      class="relative bg-secondary rounded-lg shadow-2xl max-w-xl w-full mx-4 border border-secondary-light"
      @click="handleModalClick"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between p-6 border-b border-secondary-light"
      >
        <h2 class="text-2xl font-semibold text-white">Admin Details</h2>
        <button
          class="text-gray-400 hover:text-white transition-colors"
          @click="handleBackdropClick"
        >
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Content -->
      <div
        v-if="admin"
        class="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto"
      >
        <!-- Admin Overview Section -->
        <div>
          <div class="flex items-center gap-2">
            <div><CircleUser class="text-primary w-20 h-20" /></div>

            <div>
              <p class="text-white font-medium text-lg">
                {{ admin.first_name }} {{ admin.last_name }}
              </p>
              <div class="flex items-center gap-1">
                <span
                  class="text-xs"
                  :class="getStatusColor(admin.role, roleColors)"
                  >{{ capitalize(formatRole(admin.role)) }}</span
                >
                <span class="flex items-center text-white">
                  <Dot
                    :class="['w-6 h-6', getStatusMeta(admin.is_active).color]"
                  />
                  <span>{{ getStatusMeta(admin.is_active).label }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Personal Information Section -->

        <div class="flex flex-col gap-4">
          <div class="flex gap-3 items-center">
            <div class="bg-secondary-light p-2 rounded-lg">
              <User class="text-gray-400 w-5 h-5" />
            </div>
            <div>
              <p class="text-gray-400 text-sm">Username</p>
              <p class="text-info font-medium">@{{ admin.username }}</p>
            </div>
          </div>
          <div class="flex gap-3 items-center">
            <div class="bg-secondary-light p-2 rounded-lg">
              <Mail class="text-gray-400 w-5 h-5" />
            </div>
            <div>
              <p class="text-gray-400 text-sm">Email</p>
              <p class="text-white font-medium">{{ admin.email }}</p>
            </div>
          </div>
          <div v-if="admin.phone_number" class="flex gap-3 items-center">
            <div class="bg-secondary-light p-2 rounded-lg">
              <Phone class="text-gray-400 w-5 h-5" />
            </div>
            <div>
              <p class="text-gray-400 text-sm">Phone</p>
              <p class="text-white font-medium">{{ admin.phone_number }}</p>
            </div>
          </div>
          <div class="flex gap-3 items-center">
            <div class="bg-secondary-light p-2 rounded-lg">
              <Clock class="text-gray-400 w-5 h-5" />
            </div>
            <div>
              <p class="text-gray-400 text-sm">Last Login</p>
              <p class="text-white font-medium">
                {{ formatLastLogin(admin.last_login_at) }}
              </p>
            </div>
          </div>
          <div class="flex gap-3 items-center">
            <div class="bg-secondary-light p-2 rounded-lg">
              <Calendar class="text-gray-400 w-5 h-5" />
            </div>
            <div>
              <p class="text-gray-400 text-sm">Account Created</p>
              <p class="text-white font-medium">
                {{ formatDate(admin.registered_at, false) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Role & Permissions Section -->
        <div class="border-t border-secondary-light pt-6">
          <div class="flex items-center gap-2 mb-4">
            <Shield class="text-primary w-6 h-6" />
            <h3 class="text-lg font-semibold text-white">Permissions</h3>
          </div>
          <div class="bg-secondary-light rounded-lg p-4">
            <div class="text-sm text-gray-300">
              <p v-if="admin.role === 'super_admin'" class="mb-2">
                <strong>Super Admin</strong> has full system access including:
              </p>
              <p v-else-if="admin.role === 'admin'" class="mb-2">
                <strong>Admin</strong> has administrative access including:
              </p>
              <p v-else class="mb-2">
                <strong>Moderator</strong> has limited access including:
              </p>
              <ul class="list-disc list-inside space-y-1 text-xs">
                <li v-if="admin.role === 'super_admin'">
                  Manage all admin accounts
                </li>
                <li
                  v-if="admin.role === 'super_admin' || admin.role === 'admin'"
                >
                  Manage drivers and passengers
                </li>
                <li
                  v-if="admin.role === 'super_admin' || admin.role === 'admin'"
                >
                  View all ride data and feedback
                </li>
                <li
                  v-if="admin.role === 'super_admin' || admin.role === 'admin'"
                >
                  System configuration access
                </li>
                <li>Moderate content and user reports</li>
                <li>View dashboard and analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
