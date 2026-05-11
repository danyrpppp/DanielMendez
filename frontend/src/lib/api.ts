export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
};

export type Zone = {
  id: number;
  name: string;
  slug: string;
  city: string;
  is_active: boolean;
};

export type TechnicianService = {
  id: number;
  category: Category;
  title: string;
  description: string;
  base_price: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type TechnicianProfile = {
  id: number;
  bio: string;
  is_verified: boolean;
  availability_status: "available" | "busy" | "offline";
  response_time_minutes: number;
  completed_services: number;
  service_completion_rate: string;
  zones: Zone[];
};

export type OnboardingResponse = {
  onboarding_complete: boolean;
  profile: TechnicianProfile | null;
};
