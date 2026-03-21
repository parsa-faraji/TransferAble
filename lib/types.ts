/**
 * Shared TypeScript types for API routes and components.
 * These types complement the Prisma-generated types by providing
 * shapes for API request/response payloads and intermediate data.
 */

import type {
  ActivityCategory,
  ApplicationStatus,
  MilestoneCategory,
  UniversityType,
} from "@prisma/client";

// ─── University ──────────────────────────────────────────────────────
export interface UniversitySummary {
  id: string;
  name: string;
  code: string;
  type: UniversityType;
  city?: string | null;
  state: string;
}

// ─── Application Activity (from form / API body) ────────────────────
export interface ActivityInput {
  title: string;
  description?: string;
  category: ActivityCategory;
  startDate?: string | null;
  endDate?: string | null;
  hoursPerWeek?: number | null;
}

// ─── Stripe Webhook ──────────────────────────────────────────────────
export interface StripeWebhookError {
  message: string;
  type?: string;
}

// ─── User Profile Response ───────────────────────────────────────────
export interface UserProfileResponse {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  subscriptionTier: string;
  communityCollege: {
    id: string;
    name: string;
    code: string;
  } | null;
  currentMajor: string | null;
  major: {
    id: string;
    name: string;
    code: string | null;
    universityId: string;
  } | null;
  targetUniversities: UniversitySummary[];
  completedCourseCodes: string[];
}

// ─── Transfer Prediction ─────────────────────────────────────────────
export interface TransferPrediction {
  overallReadiness: number;
  universityPredictions: {
    university: string;
    likelihood: "high" | "medium" | "low";
    percentage: number;
    reasoning: string;
  }[];
  strengths: string[];
  areasForImprovement: string[];
  recommendations: string[];
}

// ─── ASSIST Course Data ──────────────────────────────────────────────
export interface AssistCourseData {
  ccCourseCode: string;
  ccCourseName: string;
  ucCourseCode: string;
  ucCourseName: string;
  units: number;
  isArticulated: boolean;
}

// ─── API Error Response ──────────────────────────────────────────────
export interface ApiErrorResponse {
  error: string;
}

// ─── API Success Response ────────────────────────────────────────────
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data?: T;
  message?: string;
}
