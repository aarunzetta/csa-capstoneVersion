<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import { Bell, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-vue-next";
import { useSidebar } from "../../composables/useSidebar";
const { toggleSidebar, isOpen } = useSidebar();

const isMobile = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024;
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});
</script>

<template>
  <div
    class="w-full bg-secondary flex justify-between items-center p-4 md:p-6 border-b border-secondary-light h-auto md:h-[83px]"
  >
    <button
      class="rounded transition-colors text-gray-400 hover:bg-gray-800 hover:text-white p-2"
      @click="toggleSidebar"
    >
      <Menu v-if="isMobile" :size="24" />
      <PanelLeftClose v-else-if="isOpen" :size="24" />
      <PanelLeftOpen v-else :size="24" />
    </button>

    <div class="flex gap-2 md:gap-4 items-center">
      <slot name="actions"></slot>
      <Bell class="text-gray-400" :size="20" />
    </div>
  </div>
</template>

<style></style>
