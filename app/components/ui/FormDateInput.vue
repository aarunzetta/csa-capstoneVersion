<script setup lang="ts">
import { Calendar, ChevronDown } from "lucide-vue-next";
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps<{
  id: string;
  label: string;
  modelValue: string;
  required?: boolean;
  error?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const isOpen = ref(false);
const currentMonth = ref(new Date());
const pickerRef = ref<HTMLDivElement>();
const buttonRef = ref<HTMLButtonElement>();
const calendarWidth = ref(0);
const isMonthDropdownOpen = ref(false);
const isYearDropdownOpen = ref(false);

const years = computed(() => {
  const currentYear = new Date().getFullYear();
  const yearList = [];
  for (let i = currentYear - 100; i <= currentYear + 10; i++) {
    yearList.push(i);
  }
  return yearList;
});

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function togglePicker() {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    calendarWidth.value = buttonRef.value?.offsetWidth || 0;
  }
}

const selectedDate = computed(() => {
  return props.modelValue ? new Date(props.modelValue) : null;
});

const daysInMonth = computed(() => {
  return new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() + 1,
    0,
  ).getDate();
});

const firstDayOfMonth = computed(() => {
  return new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth(),
    1,
  ).getDay();
});

const calendarDays = computed(() => {
  const days = [];
  for (let i = 0; i < firstDayOfMonth.value; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth.value; i++) {
    days.push(i);
  }
  return days;
});

function selectDate(day: number) {
  const year = currentMonth.value.getFullYear();
  const month = currentMonth.value.getMonth();
  const date = new Date(year, month, day);
  const year_str = date.getFullYear();
  const month_str = String(date.getMonth() + 1).padStart(2, "0");
  const day_str = String(date.getDate()).padStart(2, "0");
  const dateString = `${year_str}-${month_str}-${day_str}`;
  emit("update:modelValue", dateString);
  isOpen.value = false;
}

function isDateSelected(day: number | null) {
  if (!day || !selectedDate.value) return false;
  return (
    day === selectedDate.value.getDate() &&
    currentMonth.value.getMonth() === selectedDate.value.getMonth() &&
    currentMonth.value.getFullYear() === selectedDate.value.getFullYear()
  );
}

function formatDisplayDate(dateString: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function handleClickOutside(event: MouseEvent) {
  if (pickerRef.value && !pickerRef.value.contains(event.target as Node)) {
    isOpen.value = false;
    isMonthDropdownOpen.value = false;
    isYearDropdownOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div ref="pickerRef">
    <label :for="id" class="block text-sm font-medium text-white mb-2">
      {{ label }}<span v-if="required" class="text-danger"> *</span>
    </label>
    <div class="relative">
      <button
        :id="id"
        ref="buttonRef"
        type="button"
        class="w-full px-4 py-3 bg-secondary border border-secondary-light rounded-lg text-white focus:outline-none transition text-left flex items-center justify-between"
        :class="{ 'border-danger': error }"
        @click="togglePicker"
      >
        <span>
          {{ modelValue ? formatDisplayDate(modelValue) : "Select date" }}</span
        >
        <Calendar class="h-5 w-5 text-gray-400" />
      </button>

      <!-- Calendar Modal -->
      <div
        v-if="isOpen"
        class="absolute bg-secondary border border-secondary-light rounded-lg shadow-2xl z-10 bottom-full mb-2"
        :style="{
          width: calendarWidth + 'px',
        }"
      >
        <div class="p-4">
          <!-- Year and Month Selectors -->
          <div class="grid grid-cols-2 gap-2 mb-4">
            <!-- Month Dropdown -->
            <div class="relative">
              <button
                type="button"
                class="w-full px-3 py-2 bg-secondary-light border border-secondary-light rounded text-white text-sm focus:outline-none transition text-left flex items-center justify-between"
                @click="
                  isMonthDropdownOpen = !isMonthDropdownOpen;
                  isYearDropdownOpen = false;
                "
              >
                <span>{{ months[currentMonth.getMonth()] }}</span>
                <ChevronDown
                  class="h-4 w-4 transition-transform"
                  :class="{ 'rotate-180': isMonthDropdownOpen }"
                />
              </button>
              <div
                v-if="isMonthDropdownOpen"
                class="absolute top-full left-0 right-0 mt-1 bg-secondary border border-secondary-light rounded shadow-lg z-50"
              >
                <button
                  v-for="(month, index) in months"
                  :key="index"
                  type="button"
                  class="w-full px-3 py-2 text-left text-sm text-gray-400 hover:bg-gray-700 hover:text-white transition"
                  :class="{
                    'bg-primary/10 text-primary hover:bg-primary/10':
                      currentMonth.getMonth() === index,
                    'rounded-t': index === 0,
                    'rounded-b': index === months.length - 1,
                  }"
                  @click.stop="
                    currentMonth = new Date(
                      currentMonth.getFullYear(),
                      index,
                      1,
                    );
                    isMonthDropdownOpen = false;
                  "
                >
                  {{ month }}
                </button>
              </div>
            </div>

            <!-- Year Dropdown -->
            <div class="relative">
              <button
                type="button"
                class="w-full px-3 py-2 bg-secondary-light border border-secondary-light rounded text-white text-sm focus:outline-none transition text-left flex items-center justify-between"
                @click="
                  isYearDropdownOpen = !isYearDropdownOpen;
                  isMonthDropdownOpen = false;
                "
              >
                <span>{{ currentMonth.getFullYear() }}</span>
                <ChevronDown
                  class="h-4 w-4 transition-transform"
                  :class="{ 'rotate-180': isYearDropdownOpen }"
                />
              </button>
              <div
                v-if="isYearDropdownOpen"
                class="absolute top-full left-0 right-0 mt-1 bg-secondary border border-secondary-light rounded shadow-lg z-50 max-h-48 overflow-y-auto"
              >
                <button
                  v-for="year in years"
                  :key="year"
                  type="button"
                  class="w-full px-3 py-2 text-left text-sm text-gray-400 hover:bg-gray-700 hover:text-white transition"
                  :class="{
                    'bg-primary/10 text-primary hover:bg-primary/10':
                      currentMonth.getFullYear() === year,
                    'rounded-t': year === years[0],
                    'rounded-b': year === years[years.length - 1],
                  }"
                  @click.stop="
                    currentMonth = new Date(year, currentMonth.getMonth(), 1);
                    isYearDropdownOpen = false;
                  "
                >
                  {{ year }}
                </button>
              </div>
            </div>
          </div>

          <!-- Day Headers -->
          <div class="grid grid-cols-7 gap-2 mb-2">
            <div
              v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
              :key="day"
              class="text-center text-xs font-semibold text-gray-400"
            >
              {{ day }}
            </div>
          </div>

          <!-- Calendar Days -->
          <div class="grid grid-cols-7 gap-2">
            <button
              v-for="(day, index) in calendarDays"
              :key="index"
              type="button"
              :disabled="!day"
              class="h-8 rounded text-sm font-medium transition"
              :class="{
                'text-gray-500 cursor-default': !day,
                'bg-primary/10 text-primary': isDateSelected(day),
                'text-white hover:bg-gray-700': day && !isDateSelected(day),
              }"
              @click="day && selectDate(day)"
            >
              {{ day }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <p v-if="error" class="text-danger text-sm mt-1">
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
button:disabled {
  cursor: default;
}
</style>
