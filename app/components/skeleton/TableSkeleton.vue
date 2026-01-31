<script setup lang="ts">
interface Props {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  rows: 5,
  columns: 4,
  showHeader: true,
});
</script>

<template>
  <div class="w-full">
    <!-- Header Skeleton -->
    <div v-if="props.showHeader" class="mb-4">
      <div class="flex items-center justify-between mb-4">
        <div class="space-y-2">
          <div class="h-8 w-48 bg-gray-700 rounded animate-pulse"></div>
          <div class="h-4 w-64 bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div class="h-10 w-24 bg-gray-700 rounded animate-pulse"></div>
      </div>
    </div>

    <!-- Table Skeleton -->
    <div class="bg-secondary rounded-lg overflow-hidden">
      <!-- Table Header -->
      <div
        class="grid grid-cols-4 gap-4 p-4 border-b border-gray-700 bg-gray-800"
      >
        <div
          v-for="i in props.columns"
          :key="`header-${i}`"
          class="h-6 bg-gray-600 rounded animate-pulse"
        ></div>
      </div>

      <!-- Table Rows -->
      <div
        v-for="row in props.rows"
        :key="`row-${row}`"
        class="grid grid-cols-4 gap-4 p-4 border-b border-gray-700 last:border-b-0"
      >
        <div
          v-for="col in props.columns"
          :key="`cell-${row}-${col}`"
          class="space-y-2"
        >
          <div class="h-4 bg-gray-700 rounded animate-pulse"></div>
          <div
            v-if="col === 1"
            class="h-3 w-16 bg-gray-700 rounded animate-pulse"
          ></div>
        </div>
      </div>
    </div>

    <!-- Pagination Skeleton -->
    <div class="flex items-center justify-between mt-4">
      <div class="h-4 w-32 bg-gray-700 rounded animate-pulse"></div>
      <div class="flex gap-2">
        <div
          v-for="i in 5"
          :key="`page-${i}`"
          class="h-8 w-8 bg-gray-700 rounded animate-pulse"
        ></div>
      </div>
    </div>
  </div>
</template>
