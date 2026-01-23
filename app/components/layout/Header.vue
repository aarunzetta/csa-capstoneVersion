<script lang="ts" setup>
import { Menu, User } from "lucide-vue-next";
import { useSidebar } from "../../composables/useSidebar";
const { toggleSidebar } = useSidebar();
</script>

<template>
  <div
    class="w-full bg-secondary flex justify-between items-center p-4 border-b border-secondary-light h-[83px]"
  >
    <button
      class="p-2 rounded transition-colors text-gray-400 hover:bg-gray-800 hover:text-white"
      @click="toggleSidebar"
    >
      <Menu />
    </button>

    <User class="text-gray-100" />
  </div>
</template>

<style></style>
