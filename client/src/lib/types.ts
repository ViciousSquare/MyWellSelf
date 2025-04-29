export interface User {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  createdAt: string;
}

export interface WellnessScore {
  id: number;
  userId: number;
  physical: number;
  mental: number;
  sleep: number;
  stress: number;
  nutrition: number;
  overallScore: number;
  assessmentDate: string;
}

export interface HsaInfo {
  id: number;
  userId: number;
  balance: number;
  annualLimit: number;
  taxSavings?: number;
}

export interface Recommendation {
  id: number;
  userId: number;
  category: string;
  title: string;
  description: string;
  isHSAEligible: boolean;
  tag?: string;
  icon?: string;
}

export interface ActionPlanTask {
  id: number;
  description: string;
  completed: boolean;
}

export interface ActionPlan {
  id: number;
  userId: number;
  weekNumber: number;
  startDate: string;
  endDate: string;
  tasks: ActionPlanTask[];
}

export interface ChatMessage {
  id: number;
  userId: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AssessmentResponse {
  id: number;
  userId: number;
  questionId: string;
  response: string;
  timestamp: string;
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  type: 'likert' | 'followup' | 'multiple_choice' | 'boolean';
  options?: string[];
  condition?: {
    questionId: string;
    responses: string[];
  };
}

export type LikertResponse = 'Excellent' | 'Very good' | 'Good' | 'Fair' | 'Not good at all';
