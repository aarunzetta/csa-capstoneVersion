export interface Passenger {
  passenger_id: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  username: string;
  date_of_birth: Date;
  phone_number: string;
  email: string;
  password_hash: string;
  registered_at: Date;
}
