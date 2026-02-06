<script setup lang="ts">
import { computed, watch } from "vue";

interface Props {
  isOpen: boolean;
  message: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "confirmation";
}

const props = withDefaults(defineProps<Props>(), {
  title: "Confirm Action",
  confirmText: "Confirm",
  cancelText: "Cancel",
  type: "confirmation",
});

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

// Handle backdrop click
const handleBackdropClick = () => {
  emit("cancel");
};

// Handle escape key
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    emit("cancel");
  }
};

// Add/remove keyboard listener
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
    } else {
      document.removeEventListener("keydown", handleEscapeKey);
    }
  },
);

// Type-specific styling
const typeClasses = computed(() => {
  switch (props.type) {
    case "danger":
      return {
        confirmButton: "bg-danger hover:bg-red-600 text-white",
        title: "text-danger",
      };
    case "warning":
      return {
        confirmButton: "bg-warning hover:bg-yellow-600 text-white",
        title: "text-warning",
      };
    case "confirmation":
    default:
      return {
        confirmButton: "bg-primary hover:bg-primary/90 text-white",
        title: "text-primary",
      };
  }
});
</script>

<template>
  <!-- Backdrop -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
    @click="handleBackdropClick"
  >
    <!-- Modal -->
    <div
      class="bg-secondary rounded-lg shadow-2xl max-w-md w-full mx-4 border border-secondary-light"
      @click.stop
    >
      <!-- Modal Header -->
      <div class="p-6 border-b border-secondary-light">
        <div class="flex items-center">
          <!-- Title -->
          <h3 :class="['text-lg font-semibold', typeClasses.title]">
            {{ title }}
          </h3>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="p-6">
        <p class="text-gray-400 leading-relaxed">
          {{ message }}
        </p>
      </div>

      <!-- Modal Footer -->
      <div class="p-6 border-t border-secondary-light flex gap-3 justify-end">
        <!-- Cancel Button -->
        <button
          class="px-4 py-2 bg-secondary-light border border-secondary-light rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
          @click="$emit('cancel')"
        >
          {{ cancelText }}
        </button>

        <!-- Confirm Button -->
        <button
          :class="[
            'px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary focus:ring-primary/50',
            typeClasses.confirmButton,
          ]"
          @click="$emit('confirm')"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>
