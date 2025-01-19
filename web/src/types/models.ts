import { Database } from './database-generated.types';

export type User = Database['public']['Tables']['users']['Row'];
export type UserRole = Database['public']['Enums']['user_role'];
export type UserProfile = Database['public']['Views']['user_profile']['Row'];
export type AdminUser = Database['public']['Views']['admin_users']['Row'] & {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  invited_at: string;
  last_sign_in_at: string;
  role: Database['public']['Enums']['user_role'];
};

export type Organization = Database['public']['Tables']['organizations']['Row'] & {
  id: string;
  name: string;
  description: string | null;
};