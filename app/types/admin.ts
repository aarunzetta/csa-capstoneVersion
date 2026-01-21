export interface Admin {
  admin_id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  role: "superadmin" | "admin" | "moderator";
  is_active: number;
  registered_at: Date;
  last_login?: Date;
}
