<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, ref } from "vue";
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Eye,
  Pencil,
  Trash2,
} from "lucide-vue-next";
import type { T } from "vue-router/dist/router-CWoNjPRp.mjs";

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

const props = withDefaults(
  defineProps<{
    columns: TableColumn[];
    data: T[];
    actions?: boolean;
    defaultEntriesPerPage?: number;
  }>(),
  {
    actions: true,
    defaultEntriesPerPage: 5,
  },
);

const emit = defineEmits<{
  edit: [item: T];
  delete: [item: T];
  view: [item: T];
}>();

// Pagination
const currentPage = ref(1);
const entriesPerPage = ref(props.defaultEntriesPerPage);
const entriesOptions = [5, 10, 15, 20];

// Search
const searchQuery = ref("");

// Sorting
const sortKey = ref<string>("");
const sortOrder = ref<"asc" | "desc">("asc");

// Filtered data based on search
const filteredData = computed(() => {
  if (!searchQuery.value) return props.data;

  const query = searchQuery.value.toLowerCase();
  return props.data.filter((item) => {
    return Object.values(item).some((value) => {
      return String(value).toLowerCase().includes(query);
    });
  });
});

// Sorted data
const sortedData = computed(() => {
  if (!sortKey.value) return filteredData.value;

  return [...filteredData.value].sort((a, b) => {
    const aVal = a[sortKey.value];
    const bVal = b[sortKey.value];

    if (aVal < bVal) return sortOrder.value === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder.value === "asc" ? 1 : -1;
    return 0;
  });
});

// Paginated data
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * entriesPerPage.value;
  const end = start + entriesPerPage.value;
  return sortedData.value.slice(start, end);
});

// Total pages
const totalPages = computed(() => {
  return Math.ceil(sortedData.value.length / entriesPerPage.value);
});

// Pagination info
const showingFrom = computed(() => {
  return (currentPage.value - 1) * entriesPerPage.value + 1;
});

const showingTo = computed(() => {
  return Math.min(
    currentPage.value * entriesPerPage.value,
    sortedData.value.length,
  );
});

const totalEntries = computed(() => {
  return sortedData.value.length;
});

// Methods
const handleSort = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortOrder.value = "asc";
  }
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// Reset to page 1 when entries per page changes
const handleEntriesChange = () => {
  currentPage.value = 1;
};

// Reset to page 1 when search changes
const handleSearchChange = () => {
  currentPage.value = 1;
};
</script>

<template>
  <div class="w-full bg-secondary-dark p-6 space-y-4">
    <!-- Top Controls -->
    <div class="flex justify-between items-center">
      <label class="flex items-center gap-2 text-white">
        Show
        <select
          v-model.number="entriesPerPage"
          class="text-secondary-dark py-1 px-2 border border-[#ddd] rounded-sm focus:outline-none"
          @change="handleEntriesChange"
        >
          <option v-for="o in entriesOptions" :key="o" :value="o">
            {{ o }}
          </option>
        </select>
        entries
      </label>

      <label class="flex items-center gap-2 text-white">
        Search:
        <input
          v-model="searchQuery"
          type="text"
          class="text-secondary-dark py-1 px-2 border border-[#ddd] rounded-sm focus:outline-none"
          @input="handleSearchChange"
        />
      </label>
    </div>

    <!-- Table -->
    <table class="w-full border-collapse">
      <thead class="bg-secondary-light text-white">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            class="p-3 text-left select-none"
            :class="column.sortable !== false ? 'cursor-pointer' : ''"
            @click="column.sortable !== false && handleSort(column.key)"
          >
            <div class="flex items-center gap-2">
              <span>{{ column.label }}</span>

              <!-- Sort Icons -->
              <span
                v-if="column.sortable !== false"
                class="inline-flex items-center text-white/70"
              >
                <!-- Active column -->
                <ArrowUp
                  v-if="sortKey === column.key && sortOrder === 'asc'"
                  class="w-4 h-4"
                />
                <ArrowDown
                  v-else-if="sortKey === column.key && sortOrder === 'desc'"
                  class="w-4 h-4"
                />

                <!-- Inactive (not sorted) -->
                <ArrowUpDown v-else class="w-4 h-4" />
              </span>
            </div>
          </th>

          <th v-if="actions" class="p-3 text-left">Action</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, index) in paginatedData" :key="index">
          <td
            v-for="column in columns"
            :key="column.key"
            class="p-3 border-b border-[#3a3a3a]"
          >
            <slot
              :name="`cell-${column.key}`"
              :item="item"
              :value="item[column.key]"
            >
              {{ item[column.key] }}
            </slot>
          </td>

          <td v-if="actions" class="p-3 border-b border-[#3a3a3a]">
            <slot name="actions" :item="item">
              <div class="flex gap-4">
                <button
                  class="bg-none border-none cursor-pointer hover:opacity-70"
                  @click="emit('view', item)"
                >
                  <Eye class="w-5 h-5" />
                </button>

                <button
                  class="bg-none border-none cursor-pointer hover:opacity-70"
                  @click="emit('edit', item)"
                >
                  <Pencil class="w-5 h-5" />
                </button>

                <button
                  class="bg-none border-none cursor-pointer hover:opacity-70"
                  @click="emit('delete', item)"
                >
                  <Trash2 class="w-5 h-5" />
                </button>
              </div>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Bottom Controls -->
    <div class="flex justify-between items-center text-white">
      <div>
        Showing {{ showingFrom }} to {{ showingTo }} of
        {{ totalEntries }} entries
      </div>

      <div class="flex gap-1">
        <button
          class="btn-pagination disabled:opacity-30 disabled:cursor-not-allowed"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          Previous
        </button>

        <button
          v-for="page in totalPages"
          :key="page"
          class="btn-pagination"
          :class="{
            'bg-primary-dark': currentPage === page,
          }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>

        <button
          class="btn-pagination disabled:opacity-30 disabled:cursor-not-allowed"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
