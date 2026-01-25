<script setup lang="ts">
defineProps<{
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  modelValue: string;
  required?: boolean;
  error?: string;
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
    <label :for="id" class="block text-sm font-medium text-white mb-2">
      {{ label }}<span v-if="required" class="text-danger"> *</span>
    </label>
    <input
      :id="id"
      :type="type || 'text'"
      :placeholder="placeholder"
      :value="modelValue"
      class="w-full px-4 py-3 bg-secondary border border-secondary-light rounded-lg placeholder-gray-600 focus:outline-none transition text-white"
      :class="{ 'border-danger': error }"
      @input="onInput"
    />
    <p v-if="error" class="text-danger text-sm mt-1">
      {{ error }}
    </p>
  </div>
</template>
