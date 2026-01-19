<script setup lang="ts">
import { useRoute } from "vue-router";
import { navigationConfig } from "../../config/navigation";

const route = useRoute();

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + "/");
};
</script>

<template>
  <div class="bg-white border-r border-secondary-dark h-full flex flex-col">
    <!-- Header -->
    <div class="flex justify-center items-center py-4 px-8">
      <NuxtImg
        src="/cma_logo.png"
        alt="cma_logo"
        format="webp"
        loading="lazy"
        sizes="50"
      />
      <h1 class="text-primary font-bold text-xl">ComSecApp</h1>
    </div>
    <!-- Navigation Links -->
    <div class="flex flex-col gap-8 overflow-y-auto">
      <template v-for="section in navigationConfig" :key="section.title">
        <!-- Section Title -->

        <!-- Section Items -->
        <div v-if="!section.title" class="flex flex-col">
          <NuxtLink
            v-for="item in section.items"
            :key="item.path"
            :to="item.path"
            class="flex gap-2 items-center cursor-pointer py-3 px-8"
            :class="
              isActive(item.path)
                ? 'bg-primary text-white'
                : 'text-primary-dark'
            "
          >
            <component
              :is="item.icon"
              :color="isActive(item.path) ? 'white' : '#047857'"
            />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </div>

        <!-- Grouped Section Items -->
        <div v-else class="flex flex-col">
          <div v-if="section.title" class="text-sm text-primary px-8">
            {{ section.title }}
          </div>
          <NuxtLink
            v-for="item in section.items"
            :key="item.path"
            :to="item.path"
            class="flex gap-2 items-center cursor-pointer py-3 px-8"
            :class="
              isActive(item.path)
                ? 'bg-primary text-white'
                : 'text-primary-dark'
            "
          >
            <component
              :is="item.icon"
              :color="isActive(item.path) ? 'white' : '#047857'"
            />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </div>
      </template>
    </div>
  </div>
</template>
