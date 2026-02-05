<script setup lang="ts">
import type { LucideIcon } from "lucide-vue-next";
defineProps<{
  id: string;
  label: string;
  value: number;
  icon?: LucideIcon;
  href: string;
}>();
</script>

<template>
  <div class="bg-secondary rounded-lg border border-secondary-light p-4 md:p-6">
    <h5
      :for="id"
      class="block text-base md:text-lg font-semibold text-gray-400 mb-2"
    >
      {{ label }}
    </h5>
    <div class="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
      {{ value }}
    </div>
    <NuxtLink
      :to="href"
      class="w-full btn-primary flex items-center gap-2 justify-center text-sm md:text-base"
    >
      <component :is="icon" v-if="icon" :size="18" />
      <span>View {{ label }}</span>
    </NuxtLink>
  </div>
</template>
