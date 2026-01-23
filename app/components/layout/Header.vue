<script lang="ts" setup>
import { Menu, User } from "lucide-vue-next";
import { useSidebar } from "../../composables/useSidebar";
const { toggleSidebar } = useSidebar();
</script>

<template>
  <div
    class="w-full bg-white flex justify-between items-center p-4 border-b border-secondary-dark"
  >
    <button
      class="hover:bg-gray-100 p-2 rounded transition-colors"
      @click="toggleSidebar"
    >
      <Menu color="#047857" />
    </button>

    <User color="#047857" />
  </div>
</template>

<style></style>
