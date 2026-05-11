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


export type AdminMetrics = {
  total_technicians: number;
  verified_technicians: number;
  pending_verification: number;
  active_services: number;
  inactive_services: number;
  open_disputes: number;
  in_review_disputes: number;
  resolved_disputes: number;
  average_rating: number;
  total_categories: number;
  total_zones: number;
};

export type AdminTechnicianSummary = {
  id: number;
  name: string;
  email: string;
  is_verified: boolean;
  availability_status: string;
  response_time_minutes: number;
  service_count: number;
  average_rating: number;
  zones: string[];
  created_at: string;
};

export type AdminServiceSummary = {
  id: number;
  title: string;
  category: string;
  technician: string;
  base_price: string;
  is_active: boolean;
  created_at: string;
};

export type AdminDisputeSummary = {
  id: number;
  title: string;
  status: string;
  priority: string;
  client: string;
  technician: string;
  service: string | null;
  created_at: string;
};

export type AdminAlert = {
  type: "warning" | "critical" | "info";
  title: string;
  message: string;
};

export type AdminSummary = {
  metrics: AdminMetrics;
  recent_technicians: AdminTechnicianSummary[];
  recent_services: AdminServiceSummary[];
  recent_disputes: AdminDisputeSummary[];
  role_breakdown: Record<string, number>;
  alerts: AdminAlert[];
};
