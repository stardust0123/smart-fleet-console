export type UserRole =
  | "MANAGER"
  | "MECHANIC"
  | "SAFETY"
  | "DRIVER";

export interface User {
  id: number;
  full_name: string;
  email: string;
  password: string;
  role: UserRole;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface LoginPayload {
  email: string;
  password: string;
}