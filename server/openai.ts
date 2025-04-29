import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";

// Initialize the OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

/**
 * Generates a response based on a conversation history.
 */
export async function generateChatCompletion(messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>) {
  try {
    // Convert to the correct OpenAI type
    const formattedMessages: ChatCompletionMessageParam[] = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: formattedMessages,
    });
    
    return {
      content: response.choices[0].message.content,
    };
  } catch (error) {
    console.error('Error generating chat completion:', error);
    throw error;
  }
}

/**
 * Generates wellness recommendations based on wellness scores.
 */
export async function generateWellnessRecommendations(wellnessScores: {
  physical: number;
  mental: number;
  sleep: number;
  stress: number;
  nutrition: number;
}) {
  try {
    const prompt = `
      Based on the following wellness scores (0-100 scale), provide 5 personalized recommendations to improve the user's wellness:
      - Physical health: ${wellnessScores.physical}
      - Mental wellbeing: ${wellnessScores.mental}
      - Sleep quality: ${wellnessScores.sleep}
      - Stress management: ${wellnessScores.stress}
      - Nutrition: ${wellnessScores.nutrition}
      
      For each recommendation, include:
      1. Category (one of: physical, mental, sleep, stress, nutrition)
      2. Title (short, actionable)
      3. Description (1-2 sentences, specific advice)
      4. Whether it is HSA eligible (true/false)
      5. Icon suggestion (one of: heart, brain, bed, running)
      6. Optional tag

      Format your response as a JSON array where each object has: category, title, description, isHSAEligible, icon, tag fields.
    `;

    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: "You are a wellness expert and health coach." },
      { role: "user", content: prompt }
    ];

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages,
      response_format: { type: "json_object" }
    });

    // Parse the JSON response
    const content = response.choices[0].message.content;
    return content ? JSON.parse(content) : { recommendations: [] };
  } catch (error) {
    console.error('Error generating wellness recommendations:', error);
    throw error;
  }
}

/**
 * Generates an action plan based on recommendations.
 */
export async function generateActionPlan(recommendations: Array<{
  category: string;
  title: string;
  description: string;
}>, weekCount: number = 4) {
  try {
    const prompt = `
      Based on the following wellness recommendations, create a ${weekCount}-week action plan:
      ${JSON.stringify(recommendations, null, 2)}
      
      For each week, create 4-5 concrete, actionable tasks that will help the user implement these recommendations.
      The plan should gradually build in complexity and commitment.
      
      Format your response as a JSON array where each object has:
      1. weekNumber (1 to ${weekCount})
      2. startDate (use YYYY-MM-DD, starting from next Monday)
      3. endDate (use YYYY-MM-DD, each week ends on Sunday)
      4. tasks (an array of objects with "description" and "completed" fields, where completed is false)
    `;

    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: "You are a wellness coach who creates effective action plans." },
      { role: "user", content: prompt }
    ];

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages,
      response_format: { type: "json_object" }
    });

    // Parse the JSON response
    const content = response.choices[0].message.content;
    return content ? JSON.parse(content) : { actionPlan: [] };
  } catch (error) {
    console.error('Error generating action plan:', error);
    throw error;
  }
}

/**
 * Analyzes assessment responses to calculate wellness scores.
 */
export async function analyzeWellnessScores(assessmentResponses: Array<{
  questionId: string;
  response: string;
}>) {
  try {
    const prompt = `
      Based on the following assessment responses, analyze the user's wellness and provide scores (0-100) for each category:
      ${JSON.stringify(assessmentResponses, null, 2)}
      
      Please evaluate and score the following areas:
      1. Physical health
      2. Mental wellbeing
      3. Sleep quality
      4. Stress management
      5. Nutrition
      6. Overall wellness score (average of all categories)

      Format your response as a JSON object with these fields: physical, mental, sleep, stress, nutrition, overallScore.
    `;

    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: "You are a wellness assessment specialist." },
      { role: "user", content: prompt }
    ];

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages,
      response_format: { type: "json_object" }
    });

    // Parse the JSON response
    const content = response.choices[0].message.content;
    return content ? JSON.parse(content) : { 
      physical: 70, 
      mental: 65, 
      sleep: 60, 
      stress: 55, 
      nutrition: 65, 
      overallScore: 63
    };
  } catch (error) {
    console.error('Error analyzing wellness scores:', error);
    throw error;
  }
}

/**
 * Generates HSA optimization advice.
 */
export async function generateHsaOptimization(hsaInfo: {
  balance: number;
  annualLimit: number;
}, wellnessScores: {
  physical: number;
  mental: number;
  sleep: number;
  stress: number;
  nutrition: number;
}) {
  try {
    const prompt = `
      Based on the user's HSA information and wellness scores, provide personalized HSA optimization advice:
      
      HSA Information:
      - Current balance: $${hsaInfo.balance}
      - Annual contribution limit: $${hsaInfo.annualLimit}
      
      Wellness Scores (0-100 scale):
      - Physical health: ${wellnessScores.physical}
      - Mental wellbeing: ${wellnessScores.mental}
      - Sleep quality: ${wellnessScores.sleep}
      - Stress management: ${wellnessScores.stress}
      - Nutrition: ${wellnessScores.nutrition}
      
      Provide:
      1. A calculated tax savings estimate based on a 25% tax rate
      2. 3-5 specific, HSA-eligible products or services that address their lowest wellness scores
      3. Projected costs for each recommendation
      4. Priority level for each recommendation
      
      Format your response as a JSON object with these fields: taxSavings, recommendations (array of objects with title, description, cost, priority, and category fields).
    `;

    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: "You are a financial wellness advisor specializing in HSA optimization." },
      { role: "user", content: prompt }
    ];

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages,
      response_format: { type: "json_object" }
    });

    // Parse the JSON response
    const content = response.choices[0].message.content;
    return content ? JSON.parse(content) : { 
      taxSavings: 0,
      recommendations: [] 
    };
  } catch (error) {
    console.error('Error generating HSA optimization advice:', error);
    throw error;
  }
}

/**
 * Generates a response for the Abby AI assistant.
 */
export async function generateAbbyResponse(conversation: Array<{
  role: 'user' | 'assistant';
  content: string;
}>) {
  try {
    // Convert the conversation to the format expected by the OpenAI API
    const systemMessage: ChatCompletionMessageParam = {
      role: "system",
      content: "You are Abby, an AI wellness assistant in the My Well Self application. You help users with their wellness journey, answering questions about health, wellness, stress management, sleep hygiene, and HSA information. Keep your responses concise, conversational, and supportive. If asked about medical specifics, always suggest consulting a healthcare professional."
    };
    
    const messages: ChatCompletionMessageParam[] = [
      systemMessage,
      ...conversation.map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content
      }))
    ];

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages,
      max_tokens: 300
    });

    return {
      content: response.choices[0].message.content || "I'm sorry, I couldn't process that response. How else can I help you with your wellness journey?"
    };
  } catch (error) {
    console.error('Error generating Abby response:', error);
    throw error;
  }
}