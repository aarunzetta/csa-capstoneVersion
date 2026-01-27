<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { TableColumn } from "../types";
import type { Feedback } from "../types/feedback";
import { useFeedbacks } from "../composables/useFeedbacks";
import { formatDate } from "../utils/dateFormatter";
import { Star, Download } from "lucide-vue-next";

// Define columns for the feedbacks table
const columns: TableColumn[] = [
  { key: "passenger_name", label: "Passenger", sortable: true },
  { key: "driver_name", label: "Driver", sortable: true },
  { key: "rating", label: "Rating", sortable: true },
  { key: "sentiment", label: "Sentiment", sortable: false },
  { key: "comments", label: "Comments", sortable: false },
  { key: "created_at", label: "Date", sortable: true },
];

// Use the feedback composable
const { feedbacks, isLoading, error, fetchFeedbacks } = useFeedbacks();

// Modal state
const isModalOpen = ref(false);
const selectedFeedback = ref<Feedback | null>(null);

const handleViewFeedback = (feedback: Feedback) => {
  selectedFeedback.value = feedback;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedFeedback.value = null;
};

// Function to get sentiment based on rating
const getSentiment = (rating: number) => {
  if (rating >= 4) return "Positive";
  if (rating === 3) return "Neutral";
  return "Negative";
};

// Function to get sentiment color class
const getSentimentColor = (rating: number) => {
  if (rating >= 4)
    return "text-success border border-success py-[6px] px-3 rounded-2xl bg-teal-900";
  if (rating === 3)
    return "text-warning border border-warning py-[6px] px-3 rounded-2xl bg-amber-950";
  return "text-danger border border-danger py-[6px] px-3 rounded-2xl bg-rose-950";
};

// Function to truncate comments
const truncateComment = (comment: string | undefined, limit: number = 40) => {
  if (!comment) return "";
  return comment.length > limit ? comment.substring(0, limit) + "..." : comment;
};

// Fetch feedbacks when component mounts
onMounted(() => {
  fetchFeedbacks();
});
</script>

<template>
  <div class="flex flex-col h-screen overflow-y-auto">
    <!-- Sticky Header -->
    <div class="sticky top-0 z-10">
      <layoutHeader>
        <template #actions>
          <button class="p-3 btn-secondary flex items-center gap-2 text-base">
            <Download class="w-5 h-5" /><span>Export</span>
          </button>
        </template>
      </layoutHeader>
    </div>
    <!-- Page Content -->
    <div class="bg-secondary-dark text-white p-6 flex-1">
      <div class="flex flex-col gap-8">
        <div>
          <h2 class="text-white text-4xl">Feedbacks</h2>
          <p class="text-gray-400 text-base mt-2">
            Review ratings and feedback from rides
          </p>
        </div>
        <!-- Loading State -->
        <div v-if="isLoading" class="text-white">Loading feedbacks...</div>

        <!-- Error State -->
        <div v-else-if="error" class="text-red-500">{{ error }}</div>

        <div v-else>
          <!-- feedbacks Table -->
          <tablesDataTable
            :columns="columns"
            :data="feedbacks"
            :actions="true"
            :default-entries-per-page="10"
            :action-buttons="{
              view: true,
              edit: false,
              suspend: false,
              delete: false,
            }"
            @view="handleViewFeedback"
          >
            <!-- Custom formatting for passenger name -->
            <template #cell-passenger_name="{ item }">
              <span class="text-gray-300 flex flex-col"
                >{{ item.passenger_last_name }}, {{ item.passenger_first_name }}
                <span class="text-xs">#{{ item.passenger_id }}</span></span
              >
            </template>

            <!-- Custom formatting for driver name -->
            <template #cell-driver_name="{ item }">
              <span class="text-gray-300 flex flex-col"
                >{{ item.driver_last_name }}, {{ item.driver_first_name }}
                <span class="text-xs">#{{ item.driver_id }}</span></span
              >
            </template>

            <!-- Custom formatting for rating with stars -->
            <template #cell-rating="{ item }">
              <div class="flex items-center">
                <div class="flex gap-1">
                  <Star
                    v-for="i in 5"
                    :key="i"
                    :size="16"
                    :class="
                      i <= item.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-500'
                    "
                  />
                </div>
              </div>
            </template>

            <!-- Custom formatting for sentiment -->
            <template #cell-sentiment="{ item }">
              <span class="text-sm" :class="getSentimentColor(item.rating)">
                {{ getSentiment(item.rating) }}
              </span>
            </template>

            <!-- Custom formatting for comments with truncation -->
            <template #cell-comments="{ item }">
              <span class="text-white">{{
                truncateComment(item.comment)
              }}</span>
            </template>

            <!-- Custom formatting for dates -->
            <template #cell-created_at="{ item }">
              <span class="text-white">{{ formatDate(item.created_at) }}</span>
            </template>
          </tablesDataTable>
        </div>
      </div>
    </div>
    <uiFeedbackDetailsModal
      :is-open="isModalOpen"
      :feedback="selectedFeedback"
      @close="closeModal"
    />
  </div>
</template>
