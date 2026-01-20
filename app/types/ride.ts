export interface Ride {
  ride_id: number;
  driver_id: number;
  passenger_id: number;
  pickup_latitude: number;
  pickup_longitude: number;
  pickup_address: string;
  dropoff_latitude: number;
  dropoff_longitude: number;
  dropoff_address: string;
  ride_distance_km: number;
  ride_duration_minutes: number;
  started_at: Date;
  completed_at: Date;
}

export interface RideFormData {
  driver_id: number;
  passenger_id: number;
  pickup_address: string;
  dropoff_address: string;
}
