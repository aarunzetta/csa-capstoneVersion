<script setup lang="ts">
import { computed } from "vue";
import {
  CarTaxiFront,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  MessageSquare,
} from "lucide-vue-next";

interface ActivityItem {
  id: string;
  type: "ride" | "user" | "system" | "feedback";
  action: string;
  description: string;
  timestamp: string;
  status?: "success" | "warning" | "error" | "info";
  metadata?: {
    userId?: string;
    rideId?: string;
    userName?: string;
    amount?: number;
  };
}

interface Props {
  title?: string;
  activities?: ActivityItem[];
  maxItems?: number;
  showTimeAgo?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Recent Activity",
  maxItems: 10,
  showTimeAgo: true,
  activities: () => [],
});

// Generate mock activities if none provided
const activities = computed(() => {
  if (props.activities?.length) {
    return props.activities.slice(0, props.maxItems);
  }
  return generateMockActivities();
});

// Get icon for activity type
function getActivityIcon(type: ActivityItem["type"]) {
  const iconMap = {
    ride: CarTaxiFront,
    user: Users,
    system: AlertCircle,
    feedback: MessageSquare,
  };
  return iconMap[type] || Clock;
}

// Get status color
function getStatusColor(status?: ActivityItem["status"]) {
  const colorMap = {
    success: "text-green-500",
    warning: "text-yellow-500",
    error: "text-danger",
    info: "text-blue-500",
  };
  return colorMap[status || "info"];
}

// Format time ago
function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInMs = now.getTime() - past.getTime();
  const diffInMins = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMins < 1) return "Just now";
  if (diffInMins < 60) return `${diffInMins}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return past.toLocaleDateString();
}

// Generate mock activities
function generateMockActivities(): ActivityItem[] {
  const mockActivities: ActivityItem[] = [
    {
      id: "1",
      type: "ride",
      action: "Ride Completed",
      description: "John Doe completed a ride from Downtown to Airport",
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      status: "success",
      metadata: {
        rideId: "RIDE-001",
        userName: "John Doe",
        amount: 25,
      },
    },
    {
      id: "2",
      type: "user",
      action: "New Driver Registered",
      description: "Sarah Johnson joined as a new driver",
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      status: "success",
      metadata: {
        userId: "USER-123",
        userName: "Sarah Johnson",
      },
    },
    {
      id: "3",
      type: "feedback",
      action: "New Feedback Received",
      description: "Customer rated their experience 5 stars",
      timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
      status: "info",
      metadata: {
        rideId: "RIDE-002",
      },
    },

    {
      id: "5",
      type: "ride",
      action: "Ride Cancelled",
      description: "Ride was cancelled by passenger",
      timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
      status: "warning",
      metadata: {
        rideId: "RIDE-003",
        userName: "Mike Wilson",
      },
    },
  ];

  return mockActivities.slice(0, props.maxItems);
}
</script>

<template>
  <div class="bg-secondary rounded-lg border border-secondary-light p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-white">{{ title }}</h3>
      <button
        class="text-sm text-primary hover:text-primary/80 transition-colors"
      >
        View All
      </button>
    </div>

    <div class="space-y-4">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="flex items-start md:items-center lg:items-start gap-3 p-3 rounded-lg hover:bg-secondary-dark/20 transition-colors"
      >
        <!-- Activity Icon -->
        <div
          :class="[
            'p-2 rounded-lg flex-shrink-0',
            activity.status === 'success'
              ? 'bg-green-500/10'
              : activity.status === 'warning'
                ? 'bg-yellow-500/10'
                : activity.status === 'error'
                  ? 'bg-danger/10'
                  : 'bg-blue-500/10',
          ]"
        >
          <component
            :is="getActivityIcon(activity.type)"
            :size="16"
            :class="getStatusColor(activity.status)"
          />
        </div>

        <!-- Activity Content -->
        <div
          class="md:flex md:items-center md:gap-4 lg:flex-col lg:gap-0 lg:items-start min-w-0"
        >
          <div class="flex items-center gap-2 mb-1">
            <p class="text-sm font-medium text-white">
              {{ activity.action }}
            </p>
            <CheckCircle
              v-if="activity.status === 'success'"
              :size="12"
              class="text-green-500"
            />
            <AlertCircle
              v-else-if="activity.status === 'warning'"
              :size="12"
              class="text-yellow-500"
            />
          </div>
          <p class="text-xs text-gray-400 mb-1">
            {{ activity.description }}
          </p>
          <div class="flex items-center gap-3 text-xs text-gray-500">
            <span v-if="showTimeAgo" class="flex items-center gap-1">
              <Clock :size="10" />
              {{ formatTimeAgo(activity.timestamp) }}
            </span>
            <span v-if="activity.metadata?.amount" class="text-green-400">
              ₱{{ activity.metadata.amount.toFixed(2) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="activities.length === 0" class="text-center py-8">
      <Clock :size="32" class="text-gray-500 mx-auto mb-2" />
      <p class="text-sm text-gray-400">No recent activity</p>
    </div>
  </div>
</template>
