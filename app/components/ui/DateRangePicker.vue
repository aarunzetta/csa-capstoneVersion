<script setup lang="ts">
import { ChevronDown, Calendar } from "lucide-vue-next";
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps<{
  id: string;
  label?: string;
  modelValue: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

// Predefined date range options
const dateRangeOptions = [
  { value: "7days", label: "Last 7 days" },
  { value: "30days", label: "Last 30 days" },
  { value: "90days", label: "Last 90 days" },
  { value: "1year", label: "Last Year" },
];

const isOpen = ref(false);
const dropdownRef = ref<HTMLDivElement>();
const buttonRef = ref<HTMLButtonElement>();
const dropdownWidth = ref(0);

const selectedLabel = computed(() => {
  const selected = dateRangeOptions.find(
    (opt) => opt.value === props.modelValue,
  );
  return selected?.label || "Select date range";
});

function toggleDropdown() {
  if (!props.disabled) {
    if (isOpen.value) {
      isOpen.value = false;
    } else {
      window.dispatchEvent(new CustomEvent("close-all-dropdowns"));
      isOpen.value = true;
      dropdownWidth.value = buttonRef.value?.offsetWidth || 0;
    }
  }
}

function selectOption(value: string) {
  emit("update:modelValue", value);
  isOpen.value = false;
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
}

function handleCloseAllDropdowns() {
  isOpen.value = false;
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  window.addEventListener("close-all-dropdowns", handleCloseAllDropdowns);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("close-all-dropdowns", handleCloseAllDropdowns);
});
</script>

<template>
  <div ref="dropdownRef">
    <label :for="id" class="block text-sm font-medium text-white mb-2">
      {{ label }}<span v-if="required" class="text-danger"> *</span>
    </label>
    <div class="relative">
      <button
        :id="id"
        ref="buttonRef"
        type="button"
        :disabled="disabled"
        class="w-[200px] px-4 py-3 bg-secondary border border-secondary-light rounded-lg text-white focus:outline-none transition text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
        :class="{ 'border-danger': error }"
        @click="toggleDropdown"
      >
        <div class="flex items-center gap-3">
          <Calendar class="h-5 w-5 text-gray-400" />
          <span>{{ selectedLabel }}</span>
        </div>
        <ChevronDown
          class="h-5 w-5 text-gray-400 transition-transform"
          :class="{ 'rotate-180': isOpen }"
        />
      </button>

      <!-- Dropdown Options -->
      <div
        v-if="isOpen"
        class="absolute bg-secondary border border-secondary-light rounded-lg shadow-2xl z-10 top-full mt-2"
        :style="{
          width: dropdownWidth + 'px',
        }"
      >
        <div class="max-h-80 overflow-y-auto">
          <button
            v-for="(option, index) in dateRangeOptions"
            :key="option.value"
            type="button"
            class="w-full px-4 py-3 text-left transition"
            :class="{
              'text-gray-400 hover:bg-gray-700 hover:text-white':
                modelValue !== option.value,
              'bg-primary/10 text-primary hover:bg-primary/10':
                modelValue === option.value,
              'rounded-t-lg': index === 0,
              'rounded-b-lg': index === dateRangeOptions.length - 1,
            }"
            @click="selectOption(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>

    <p v-if="error" class="text-danger text-sm mt-1">
      {{ error }}
    </p>
  </div>
</template>
