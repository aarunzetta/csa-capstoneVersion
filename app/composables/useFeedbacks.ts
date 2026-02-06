import type { Feedback } from "../types";
import { useApi } from "./useApi";

interface FeedbacksResponse {
  success: boolean;
  count: number;
  data: Feedback[];
}

interface FeedbackResponse {
  success: boolean;
  data: Feedback;
}
export const useFeedbacks = () => {
  const { apiFetch } = useApi();

  const feedbacks = ref<Feedback[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Fetch all feedbacks from API
  const fetchFeedbacks = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiFetch<FeedbacksResponse>("/feedbacks");

      if (response.success) {
        feedbacks.value = response.data;
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = "Failed to fetch feedbacks";
      }
      console.error("Fetch feedbacks error:", err);
    } finally {
      isLoading.value = false;
    }
  };

  // Get single feedback by ID
  const getFeedbackById = async (id: number) => {
    try {
      const response = await apiFetch<FeedbackResponse>(`/feedbacks/${id}`);
      return response.data;
    } catch (err: unknown) {
      console.error("Get feedback error:", err);
      throw err;
    }
  };

  return {
    feedbacks,
    isLoading,
    error,
    fetchFeedbacks,
    getFeedbackById,
  };
};
