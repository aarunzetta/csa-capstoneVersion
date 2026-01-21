<script setup lang="ts">
import { useRoute } from "vue-router";
import { navigationConfig } from "../../config/navigation";
import { useSidebar } from "../../composables/useSidebar";

const route = useRoute();
const { isOpen } = useSidebar();

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + "/");
};
</script>

<template>
  <div
    class="bg-white border-r border-secondary-dark h-full flex flex-col transition-all duration-300 ease-in-out"
    :class="isOpen ? 'w-64' : 'w-0 md:w-[88px]'"
  >
    <!-- Header -->
    <div
      class="flex justify-center items-center py-4 px-4 min-h-[72px] overflow-hidden"
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
      <h1
        v-show="isOpen"
        class="text-primary font-bold text-xl ml-2 whitespace-nowrap transition-opacity duration-300 ease-in-out"
      >
        ComSecApp
      </h1>
    </div>
    <!-- Navigation Links -->
    <div class="flex flex-col gap-8 overflow-y-auto overflow-x-hidden">
      <template v-for="section in navigationConfig" :key="section.title">
        <!-- Section Items -->
        <div v-if="!section.title" class="flex flex-col">
          <NuxtLink
            v-for="item in section.items"
            :key="item.path"
            :to="item.path"
            class="flex gap-2 items-center cursor-pointer py-3 px-8 transition-colors duration-200"
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
        <div v-else class="flex flex-col">
          <div
            v-if="section.title"
            v-show="isOpen"
            class="text-sm text-primary px-8 mb-2 transition-opacity duration-300"
          >
            {{ section.title }}
          </div>
          <NuxtLink
            v-for="item in section.items"
            :key="item.path"
            :to="item.path"
            class="flex gap-2 items-center cursor-pointer py-3 px-8 transition-colors duration-200"
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
      </template>
    </div>
  </div>
</template>
