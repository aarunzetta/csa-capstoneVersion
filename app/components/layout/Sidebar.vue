<script setup lang="ts">
import { useRoute } from "vue-router";
import { onMounted } from "vue";
import { navigationConfig } from "../../config/navigation";
import { useSidebar } from "../../composables/useSidebar";
import { LogOut } from "lucide-vue-next";
import { useAuth } from "../../composables/useAuth";

const route = useRoute();
const { isOpen } = useSidebar();
const { logout, currentAdmin, fetchCurrentAdmin } = useAuth();

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + "/");
};

const handleLogout = async () => {
  if (confirm("Are you sure you want to logout?")) {
    await logout();
  }
};

onMounted(() => {
  fetchCurrentAdmin();
});
</script>

<template>
  <div
    class="bg-white border-r border-[#ddd] h-full flex flex-col gap-4 transition-all duration-300 ease-in-out"
    :class="isOpen ? 'w-64' : 'w-0 md:w-[88px]'"
  >
    <!-- Header -->
    <NuxtLink
      to="/dashboard"
      class="flex gap-2 items-center py-4 min-h-[72px] overflow-hidden border-b border-[#ddd]"
      :class="isOpen ? 'jusitfy-start px-8 ' : 'justify-center px-4'"
    >
      <NuxtImg
        src="/cma_logo.png"
        alt="cma_logo"
        format="webp"
        loading="lazy"
        width="50"
        height="50"
        class="w-[50px] h-[50px] flex-shrink-0 bg-primary rounded"
      />
      <div v-show="isOpen">
        <h1
          class="text-primary font-bold text-xl whitespace-nowrap transition-opacity duration-300 ease-in-out"
        >
          ComSecApp
        </h1>
        <p
          class="text-primary-dark text-xs whitespace-nowrap transition-opacity duration-300 ease-in-out"
        >
          Management System
        </p>
      </div>
    </NuxtLink>
    <!-- Navigation Links -->
    <div
      class="flex flex-col overflow-y-auto overflow-x-hidden"
      :class="isOpen ? 'gap-8' : 'gap-1'"
    >
      <div v-for="section in navigationConfig" :key="section.title">
        <!-- Section Items -->
        <div v-if="!section.title" class="flex flex-col px-4">
          <NuxtLink
            v-for="item in section.items"
            :key="item.path"
            :to="item.path"
            class="flex gap-2 items-center cursor-pointer py-3 px-4 transition-colors duration-200 rounded-lg"
            :class="
              isActive(item.path)
                ? 'bg-primary text-white'
                : 'text-primary-dark hover:bg-gray-100'
            "
          >
            <component
              :is="item.icon"
              :color="isActive(item.path) ? 'white' : '#047857'"
              class="flex-shrink-0"
            />
            <span
              class="whitespace-nowrap transition-opacity duration-300"
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
            class="text-sm text-primary px-4 mb-2 transition-opacity duration-300"
          >
            {{ section.title }}
          </div>
          <div class="flex flex-col gap-1">
            <NuxtLink
              v-for="item in section.items"
              :key="item.path"
              :to="item.path"
              class="flex gap-2 items-center cursor-pointer py-3 px-4 rounded-lg transition-colors duration-200"
              :class="
                isActive(item.path)
                  ? 'bg-primary text-white'
                  : 'text-primary-dark hover:bg-gray-100'
              "
            >
              <component
                :is="item.icon"
                :color="isActive(item.path) ? 'white' : '#047857'"
                class="flex-shrink-0"
              />
              <span
                class="whitespace-nowrap transition-opacity duration-300"
                :class="isOpen ? 'opacity-100' : 'opacity-0'"
              >
                {{ item.label }}
              </span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    <!-- Logout Section at Bottom -->
    <div class="border-t border-gray-200 mt-auto overflow-hidden">
      <!-- User Info (optional) -->
      <div
        v-if="currentAdmin && isOpen"
        class="px-8 py-3 border-b border-gray-200"
      >
        <p class="text-sm text-primary-dark font-semibold truncate">
          {{ currentAdmin.first_name }} {{ currentAdmin.last_name }}
        </p>
        <p class="text-xs text-secondary-light truncate">
          {{ currentAdmin.email }}
        </p>
      </div>
      <!-- Logout Button -->
      <button
        class="w-full flex gap-2 items-center cursor-pointer py-3 px-8 text-danger hover:bg-red-50 transition-colors duration-200"
        @click="handleLogout"
      >
        <LogOut class="flex-shrink-0" :size="20" />
        <span
          v-if="isOpen"
          class="whitespace-nowrap transition-opacity duration-300"
        >
          Logout
        </span>
      </button>
    </div>
  </div>
</template>
