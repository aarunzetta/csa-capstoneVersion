<script setup lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "vue-chartjs";
import { computed } from "vue";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface ChartDataPoint {
  date: string;
  rides: number;
  passengers: number;
  drivers: number;
}

interface Props {
  data: ChartDataPoint[];
  title?: string;
  height?: number;
  showLegend?: boolean;
  timeRange?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Activity Overview",
  height: 300,
  showLegend: true,
  timeRange: "30days",
});

// Generate mock data
const chartData = computed(() => {
  const data = props.data.length > 0 ? props.data : generateMockData();

  return {
    labels: data.map((item) => formatDate(item.date)),
    datasets: [
      {
        label: "Rides",
        data: data.map((item) => item.rides),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Active Passengers",
        data: data.map((item) => item.passengers),
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Active Drivers",
        data: data.map((item) => item.drivers),
        borderColor: "rgb(251, 146, 60)",
        backgroundColor: "rgba(251, 146, 60, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: props.showLegend,
      position: "top" as const,
      labels: {
        color: "white",
        padding: 20,
        font: {
          size: 12,
        },
      },
    },
    title: {
      display: !!props.title,
      text: props.title,
      color: "white",
      font: {
        size: 16,
        weight: "bold",
      },
      padding: {
        bottom: 20,
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleColor: "white",
      bodyColor: "white",
      borderColor: "rgba(255, 255, 255, 0.1)",
      borderWidth: 1,
      padding: 12,
      displayColors: true,
      intersect: false,
      mode: "index" as const,
    },
  },
  scales: {
    x: {
      grid: {
        color: "rgba(255, 255, 255, 0.1)",
        drawBorder: false,
      },
      ticks: {
        color: "rgba(255, 255, 255, 0.7)",
        font: {
          size: 11,
        },
      },
    },
    y: {
      grid: {
        color: "rgba(255, 255, 255, 0.1)",
        drawBorder: false,
      },
      ticks: {
        color: "rgba(255, 255, 255, 0.7)",
        font: {
          size: 11,
        },
      },
    },
  },
  interaction: {
    intersect: false,
    mode: "index",
  },
  elements: {
    point: {
      hoverBackgroundColor: "white",
      hoverBorderWidth: 2,
    },
  },
}));

// Helper function to format dates
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (props.timeRange === "7days") {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  } else if (props.timeRange === "1year") {
    return date.toLocaleDateString("en-US", { month: "short" });
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Mock data for demonstration
function generateMockData(): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  const days =
    props.timeRange === "7days"
      ? 7
      : props.timeRange === "30days"
        ? 30
        : props.timeRange === "90days"
          ? 90
          : 365;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    data.push({
      date: date.toISOString().split("T")[0],
      rides: Math.floor(Math.random() * 50) + 20,
      passengers: Math.floor(Math.random() * 30) + 10,
      drivers: Math.floor(Math.random() * 20) + 5,
    });
  }

  return data;
}
</script>

<template>
  <div class="bg-secondary rounded-lg border border-secondary-light p-6">
    <div :style="{ height: height + 'px' }">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
