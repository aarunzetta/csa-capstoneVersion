<script setup lang="ts">
defineProps<{
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

function onInput(e: Event) {
  const target = e.target as HTMLInputElement;
  emit("update:modelValue", target.value);
}
</script>

<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-slate-300 mb-2">
      {{ label }}
    </label>
    <input
      :id="id"
      :type="type || 'text'"
      :placeholder="placeholder"
      :value="modelValue"
      class="w-full px-4 py-3 bg-white border border-primary rounded-lg text-secondary-dark placeholder-slate-500 focus:outline-none transition"
      @input="onInput"
    />
  </div>
</template>
