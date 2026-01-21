<script setup lang="ts">
import { onMounted } from "vue";
import type { TableColumn } from "../types";
import { useFeedbacks } from "../composables/useFeedbacks";
import { formatDate } from "../utils/dateFormatter";
import { Star } from "lucide-vue-next";

// Define columns for the feedbacks table
const columns: TableColumn[] = [
  { key: "passenger_id", label: "Passenger ID", sortable: true },
  { key: "driver_id", label: "Driver ID", sortable: true },
  { key: "ride_id", label: "Ride ID", sortable: true },
  { key: "rating", label: "Rating", sortable: true },
  { key: "sentiment", label: "Sentiment", sortable: false },
  { key: "comments", label: "Comments", sortable: false },
  { key: "created_at", label: "Date", sortable: true },
];

// Use the feedback composable
const { feedbacks, isLoading, error, fetchFeedbacks } = useFeedbacks();

// Function to get sentiment based on rating
const getSentiment = (rating: number) => {
  if (rating >= 4) return "positive";
  if (rating === 3) return "neutral";
  return "negative";
};

// Function to get sentiment color class
const getSentimentColor = (rating: number) => {
  if (rating >= 4) return "text-success";
  if (rating === 3) return "text-warning";
  return "text-danger";
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
  <div class="flex flex-col gap-8">
    <h2 class="text-white text-4xl">Feedbacks</h2>
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
      >
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
          <span :class="getSentimentColor(item.rating)">
            {{ getSentiment(item.rating) }}
          </span>
        </template>

        <!-- Custom formatting for comments with truncation -->
        <template #cell-comments="{ item }">
          <span class="text-white">{{ truncateComment(item.comments) }}</span>
        </template>

        <!-- Custom formatting for dates -->
        <template #cell-created_at="{ item }">
          <span class="text-white">{{ formatDate(item.created_at) }}</span>
        </template>
      </tablesDataTable>
    </div>
  </div>
</template>
