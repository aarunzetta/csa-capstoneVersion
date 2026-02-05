<script setup lang="ts">
import { useRoute } from "vue-router";
import { onMounted, ref, watch } from "vue";
import { navigationConfig } from "../../config/navigation";
import { useSidebar } from "../../composables/useSidebar";
import { LogOut, X } from "lucide-vue-next";
import { useAuth } from "../../composables/useAuth";

const route = useRoute();
const { isOpen, closeSidebar } = useSidebar();
const { logout, currentAdmin, fetchCurrentAdmin } = useAuth();

// Auto-close sidebar on route change for mobile/tablet
watch(route, () => {
  if (typeof window !== "undefined" && window.innerWidth < 1024) {
    closeSidebar();
  }
});

// Confirmation modal state
const isLogoutModalOpen = ref(false);

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + "/");
};

const handleLogout = () => {
  isLogoutModalOpen.value = true;
};

const confirmLogout = async () => {
  isLogoutModalOpen.value = false;
  await logout();
};

const cancelLogout = () => {
  isLogoutModalOpen.value = false;
};

onMounted(() => {
  fetchCurrentAdmin();
});
</script>

<template>
  <!-- Backdrop overlay for mobile/tablet -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 z-40 lg:hidden"
    @click="closeSidebar"
  ></div>

  <!-- Sidebar -->
  <div
    class="bg-secondary border-r border-secondary-light h-full flex flex-col transition-all duration-300 ease-in-out fixed top-0 left-0 z-50 w-full md:w-80 lg:relative lg:z-auto"
    :class="[
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      isOpen ? 'lg:w-64' : 'lg:w-[88px]',
    ]"
  >
    <!-- Close button for mobile/tablet -->
    <button
      class="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors lg:hidden"
      @click="closeSidebar"
    >
      <X />
    </button>

    <!-- Header -->
    <NuxtLink
      to="/dashboard"
      class="flex gap-2 items-center py-4 min-h-[72px] overflow-hidden border-b border-secondary-light mb-4"
      :class="
        isOpen
          ? 'justify-start px-8'
          : 'lg:justify-center lg:px-4 justify-start px-8'
      "
    >
      <NuxtImg
        src="/cma_logo.png"
        alt="cma_logo"
        format="webp"
        loading="lazy"
        width="50"
        height="50"
        class="w-[50px] h-[50px] flex-shrink-0"
      />
      <div v-show="isOpen">
        <h1
          class="text-white font-bold text-xl whitespace-nowrap transition-opacity duration-200 ease-in-out"
        >
          ComSecApp
        </h1>
        <p
          class="text-gray-400 text-xs whitespace-nowrap transition-opacity duration-200 ease-in-out"
        >
          Management System
        </p>
      </div>
    </NuxtLink>
    <!-- Navigation Links -->
    <div
      class="flex flex-col overflow-y-auto overflow-x-hidden mb-4"
      :class="isOpen ? 'gap-8' : 'gap-1'"
    >
      <div v-for="section in navigationConfig" :key="section.title">
        <!-- Section Items -->
        <div v-if="!section.title" class="flex flex-col px-4">
          <NuxtLink
            v-for="item in section.items"
            :key="item.path"
            :to="item.path"
            class="flex gap-3 items-center cursor-pointer py-3 px-4 transition-colors duration-200 rounded-lg"
            :class="
              isActive(item.path)
                ? 'bg-primary/10 text-primary'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            "
          >
            <component
              :is="item.icon"
              class="flex-shrink-0 transition-colors duration-200"
            />
            <span
              class="whitespace-nowrap transition-opacity duration-200 text-base"
              :class="isOpen ? 'opacity-100' : 'opacity-0'"
            >
              {{ item.label }}
            </span>
          </NuxtLink>
        </div>

        <!-- Grouped Section Items -->
        <div v-else class="flex flex-col px-4">
          <div
            v-if="section.title"
            v-show="isOpen"
            class="text-sm text-gray-300 px-4 mb-2 transition-opacity duration-200"
          >
            {{ section.title }}
          </div>
          <div class="flex flex-col gap-1">
            <NuxtLink
              v-for="item in section.items"
              :key="item.path"
              :to="item.path"
              class="flex gap-3 items-center cursor-pointer py-3 px-4 rounded-lg transition-colors duration-200"
              :class="
                isActive(item.path)
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              "
            >
              <component
                :is="item.icon"
                class="flex-shrink-0 transition-colors duration-200"
              />
              <span
                class="whitespace-nowrap transition-opacity duration-200 text-base"
                :class="isOpen ? 'opacity-100' : 'opacity-0'"
              >
                {{ item.label }}
              </span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Admin Info -->
    <div class="mt-auto overflow-hidden px-4">
      <!-- Current User Info -->
      <div v-if="currentAdmin && isOpen" class="px-4 py-3">
        <p class="text-base text-gray-200 font-semibold truncate">
          {{ currentAdmin.first_name }} {{ currentAdmin.last_name }}
        </p>
        <p class="text-sm text-gray-400 truncate">
          {{ capitalize(formatRole(currentAdmin.role)) }}
        </p>
      </div>
    </div>
    <!-- Logout Button -->
    <div class="px-4 py-4 border-t border-secondary-light overflow-hidden">
      <button
        class="group w-full flex gap-3 items-center cursor-pointer py-3 px-4 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors duration-200 rounded-lg"
        @click="handleLogout"
      >
        <LogOut class="flex-shrink-0 transition-colors" />
        <span
          v-if="isOpen"
          class="whitespace-nowrap transition-opacity duration-200 text-base"
        >
          Logout
        </span>
      </button>
    </div>
  </div>

  <!-- Confirmation Modal -->
  <Teleport to="body">
    <uiConfirmationModal
      :is-open="isLogoutModalOpen"
      message="You will need to login again to access the system."
      title="Are you sure you want to logout?"
      confirm-text="Logout"
      cancel-text="Cancel"
      type="confirmation"
      @confirm="confirmLogout"
      @cancel="cancelLogout"
    />
  </Teleport>
</template>
