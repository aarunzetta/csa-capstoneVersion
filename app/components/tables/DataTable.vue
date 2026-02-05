<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, ref, watch, onMounted, onUnmounted } from "vue";
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
  X,
  ChevronDown,
} from "lucide-vue-next";
import type { T } from "vue-router/dist/router-CWoNjPRp.mjs";

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  hideOn?: "mobile" | "tablet" | "mobile-tablet";
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

export interface FilterOption {
  label: string;
  value: string;
}

export interface TableFilter {
  key: string;
  label: string;
  options: FilterOption[];
  customFilter?: (item: T, filterValue: string) => boolean;
}

const props = withDefaults(
  defineProps<{
    columns: TableColumn[];
    data: T[];
    actions?: boolean;
    showEntriesOptions?: boolean;
    defaultEntriesPerPage?: number;
    actionButtons?: ActionButtons;
    actionLabels?: ActionLabels;
    filters?: TableFilter[];
  }>(),
  {
    showEntriesOptions: true,
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
    filters: () => [],
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
const entriesOptions = props.showEntriesOptions ? [5, 10, 15, 20] : [];

// Search
const searchQuery = ref("");

// Filters
const activeFilters = ref<Record<string, string>>({});
const filterDropdownStates = ref<Record<string, boolean>>({});

// Sorting
const sortKey = ref<string>("");
const sortOrder = ref<"asc" | "desc">("asc");

// Filtered data based on search and filters
const filteredData = computed(() => {
  let filtered = props.data;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((item) => {
      return Object.values(item).some((value) => {
        return String(value).toLowerCase().includes(query);
      });
    });
  }

  // Apply active filters
  Object.entries(activeFilters.value).forEach(([filterKey, filterValue]) => {
    if (filterValue) {
      const filterConfig = props.filters.find((f) => f.key === filterKey);

      if (filterConfig?.customFilter) {
        // Use custom filter function
        filtered = filtered.filter((item) =>
          filterConfig.customFilter!(item, filterValue),
        );
      } else {
        // Use default filter logic
        filtered = filtered.filter((item) => {
          return (
            String(item[filterKey]).toLowerCase() === filterValue.toLowerCase()
          );
        });
      }
    }
  });

  return filtered;
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

// Clear search
const clearSearch = () => {
  searchQuery.value = "";
  currentPage.value = 1;
};

const clearAllFilters = () => {
  Object.keys(activeFilters.value).forEach((key) => {
    activeFilters.value[key] = "";
  });
  currentPage.value = 1;
};

const hasActiveFilters = computed(() => {
  return Object.values(activeFilters.value).some((value) => value !== "");
});

// Filter dropdown functions
const toggleFilterDropdown = (filterKey: string) => {
  // Close all other dropdowns first
  Object.keys(filterDropdownStates.value).forEach((key) => {
    if (key !== filterKey) {
      filterDropdownStates.value[key] = false;
    }
  });

  // Toggle current dropdown
  filterDropdownStates.value[filterKey] =
    !filterDropdownStates.value[filterKey];
};

const selectFilterOption = (filterKey: string, value: string) => {
  activeFilters.value[filterKey] = value;
  filterDropdownStates.value[filterKey] = false;
  currentPage.value = 1;
};

const getFilterSelectedLabel = (filterKey: string) => {
  const filter = props.filters.find((f) => f.key === filterKey);
  const value = activeFilters.value[filterKey];

  if (!value || !filter) return "All";

  const selected = filter.options.find((opt) => opt.value === value);
  return selected?.label || "All";
};

// Close all filter dropdowns when clicking outside
const handleFilterClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const isFilterDropdown = target.closest("[data-filter-dropdown]");

  if (!isFilterDropdown) {
    Object.keys(filterDropdownStates.value).forEach((key) => {
      filterDropdownStates.value[key] = false;
    });
  }
};

// Add click outside listener
onMounted(() => {
  document.addEventListener("click", handleFilterClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleFilterClickOutside);
});

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

// Disable/enable page scrolling when modal opens/closes
const disableScroll = () => {
  // Disable scrolling on body
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.width = "100%";

  // Also try to disable on main scroll containers
  const scrollContainers = document.querySelectorAll(
    'html, body, .overflow-y-auto, [class*="overflow"]',
  );
  scrollContainers.forEach((container) => {
    if (container instanceof HTMLElement) {
      container.style.overflow = "hidden";
    }
  });
};

const enableScroll = () => {
  // Re-enable scrolling on body
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.width = "";

  // Re-enable on main scroll containers
  const scrollContainers = document.querySelectorAll(
    'html, body, .overflow-y-auto, [class*="overflow"]',
  );
  scrollContainers.forEach((container) => {
    if (container instanceof HTMLElement) {
      container.style.overflow = "";
    }
  });
};

// Watch modal state to control scrolling
watch(isActionModalOpen, (isOpen) => {
  if (isOpen) {
    disableScroll();
  } else {
    enableScroll();
  }
});
</script>

<template>
  <div
    class="w-full bg-secondary border border-secondary-light p-4 md:p-6 rounded-lg space-y-4"
  >
    <!-- Top Controls -->
    <div
      class="flex flex-col md:flex-row md:justify-between md:items-center gap-4"
    >
      <div
        v-if="showEntriesOptions"
        class="flex items-center gap-2 text-white text-sm md:text-base"
      >
        Show
        <select
          v-model.number="entriesPerPage"
          class="text-white py-1 px-2 border border-secondary-light rounded-lg focus:outline-none bg-secondary text-sm"
          @change="handleEntriesChange"
        >
          <option v-for="o in entriesOptions" :key="o" :value="o">
            {{ o }}
          </option>
        </select>
        entries
      </div>
      <div class="flex flex-col md:flex-row gap-4 w-full md:w-auto">
        <!-- Filters Section -->
        <div
          v-if="filters.length > 0"
          class="flex flex-wrap gap-2 md:gap-3 items-center"
        >
          <!-- Clear All Filters Button -->
          <button
            v-if="hasActiveFilters"
            type="button"
            class="flex items-center gap-1 px-3 py-1 text-xs text-gray-400 border border-secondary-light rounded-lg hover:text-white hover:border-white transition-colors duration-200"
            @click="clearAllFilters"
          >
            <X :size="12" />
            Clear All Filters
          </button>
          <div
            v-for="filter in filters"
            :key="filter.key"
            class="flex items-center gap-2"
            data-filter-dropdown
          >
            <label class="text-gray-400 text-sm">{{ filter.label }}:</label>
            <div class="relative">
              <button
                type="button"
                class="px-3 py-1.5 bg-secondary border border-secondary-light rounded-lg text-white focus:outline-none transition text-left flex items-center justify-between min-w-[120px]"
                @click="toggleFilterDropdown(filter.key)"
              >
                <span class="text-sm">{{
                  getFilterSelectedLabel(filter.key)
                }}</span>
                <ChevronDown
                  class="h-4 w-4 text-gray-400 transition-transform"
                  :class="{ 'rotate-180': filterDropdownStates[filter.key] }"
                />
              </button>

              <!-- Dropdown Options -->
              <div
                v-if="filterDropdownStates[filter.key]"
                class="absolute bg-secondary border border-secondary-light rounded-lg shadow-2xl z-10 top-full mt-1"
              >
                <div class="max-h-60 overflow-y-auto">
                  <button
                    type="button"
                    class="w-full px-3 py-1.5 text-left transition text-sm"
                    :class="{
                      'text-gray-400 hover:bg-gray-700 hover:text-white':
                        !activeFilters[filter.key],
                      'bg-primary/10 text-primary hover:bg-primary/10':
                        activeFilters[filter.key] === '',
                      'rounded-t-lg': true,
                      'rounded-b-lg': filter.options.length === 0,
                    }"
                    @click="selectFilterOption(filter.key, '')"
                  >
                    All
                  </button>
                  <button
                    v-for="(option, index) in filter.options"
                    :key="option.value"
                    type="button"
                    class="w-full px-3 py-1.5 text-left transition text-sm"
                    :class="{
                      'text-gray-400 hover:bg-gray-700 hover:text-white':
                        activeFilters[filter.key] !== option.value,
                      'bg-primary/10 text-primary hover:bg-primary/10':
                        activeFilters[filter.key] === option.value,
                      'rounded-b-lg': index === filter.options.length - 1,
                    }"
                    @click="selectFilterOption(filter.key, option.value)"
                  >
                    {{ option.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="flex items-center gap-2 text-gray-400 border border-secondary-light px-2 rounded-lg w-full md:w-auto"
        >
          <Search :size="16" />
          <input
            v-model="searchQuery"
            type="text"
            class="text-white py-2 md:py-1 focus:outline-none bg-secondary text-sm flex-1"
            placeholder="Search"
            @input="handleSearchChange"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="p-1 text-gray-400 hover:text-white transition-colors duration-200"
            title="Clear search"
            @click="clearSearch"
          >
            <X :size="16" />
          </button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="rounded-t-lg overflow-x-auto border border-secondary-light">
      <table class="w-full border-collapse min-w-full">
        <thead class="bg-secondary text-white border-b border-secondary-light">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="p-2 text-left select-none bg-secondary-dark/20 text-xs md:text-sm"
              :class="[
                column.sortable !== false ? 'cursor-pointer' : '',
                column.hideOn === 'mobile' ? 'hidden md:table-cell' : '',
                column.hideOn === 'tablet' ? 'hidden lg:table-cell' : '',
                column.hideOn === 'mobile-tablet' ? 'hidden lg:table-cell' : '',
              ]"
              @click="column.sortable !== false && handleSort(column.key)"
            >
              <div class="flex items-center gap-2">
                <span>{{ column.label }}</span>

                <!-- Sort Icons -->
                <span
                  v-if="column.sortable !== false"
                  class="hidden md:inline-flex items-center text-white/70"
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

            <th
              v-if="actions"
              class="p-3 text-left bg-secondary-dark/20 text-xs md:text-sm"
            >
              Action
            </th>
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
            class="text-gray-400 hover:bg-secondary-dark/20 transition-colors"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="p-2 text-xs md:text-sm"
              :class="[
                column.hideOn === 'mobile' ? 'hidden md:table-cell' : '',
                column.hideOn === 'tablet' ? 'hidden lg:table-cell' : '',
                column.hideOn === 'mobile-tablet' ? 'hidden lg:table-cell' : '',
              ]"
            >
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
                  class="p-1 bg-none border-none cursor-pointer hover:opacity-70 rounded hover:bg-primary hover:text-white transition-colors"
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
    <div
      class="flex flex-col md:flex-row md:justify-between md:items-center text-white gap-4"
    >
      <div class="hidden md:block text-sm">
        Showing {{ showingFrom }} to {{ showingTo }} of
        {{ totalEntries }} entries
      </div>

      <div class="flex gap-1 justify-end">
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
