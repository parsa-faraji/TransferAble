import { z } from "zod";

// ─── Contact Form ────────────────────────────────────────────────────
export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required").max(500),
  message: z.string().min(1, "Message is required").max(5000),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

// ─── Email ───────────────────────────────────────────────────────────
export const sendEmailSchema = z.object({
  to: z.union([z.string().email(), z.array(z.string().email())]),
  subject: z.string().min(1).max(500),
  html: z.string().optional(),
  text: z.string().optional(),
}).refine((data) => data.html || data.text, {
  message: "Either html or text content is required",
});

export type SendEmailInput = z.infer<typeof sendEmailSchema>;

// ─── Resources ───────────────────────────────────────────────────────
const resourceTypeEnum = z.enum([
  "SCHOLARSHIP",
  "ARTICLE",
  "VIDEO",
  "GUIDE",
  "TOOL",
  "COMMUNITY_POST",
]);

export const createResourceSchema = z.object({
  title: z.string().min(1, "Title is required").max(500),
  description: z.string().max(2000).optional(),
  type: resourceTypeEnum,
  url: z.string().url().optional().or(z.literal("")),
  content: z.string().max(50000).optional(),
  category: z.string().max(200).optional(),
  tags: z.array(z.string().max(100)).max(20).optional(),
});

export type CreateResourceInput = z.infer<typeof createResourceSchema>;

// ─── Timeline Milestones ─────────────────────────────────────────────
const milestoneCategoryEnum = z.enum([
  "COURSE_ENROLLMENT",
  "APPLICATION_DEADLINE",
  "EXAM_REGISTRATION",
  "ESSAY_SUBMISSION",
  "TRANSCRIPT_REQUEST",
  "FINANCIAL_AID",
  "HOUSING_APPLICATION",
  "OTHER",
]);

export const createMilestoneSchema = z.object({
  timelineId: z.string().min(1, "Timeline ID is required"),
  title: z.string().min(1, "Title is required").max(500),
  description: z.string().max(2000).optional(),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  category: milestoneCategoryEnum,
});

export type CreateMilestoneInput = z.infer<typeof createMilestoneSchema>;

export const updateMilestoneSchema = z.object({
  id: z.string().min(1, "Milestone ID is required"),
  isCompleted: z.boolean(),
});

export type UpdateMilestoneInput = z.infer<typeof updateMilestoneSchema>;

// ─── Mentorship Request ──────────────────────────────────────────────
export const mentorshipRequestSchema = z.object({
  mentorId: z.string().min(1, "Mentor ID is required"),
  message: z.string().max(2000).optional(),
  topic: z.string().max(200).optional(),
});

export type MentorshipRequestInput = z.infer<typeof mentorshipRequestSchema>;

// ─── Chat Message ────────────────────────────────────────────────────
export const chatMessageSchema = z.object({
  requestId: z.string().min(1, "Request ID is required"),
  content: z.string().min(1, "Message content is required").max(5000),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;

// ─── Course Completion ──────────────────────────────────────────────
export const courseCompletionSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
  grade: z.string().max(5).optional(),
  term: z.string().max(50).optional(),
});

export type CourseCompletionInput = z.infer<typeof courseCompletionSchema>;

// ─── Application ─────────────────────────────────────────────────────
const applicationStatusEnum = z.enum([
  "DRAFT",
  "IN_PROGRESS",
  "SUBMITTED",
  "UNDER_REVIEW",
  "ACCEPTED",
  "REJECTED",
  "WAITLISTED",
]);

export const createApplicationSchema = z.object({
  universityId: z.string().optional(),
  universityCode: z.string().optional(),
  universityName: z.string().optional(),
  majorId: z.string().optional(),
  major: z.string().optional(),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid deadline format",
  }),
  status: applicationStatusEnum.optional(),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;

// ─── Timeline ────────────────────────────────────────────────────────
export const createTimelineSchema = z.object({
  targetTransferTerm: z.string().min(1, "Target transfer term is required").max(50),
  milestones: z.array(z.any()).optional(),
});

export type CreateTimelineInput = z.infer<typeof createTimelineSchema>;

// ─── AI Feedback ─────────────────────────────────────────────────────
export const aiFeedbackSchema = z.object({
  prompt: z.string().max(2000).optional(),
  content: z.string().min(1, "Content is required").max(50000),
});

export type AIFeedbackInput = z.infer<typeof aiFeedbackSchema>;

// ─── Transfer Prediction ─────────────────────────────────────────────
export const transferPredictionSchema = z.object({
  gpa: z.union([z.string(), z.number()]).optional(),
  essayQuality: z.string().max(200).optional(),
  extracurriculars: z.string().max(2000).optional(),
  personalStatementQuality: z.string().max(200).optional(),
});

export type TransferPredictionInput = z.infer<typeof transferPredictionSchema>;

// ─── Validation Helper ──────────────────────────────────────────────
/**
 * Validate request body against a Zod schema.
 * Returns the parsed data or a formatted error response.
 */
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ");
    return { success: false, error: errors };
  }
  return { success: true, data: result.data };
}
