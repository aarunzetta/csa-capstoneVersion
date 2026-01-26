<script setup lang="ts">
import {
  X,
  Star,
  MessageSquare,
  Calendar,
  MoveRight,
  CarTaxiFront,
  CircleUser,
  IdCard,
  MapPin,
} from "lucide-vue-next";
import type { Feedback } from "../../types/feedback";
import { formatDate } from "../../utils/dateFormatter";

defineProps<{
  isOpen: boolean;
  feedback: Feedback | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

const handleBackdropClick = () => {
  emit("close");
};

const handleModalClick = (e: MouseEvent) => {
  e.stopPropagation();
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
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center"
  >
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black/50" @click="handleBackdropClick"></div>

    <!-- Modal -->
    <div
      class="relative bg-secondary rounded-lg shadow-2xl max-w-4xl w-full mx-4 border border-secondary-light"
      @click="handleModalClick"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between p-6 border-b border-secondary-light"
      >
        <h2 class="text-2xl font-semibold text-white">Feedback Details</h2>
        <button
          class="text-gray-400 hover:text-white transition-colors"
          @click="handleBackdropClick"
        >
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Content -->
      <div
        v-if="feedback"
        class="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto"
      >
        <!-- Feedback Overview Section -->
        <div class="flex justify-between items-center">
          <!-- Passenger Section -->
          <div class="flex items-center gap-2">
            <CircleUser class="text-primary w-20 h-20" />
            <div>
              <div class="flex flex-col items-start">
                <p class="text-white font-medium text-lg">
                  {{ feedback.passenger_first_name }}
                  {{ feedback.passenger_middle_name }}
                  {{ feedback.passenger_last_name }}
                </p>
                <p class="text-gray-400 text-sm">Passenger</p>
              </div>
            </div>
          </div>

          <!-- Rating Section -->
          <div>
            <div class="flex items-center gap-2 mb-1">
              <p class="text-gray-400 text-sm">Rating</p>
              <span class="text-xs" :class="getSentimentColor(feedback.rating)">
                {{ getSentiment(feedback.rating) }}
              </span>
            </div>

            <div class="flex items-center gap-2">
              <div class="flex gap-1">
                <Star
                  v-for="i in 5"
                  :key="i"
                  :size="20"
                  :class="
                    i <= feedback.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-500'
                  "
                />
              </div>
              <p class="text-white font-medium">
                {{ formatDate(feedback.created_at, false) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Comments Section -->
        <div>
          <div class="bg-secondary-light rounded-lg p-4">
            <div class="flex items-center gap-2 mb-4">
              <MessageSquare class="text-gray-400 w-5 h-5" />
              <h3 class="text-base font-semibold text-gray-400">Comment</h3>
            </div>
            <p v-if="feedback.comment" class="text-white whitespace-pre-wrap">
              {{ feedback.comment }}
            </p>
            <p v-else class="text-gray-400 italic">No comment provided</p>
          </div>
        </div>

        <!-- Participants Section -->
        <div>
          <div class="grid grid-cols-2 gap-4">
            <!-- Driver Section -->
            <div class="bg-secondary-light rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <IdCard class="text-gray-400 w-5 h-5" />
                <p class="text-gray-400 text-sm font-semibold">Driver</p>
              </div>
              <p class="text-white font-medium">
                {{ feedback.driver_first_name }} {{ feedback.driver_last_name }}
              </p>
              <p class="text-white text-xs font-medium">
                #{{ feedback.driver_id }}
              </p>
            </div>
            <div class="bg-secondary-light rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <MapPin class="text-gray-400 w-5 h-5" />
                <p class="text-gray-400 text-sm font-semibold">Route</p>
              </div>
              <p class="flex gap-2 items-center text-white font-medium">
                {{ feedback.pickup_address }}<MoveRight />{{
                  feedback.dropoff_address
                }}
              </p>
            </div>
            <!-- Ride Section -->
            <div class="bg-secondary-light rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <CarTaxiFront class="text-gray-400 w-5 h-5" />
                <p class="text-gray-400 text-sm">Ride ID</p>
              </div>
              <p class="text-white font-medium">#{{ feedback.ride_id }}</p>
            </div>

            <div class="bg-secondary-light rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <Calendar class="text-gray-400 w-5 h-5" />
                <p class="text-gray-400 text-sm">Date</p>
              </div>
              <p class="text-white font-medium">
                {{ formatDate(feedback.created_at) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
