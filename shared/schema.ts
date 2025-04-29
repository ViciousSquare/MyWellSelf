import { pgTable, text, serial, integer, boolean, jsonb, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const wellnessScores = pgTable("wellness_scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  physical: integer("physical").notNull(),
  mental: integer("mental").notNull(),
  sleep: integer("sleep").notNull(),
  stress: integer("stress").notNull(),
  nutrition: integer("nutrition").notNull(),
  overallScore: integer("overall_score").notNull(),
  assessmentDate: timestamp("assessment_date").defaultNow(),
});

export const hsaInfo = pgTable("hsa_info", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  balance: real("balance").notNull(),
  annualLimit: real("annual_limit").notNull(),
  taxSavings: real("tax_savings"),
});

export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  category: text("category").notNull(), // physical, mental, sleep, nutrition, etc.
  title: text("title").notNull(),
  description: text("description").notNull(),
  isHSAEligible: boolean("is_hsa_eligible").notNull(),
  tag: text("tag"), // HSA Eligible, Habit Building, etc.
  icon: text("icon"), // Font Awesome icon class
});

export const actionPlans = pgTable("action_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  weekNumber: integer("week_number").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  tasks: jsonb("tasks").notNull(), // Array of tasks with completion status
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  role: text("role").notNull(), // user or assistant
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const assessmentResponses = pgTable("assessment_responses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  questionId: text("question_id").notNull(),
  response: text("response").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, createdAt: true });

export const insertWellnessScoreSchema = createInsertSchema(wellnessScores)
  .omit({ id: true, assessmentDate: true });

export const insertHsaInfoSchema = createInsertSchema(hsaInfo)
  .omit({ id: true });

export const insertRecommendationSchema = createInsertSchema(recommendations)
  .omit({ id: true });

export const insertActionPlanSchema = createInsertSchema(actionPlans)
  .omit({ id: true });

export const insertChatMessageSchema = createInsertSchema(chatMessages)
  .omit({ id: true, timestamp: true });

export const insertAssessmentResponseSchema = createInsertSchema(assessmentResponses)
  .omit({ id: true, timestamp: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type WellnessScore = typeof wellnessScores.$inferSelect;
export type InsertWellnessScore = z.infer<typeof insertWellnessScoreSchema>;

export type HsaInfo = typeof hsaInfo.$inferSelect;
export type InsertHsaInfo = z.infer<typeof insertHsaInfoSchema>;

export type Recommendation = typeof recommendations.$inferSelect;
export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;

export type ActionPlan = typeof actionPlans.$inferSelect;
export type InsertActionPlan = z.infer<typeof insertActionPlanSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

export type AssessmentResponse = typeof assessmentResponses.$inferSelect;
export type InsertAssessmentResponse = z.infer<typeof insertAssessmentResponseSchema>;
