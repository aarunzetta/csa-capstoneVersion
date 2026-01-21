import type { Feedback } from "../types";

export const useFeedbacks = () => {
  const feedbacks = ref<Feedback[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // for API integration
  const fetchFeedbacks = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      // Will Replace with actual API call when ready
      // const response = await $fetch<Feedback[]>('/api/feedbacks');
      // feedbacks.value = response;

      // Mock data for now
      feedbacks.value = [
        {
          feedback_id: 301,
          ride_id: 101,
          passenger_id: 201,
          driver_id: 401,
          rating: 4,
          comments: "Great ride, friendly driver.",
          created_at: new Date("2023-09-10T10:30:00Z"),
        },
        {
          feedback_id: 302,
          ride_id: 102,
          passenger_id: 202,
          driver_id: 402,
          rating: 3,
          comments: "Average experience.",
          created_at: new Date("2023-09-11T14:20:00Z"),
        },
        {
          feedback_id: 303,
          ride_id: 103,
          passenger_id: 203,
          driver_id: 403,
          rating: 5,
          comments:
            "Excellent service! the driver is very nice and professional.",
          created_at: new Date("2023-09-12T09:15:00Z"),
        },
        {
          feedback_id: 304,
          ride_id: 104,
          passenger_id: 204,
          driver_id: 404,
          rating: 2,
          comments: "Could be better.",
          created_at: new Date("2023-09-13T16:45:00Z"),
        },
      ];
    } catch (err) {
      error.value = "Failed to fetch feedbacks";
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const deleteFeedback = async (id: number) => {
    try {
      // will replace with actual API call when ready
      // await $fetch(`/api/feedbacks/${id}`, { method: 'DELETE' });

      feedbacks.value = feedbacks.value.filter(
        (r: { feedback_id: number }) => r.feedback_id !== id,
      );
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return {
    feedbacks,
    isLoading,
    error,
    fetchFeedbacks,
    deleteFeedback,
  };
};
