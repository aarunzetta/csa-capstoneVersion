export interface Driver {
  driver_id: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  date_of_birth: Date;
  address_region: string;
  address_province: string;
  address_city: string;
  address_barangay: string;
  address_street: string;
  phone_number: string;
  license_number: string;
  license_expiration_date: Date;
  license_status: "active" | "expired" | "suspended" | "revoked";
  vehicle_ownership: "owned" | "rented" | "company" | "other";
  vehicle_plate_number: string;
  qr_code: string;
  registered_at: Date;
}
