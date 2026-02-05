<script lang="ts" setup>
import { Menu, Bell } from "lucide-vue-next";
import { useSidebar } from "../../composables/useSidebar";
const { toggleSidebar } = useSidebar();
</script>

<template>
  <div
    class="w-full bg-secondary flex justify-between items-center p-4 md:p-6 border-b border-secondary-light h-auto md:h-[83px]"
  >
    <button
      class="rounded transition-colors text-gray-400 hover:bg-gray-800 hover:text-white p-2"
      @click="toggleSidebar"
    >
      <Menu :size="24" />
    </button>

    <div class="flex gap-2 md:gap-4 items-center">
      <slot name="actions"></slot>
      <Bell class="text-gray-400" :size="20" />
    </div>
  </div>
</template>

<style></style>
