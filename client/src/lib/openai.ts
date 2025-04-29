import { apiRequest } from "./queryClient";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user

interface ChatCompletionRequest {
  userId: number;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
}

export async function generateChatResponse(chatRequest: ChatCompletionRequest) {
  try {
    const response = await apiRequest('POST', '/api/chat/completions', chatRequest);
    return await response.json();
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw error;
  }
}

export interface GenerateRecommendationsRequest {
  userId: number;
  wellnessScores: {
    physical: number;
    mental: number;
    sleep: number;
    stress: number;
    nutrition: number;
  };
}

export async function generateRecommendations(request: GenerateRecommendationsRequest) {
  try {
    const response = await apiRequest('POST', '/api/generate/recommendations', request);
    return await response.json();
  } catch (error) {
    console.error('Error generating recommendations:', error);
    throw error;
  }
}

export interface GenerateActionPlanRequest {
  userId: number;
  recommendations: Array<{
    category: string;
    title: string;
    description: string;
  }>;
  weekCount: number;
}

export async function generateActionPlan(request: GenerateActionPlanRequest) {
  try {
    const response = await apiRequest('POST', '/api/generate/action-plan', request);
    return await response.json();
  } catch (error) {
    console.error('Error generating action plan:', error);
    throw error;
  }
}

export interface AnalyzeWellnessScoreRequest {
  userId: number;
  assessmentResponses: Array<{
    questionId: string;
    response: string;
  }>;
}

export async function analyzeWellnessScore(request: AnalyzeWellnessScoreRequest) {
  try {
    const response = await apiRequest('POST', '/api/analyze/wellness-score', request);
    return await response.json();
  } catch (error) {
    console.error('Error analyzing wellness score:', error);
    throw error;
  }
}

export interface OptimizeHsaRequest {
  userId: number;
  hsaInfo: {
    balance: number;
    annualLimit: number;
  };
  wellnessScores: {
    physical: number;
    mental: number;
    sleep: number;
    stress: number;
    nutrition: number;
  };
}

export async function optimizeHsa(request: OptimizeHsaRequest) {
  try {
    const response = await apiRequest('POST', '/api/optimize/hsa', request);
    return await response.json();
  } catch (error) {
    console.error('Error optimizing HSA:', error);
    throw error;
  }
}
