<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, ref } from "vue";
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Eye,
  Pencil,
  Trash2,
  Ellipsis,
  ShieldOff,
  Search,
  ShieldCheck,
} from "lucide-vue-next";
import type { T } from "vue-router/dist/router-CWoNjPRp.mjs";

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

export interface ActionButtons {
  view?: boolean;
  edit?: boolean;
  suspend?: boolean;
  delete?: boolean;
}

export interface ActionLabels {
  edit?: string;
  delete?: string;
  suspend?: string | ((item: T) => string);
}

const props = withDefaults(
  defineProps<{
    columns: TableColumn[];
    data: T[];
    actions?: boolean;
    defaultEntriesPerPage?: number;
    actionButtons?: ActionButtons;
    actionLabels?: ActionLabels;
  }>(),
  {
    actions: true,
    defaultEntriesPerPage: 5,
    actionButtons: () => ({
      view: true,
      edit: true,
      suspend: true,
      delete: true,
    }),
    actionLabels: () => ({
      edit: "Edit",
      delete: "Delete",
    }),
  },
);

const emit = defineEmits<{
  edit: [item: T];
  delete: [item: T];
  view: [item: T];
  suspend: [item: T];
}>();

// Action modal state
const isActionModalOpen = ref(false);
const selectedItem = ref<T | null>(null);
const modalPosition = ref({ top: 0, left: 0 });

// Computed suspend label
const suspendLabel = computed(() => {
  if (!selectedItem.value) return "Suspend";

  // Check if the selected item has is_active property and determine label accordingly
  if (
    "is_active" in selectedItem.value &&
    typeof selectedItem.value.is_active === "number"
  ) {
    return selectedItem.value.is_active === 1 ? "Suspend" : "Activate";
  }

  return "Suspend";
});

// Computed suspend button color class
const suspendColorClass = computed(() => {
  if (!selectedItem.value) return "text-warning";

  // Check if the selected item has is_active property and determine color accordingly
  if (
    "is_active" in selectedItem.value &&
    typeof selectedItem.value.is_active === "number"
  ) {
    return selectedItem.value.is_active === 1 ? "text-warning" : "text-success";
  }

  return "text-warning";
});

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

// Action modal methods
const openActionModal = (item: T, event: MouseEvent) => {
  selectedItem.value = item;
  const button = event.currentTarget as HTMLButtonElement;
  const rect = button.getBoundingClientRect();

  modalPosition.value = {
    top: rect.bottom - 12,
    left: rect.left - 155,
  };

  isActionModalOpen.value = true;
};

const closeActionModal = () => {
  isActionModalOpen.value = false;
  selectedItem.value = null;
};

const handleView = () => {
  if (selectedItem.value) {
    emit("view", selectedItem.value);
    closeActionModal();
  }
};

const handleEdit = () => {
  if (selectedItem.value) {
    emit("edit", selectedItem.value);
    closeActionModal();
  }
};

const handleSuspend = () => {
  if (selectedItem.value) {
    emit("suspend", selectedItem.value);
    closeActionModal();
  }
};

const handleDelete = () => {
  if (selectedItem.value) {
    emit("delete", selectedItem.value);
    closeActionModal();
  }
};
</script>

<template>
  <div
    class="w-full bg-secondary border border-secondary-light p-6 rounded-lg space-y-4"
  >
    <!-- Top Controls -->
    <div class="flex justify-between items-center">
      <label class="flex items-center gap-2 text-white">
        Show
        <select
          v-model.number="entriesPerPage"
          class="text-white py-1 px-2 border border-secondary-light rounded-lg focus:outline-none bg-secondary"
          @change="handleEntriesChange"
        >
          <option v-for="o in entriesOptions" :key="o" :value="o">
            {{ o }}
          </option>
        </select>
        entries
      </label>

      <div
        class="flex items-center gap-2 text-gray-400 border border-secondary-light px-2 rounded-lg"
      >
        <Search :size="18" />
        <input
          v-model="searchQuery"
          type="text"
          class="text-white py-1 focus:outline-none bg-secondary text-sm"
          placeholder="Search"
          @input="handleSearchChange"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="rounded-t-lg overflow-hidden border border-secondary-light">
      <table class="w-full border-collapse">
        <thead class="bg-secondary text-white border-b border-secondary-light">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="p-2 text-left select-none"
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
          <tr
            v-for="(item, index) in paginatedData"
            :key="index"
            :class="
              index !== paginatedData.length - 1
                ? 'border-b border-secondary-light'
                : ''
            "
            class="text-gray-400"
          >
            <td v-for="column in columns" :key="column.key" class="p-2">
              <slot
                :name="`cell-${column.key}`"
                :item="item"
                :value="item[column.key]"
              >
                {{ item[column.key] }}
              </slot>
            </td>

            <td v-if="actions" class="p-2 relative">
              <slot name="actions" :item="item">
                <button
                  class="bg-none border-none cursor-pointer hover:opacity-70 rounded hover:bg-gray-700 transition-colors"
                  @click="openActionModal(item, $event)"
                >
                  <Ellipsis class="w-5 h-5" />
                </button>
              </slot>
            </td>
          </tr>
          <tr v-if="paginatedData.length === 0">
            <td
              :colspan="columns.length + (actions ? 1 : 0)"
              class="p-2 text-center text-gray-400"
            >
              No data available in this table
            </td>
          </tr>
        </tbody>
      </table>
    </div>

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
            'bg-primary': currentPage === page,
          }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>

        <button
          class="btn-pagination disabled:opacity-30 disabled:cursor-not-allowed"
          :disabled="currentPage >= totalPages"
          @click="goToPage(currentPage + 1)"
        >
          Next
        </button>
      </div>
    </div>
    <!-- Action Modal -->
    <div
      v-if="isActionModalOpen"
      class="fixed inset-0 z-40"
      @click="closeActionModal"
    ></div>
    <div
      v-if="isActionModalOpen"
      class="fixed z-50 bg-secondary rounded-lg p-1 w-48 shadow-xl border border-secondary-light"
      :style="{
        top: `${modalPosition.top}px`,
        left: `${modalPosition.left}px`,
      }"
    >
      <!-- Modal Actions -->
      <div class="flex flex-col gap-1">
        <div
          v-if="props.actionButtons.view || props.actionButtons.edit"
          class="flex flex-col gap-1"
          :class="
            props.actionButtons.suspend || props.actionButtons.delete
              ? 'border-b border-secondary-light'
              : ''
          "
        >
          <button
            v-if="props.actionButtons.view"
            class="flex items-center gap-4 w-full p-2 text-left rounded hover:bg-gray-700 transition-colors text-white text-sm"
            @click="handleView"
          >
            <Eye class="w-4 h-4 text-gray-400" />
            <span class="font-medium">View Details</span>
          </button>

          <button
            v-if="props.actionButtons.edit"
            class="flex items-center gap-4 w-full p-2 text-left rounded hover:bg-gray-700 transition-colors text-white text-sm"
            @click="handleEdit"
          >
            <Pencil class="w-4 h-4 text-gray-400" />
            <span class="font-medium">{{ props.actionLabels.edit }}</span>
          </button>
        </div>
        <div
          v-if="props.actionButtons.suspend || props.actionButtons.delete"
          class="flex flex-col gap-1"
        >
          <button
            v-if="props.actionButtons.suspend"
            class="flex items-center gap-4 w-full p-2 text-left rounded hover:bg-gray-700 transition-colors text-white text-sm"
            @click="handleSuspend"
          >
            <ShieldCheck
              v-if="suspendLabel === 'Activate'"
              class="w-4 h-4 text-gray-400"
            />
            <ShieldOff v-else class="w-4 h-4 text-gray-400" />
            <span class="font-medium" :class="suspendColorClass">{{
              suspendLabel
            }}</span>
          </button>
          <button
            v-if="props.actionButtons.delete"
            class="flex items-center gap-4 w-full p-2 text-left rounded hover:bg-bg-gray-700 transition-colors text-white text-sm"
            @click="handleDelete"
          >
            <Trash2 class="w-4 h-4 text-gray-400" />
            <span class="font-medium text-danger">{{
              props.actionLabels.delete
            }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
