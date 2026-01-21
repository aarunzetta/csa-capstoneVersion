export interface Feedback {
  feedback_id: number;
  ride_id: number;
  passenger_id: number;
  driver_id: number;
  rating: number;
  comments?: string;
  created_at: Date;
}
