export interface Admin {
  admin_id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  role: "super_admin" | "admin" | "moderator";
  is_active: number;
  registered_at: Date | string;
  last_login_at?: Date | string;
}
