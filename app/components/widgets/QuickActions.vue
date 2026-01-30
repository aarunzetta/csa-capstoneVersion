<script setup lang="ts">
interface ActionButton {
  label: string;
  icon?: unknown;
  variant: "primary" | "secondary";
  action: () => void;
}

interface Props {
  title?: string;
  actions: ActionButton[];
}

const props = withDefaults(defineProps<Props>(), {
  title: "Quick Actions",
});

function handleAction(action: ActionButton) {
  action.action();
}
</script>

<template>
  <div class="bg-secondary rounded-lg border border-secondary-light p-6">
    <h3 class="text-lg font-semibold text-white mb-4">{{ title }}</h3>
    <div class="space-y-3">
      <button
        v-for="(action, index) in props.actions"
        :key="index"
        :class="[
          'w-full py-2 px-4 flex items-center gap-3 justify-center transition-colors duration-200',
          action.variant === 'primary' ? 'btn-primary' : 'btn-secondary',
        ]"
        @click="handleAction(action)"
      >
        <component :is="action.icon" v-if="action.icon" :size="18" />
        {{ action.label }}
      </button>
    </div>
  </div>
</template>
