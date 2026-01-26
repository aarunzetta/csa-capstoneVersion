<script setup lang="ts">
import {
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  X,
} from "lucide-vue-next";
import { useToast } from "../../composables/useToast";

const { toasts, removeToast } = useToast();

const getIcon = (type: string) => {
  switch (type) {
    case "success":
      return CheckCircle;
    case "error":
      return AlertCircle;
    case "warning":
      return AlertTriangle;
    case "info":
    default:
      return Info;
  }
};

const getStyles = (type: string) => {
  switch (type) {
    case "success":
      return "bg-teal-900 border border-success text-success";
    case "error":
      return "bg-rose-950 border border-danger text-danger";
    case "warning":
      return "bg-amber-950 border border-warning text-warning";
    case "info":
    default:
      return "bg-blue-950 border border-info text-info";
  }
};
</script>

<template>
  <div
    class="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none"
  >
    <transition-group name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg pointer-events-auto',
          getStyles(toast.type),
        ]"
      >
        <component :is="getIcon(toast.type)" class="h-5 w-5 flex-shrink-0" />
        <span class="text-base font-medium">{{ toast.message }}</span>
        <button
          class="ml-2 flex-shrink-0 hover:opacity-70 transition-opacity"
          @click="removeToast(toast.id)"
        >
          <X class="h-4 w-4" />
        </button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
