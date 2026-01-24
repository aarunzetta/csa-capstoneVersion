<script setup lang="ts">
import { computed, type Component } from "vue";

interface Step {
  number: number;
  title: string;
  icon: Component;
}

interface Props {
  steps: Step[];
  currentStep: number;
}

const props = defineProps<Props>();

const totalSteps = computed(() => props.steps.length);
const progressPercentage = computed(() => {
  if (totalSteps.value <= 1) return 0;
  return ((props.currentStep - 1) / (totalSteps.value - 1)) * 100;
});
</script>

<template>
  <div class="mb-8">
    <div class="flex items-center justify-between relative">
      <!-- Progress Line -->
      <div
        class="absolute top-1/3 left-10 right-5 h-1 bg-secondary-light -translate-y-1/2 z-0"
      >
        <div
          class="h-full bg-primary transition-all duration-200"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>

      <!-- Steps -->
      <div
        v-for="step in steps"
        :key="step.number"
        class="flex flex-col items-center gap-2 relative z-10"
      >
        <div
          class="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 border-1"
          :class="[
            currentStep >= step.number
              ? 'bg-primary  text-white'
              : 'bg-gray-700 border-gray-700 text-gray-400',
          ]"
        >
          <!-- User Icon -->
          <component :is="step.icon" :size="20" />
        </div>
        <span
          class="text-sm font-medium whitespace-nowrap"
          :class="currentStep >= step.number ? 'text-white' : 'text-gray-400'"
        >
          {{ step.title }}
        </span>
      </div>
    </div>
  </div>
</template>
