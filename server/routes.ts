import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertWellnessScoreSchema, 
  insertHsaInfoSchema, 
  insertRecommendationSchema,
  insertActionPlanSchema,
  insertChatMessageSchema,
  insertAssessmentResponseSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { 
  generateChatCompletion, 
  generateWellnessRecommendations, 
  generateActionPlan,
  analyzeWellnessScores,
  generateHsaOptimization,
  generateAbbyResponse
} from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes - all prefixed with /api
  
  // User routes
  app.get("/api/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await storage.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't send password in response
    const { password, ...userWithoutPassword } = user;
    return res.json(userWithoutPassword);
  });
  
  // Wellness score routes
  app.get("/api/users/:userId/wellness-scores", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const scores = await storage.getWellnessScores(userId);
    return res.json(scores);
  });
  
  app.get("/api/users/:userId/wellness-scores/latest", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const score = await storage.getLatestWellnessScore(userId);
    if (!score) {
      return res.status(404).json({ message: "No wellness scores found" });
    }
    
    return res.json(score);
  });
  
  app.post("/api/wellness-scores", async (req, res) => {
    try {
      const data = insertWellnessScoreSchema.parse(req.body);
      const score = await storage.createWellnessScore(data);
      return res.status(201).json(score);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // HSA info routes
  app.get("/api/users/:userId/hsa-info", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const hsaInfo = await storage.getHsaInfo(userId);
    if (!hsaInfo) {
      return res.status(404).json({ message: "HSA information not found" });
    }
    
    return res.json(hsaInfo);
  });
  
  app.post("/api/hsa-info", async (req, res) => {
    try {
      const data = insertHsaInfoSchema.parse(req.body);
      const hsaInfo = await storage.createOrUpdateHsaInfo(data);
      return res.status(201).json(hsaInfo);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Recommendation routes
  app.get("/api/users/:userId/recommendations", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const recommendations = await storage.getRecommendations(userId);
    return res.json(recommendations);
  });
  
  app.post("/api/recommendations", async (req, res) => {
    try {
      const data = insertRecommendationSchema.parse(req.body);
      const recommendation = await storage.createRecommendation(data);
      return res.status(201).json(recommendation);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Action plan routes
  app.get("/api/users/:userId/action-plans", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const actionPlans = await storage.getActionPlans(userId);
    return res.json(actionPlans);
  });
  
  app.post("/api/action-plans", async (req, res) => {
    try {
      const data = insertActionPlanSchema.parse(req.body);
      const actionPlan = await storage.createActionPlan(data);
      return res.status(201).json(actionPlan);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.patch("/api/action-plans/:id/tasks/:taskIndex", async (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = parseInt(req.params.taskIndex);
    const { completed } = req.body;
    
    if (isNaN(id) || isNaN(taskIndex)) {
      return res.status(400).json({ message: "Invalid parameters" });
    }
    
    if (typeof completed !== 'boolean') {
      return res.status(400).json({ message: "Invalid completed value" });
    }
    
    const updatedPlan = await storage.updateActionPlanTask(id, taskIndex, completed);
    if (!updatedPlan) {
      return res.status(404).json({ message: "Action plan or task not found" });
    }
    
    return res.json(updatedPlan);
  });
  
  // Chat message routes
  app.get("/api/users/:userId/chat-messages", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const messages = await storage.getChatMessages(userId, limit);
    return res.json(messages);
  });
  
  app.post("/api/chat-messages", async (req, res) => {
    try {
      const data = insertChatMessageSchema.parse(req.body);
      const message = await storage.createChatMessage(data);
      return res.status(201).json(message);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Assessment response routes
  app.get("/api/users/:userId/assessment-responses", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const responses = await storage.getAssessmentResponses(userId);
    return res.json(responses);
  });
  
  app.post("/api/assessment-responses", async (req, res) => {
    try {
      const data = insertAssessmentResponseSchema.parse(req.body);
      const response = await storage.createAssessmentResponse(data);
      return res.status(201).json(response);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // OpenAI API routes
  // Chat completion endpoint
  app.post("/api/chat/completions", async (req, res) => {
    try {
      const { userId, messages } = req.body;
      
      if (!userId || !Array.isArray(messages)) {
        return res.status(400).json({ message: "Invalid request format" });
      }
      
      const completion = await generateChatCompletion(messages);
      return res.json(completion);
    } catch (error) {
      console.error('Error in chat completion endpoint:', error);
      return res.status(500).json({ message: "Internal server error", error: String(error) });
    }
  });

  // Generate recommendations endpoint
  app.post("/api/generate/recommendations", async (req, res) => {
    try {
      const { userId, wellnessScores } = req.body;
      
      if (!userId || !wellnessScores) {
        return res.status(400).json({ message: "Invalid request format" });
      }
      
      const recommendations = await generateWellnessRecommendations(wellnessScores);
      
      // Save recommendations to database
      if (recommendations.recommendations) {
        for (const rec of recommendations.recommendations) {
          await storage.createRecommendation({
            userId,
            category: rec.category,
            title: rec.title,
            description: rec.description,
            isHSAEligible: rec.isHSAEligible,
            icon: rec.icon,
            tag: rec.tag
          });
        }
      }
      
      return res.json(recommendations);
    } catch (error) {
      console.error('Error in generate recommendations endpoint:', error);
      return res.status(500).json({ message: "Internal server error", error: String(error) });
    }
  });

  // Generate action plan endpoint
  app.post("/api/generate/action-plan", async (req, res) => {
    try {
      const { userId, recommendations, weekCount } = req.body;
      
      if (!userId || !Array.isArray(recommendations)) {
        return res.status(400).json({ message: "Invalid request format" });
      }
      
      const actionPlanData = await generateActionPlan(recommendations, weekCount || 4);
      
      // Save action plans to database
      if (actionPlanData.actionPlan) {
        for (const plan of actionPlanData.actionPlan) {
          await storage.createActionPlan({
            userId,
            weekNumber: plan.weekNumber,
            startDate: plan.startDate,
            endDate: plan.endDate,
            tasks: plan.tasks
          });
        }
      }
      
      return res.json(actionPlanData);
    } catch (error) {
      console.error('Error in generate action plan endpoint:', error);
      return res.status(500).json({ message: "Internal server error", error: String(error) });
    }
  });

  // Analyze wellness score endpoint
  app.post("/api/analyze/wellness-score", async (req, res) => {
    try {
      const { userId, assessmentResponses } = req.body;
      
      if (!userId || !Array.isArray(assessmentResponses)) {
        return res.status(400).json({ message: "Invalid request format" });
      }
      
      const wellnessScores = await analyzeWellnessScores(assessmentResponses);
      
      // Save wellness scores to database
      await storage.createWellnessScore({
        userId,
        physical: wellnessScores.physical,
        mental: wellnessScores.mental,
        sleep: wellnessScores.sleep,
        stress: wellnessScores.stress,
        nutrition: wellnessScores.nutrition,
        overallScore: wellnessScores.overallScore
      });
      
      return res.json(wellnessScores);
    } catch (error) {
      console.error('Error in analyze wellness score endpoint:', error);
      return res.status(500).json({ message: "Internal server error", error: String(error) });
    }
  });

  // Optimize HSA endpoint
  app.post("/api/optimize/hsa", async (req, res) => {
    try {
      const { userId, hsaInfo, wellnessScores } = req.body;
      
      if (!userId || !hsaInfo || !wellnessScores) {
        return res.status(400).json({ message: "Invalid request format" });
      }
      
      const optimization = await generateHsaOptimization(hsaInfo, wellnessScores);
      
      // Update HSA info with tax savings
      if (optimization.taxSavings) {
        await storage.createOrUpdateHsaInfo({
          userId,
          balance: hsaInfo.balance,
          annualLimit: hsaInfo.annualLimit,
          taxSavings: optimization.taxSavings
        });
      }
      
      return res.json(optimization);
    } catch (error) {
      console.error('Error in optimize HSA endpoint:', error);
      return res.status(500).json({ message: "Internal server error", error: String(error) });
    }
  });

  // Abby assistant response endpoint
  app.post("/api/abby/response", async (req, res) => {
    try {
      const { userId, messages } = req.body;
      
      if (!userId || !Array.isArray(messages)) {
        return res.status(400).json({ message: "Invalid request format" });
      }
      
      const response = await generateAbbyResponse(messages);
      
      // Save Abby's response as a chat message
      await storage.createChatMessage({
        userId,
        role: 'assistant',
        content: response.content
      });
      
      return res.json(response);
    } catch (error) {
      console.error('Error in Abby response endpoint:', error);
      return res.status(500).json({ message: "Internal server error", error: String(error) });
    }
  });

  // Sample Data Load API endpoint
  app.post("/api/sample-data/load", async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      // Create sample HSA info if it doesn't exist
      const hsaInfo = await storage.getHsaInfo(userId);
      if (!hsaInfo) {
        await storage.createOrUpdateHsaInfo({
          userId,
          balance: 1850,
          annualLimit: 3850,
          taxSavings: 450
        });
      }

      // Create sample wellness score
      const wellnessScore = {
        userId,
        physical: 82,
        mental: 68,
        sleep: 60,
        stress: 65,
        nutrition: 72,
        overallScore: 70
      };
      await storage.createWellnessScore(wellnessScore);

      // Create sample recommendations
      const recommendations = [
        {
          userId,
          category: "sleep",
          title: "Establish a consistent sleep schedule",
          description: "Go to bed and wake up at the same time each day, even on weekends, to regulate your body's internal clock.",
          isHSAEligible: false,
          icon: "bed",
          tag: "Habit Building"
        },
        {
          userId,
          category: "sleep",
          title: "Sleep consultation",
          description: "Consult with a sleep specialist to address ongoing sleep issues and develop a personalized sleep improvement plan.",
          isHSAEligible: true,
          icon: "bed",
          tag: "HSA Eligible"
        },
        {
          userId,
          category: "mental",
          title: "Mindfulness meditation practice",
          description: "Set aside 10-15 minutes daily for guided meditation using apps like Headspace or Calm to reduce stress and anxiety.",
          isHSAEligible: false,
          icon: "brain",
          tag: "Habit Building"
        },
        {
          userId,
          category: "mental",
          title: "Therapy sessions",
          description: "Schedule bi-weekly therapy sessions with a licensed mental health professional to improve your emotional well-being.",
          isHSAEligible: true,
          icon: "brain",
          tag: "HSA Eligible"
        },
        {
          userId,
          category: "physical",
          title: "Daily 30-minute walks",
          description: "Incorporate a 30-minute brisk walk into your daily routine to improve cardiovascular health and mood.",
          isHSAEligible: false,
          icon: "heart",
          tag: "Habit Building"
        },
        {
          userId,
          category: "physical",
          title: "Ergonomic assessment",
          description: "Get a professional evaluation of your work setup to prevent repetitive strain injuries and improve posture.",
          isHSAEligible: true,
          icon: "heart",
          tag: "HSA Eligible"
        },
        {
          userId,
          category: "nutrition",
          title: "Meal planning and preparation",
          description: "Set aside time each weekend to plan and prepare healthy meals for the week to avoid unhealthy food choices.",
          isHSAEligible: false,
          icon: "running",
          tag: "Habit Building"
        },
        {
          userId,
          category: "nutrition",
          title: "Nutritionist consultation",
          description: "Meet with a registered dietitian to create a personalized nutrition plan based on your health goals and dietary needs.",
          isHSAEligible: true,
          icon: "running",
          tag: "HSA Eligible"
        }
      ];

      for (const rec of recommendations) {
        await storage.createRecommendation(rec);
      }

      // Create sample action plans
      const today = new Date();
      const getWeekStartEnd = (weekOffset: number) => {
        const startDate = new Date(today);
        startDate.setDate(today.getDate() + weekOffset * 7);
        // Start date is Monday
        startDate.setDate(startDate.getDate() - startDate.getDay() + 1);
        
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6); // End date is Sunday
        
        return {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        };
      };

      const actionPlans = [
        {
          userId,
          weekNumber: 1,
          ...getWeekStartEnd(0),
          tasks: [
            { description: "Go to bed at the same time for 7 days straight", completed: true },
            { description: "Research sleep specialists covered by your insurance", completed: true },
            { description: "Download a meditation app and try a 5-minute session", completed: false },
            { description: "Take a 15-minute walk after lunch each day", completed: false },
            { description: "Create a grocery list with more fruits and vegetables", completed: true }
          ]
        },
        {
          userId,
          weekNumber: 2,
          ...getWeekStartEnd(1),
          tasks: [
            { description: "Schedule appointment with sleep specialist", completed: false },
            { description: "Increase meditation sessions to 10 minutes", completed: false },
            { description: "Research local therapists covered by HSA", completed: false },
            { description: "Extend daily walks to 20 minutes", completed: false },
            { description: "Prepare lunches for the work week in advance", completed: false }
          ]
        },
        {
          userId,
          weekNumber: 3,
          ...getWeekStartEnd(2),
          tasks: [
            { description: "Attend sleep specialist appointment", completed: false },
            { description: "Contact and schedule initial therapy session", completed: false },
            { description: "Try a guided meditation for stress reduction", completed: false },
            { description: "Schedule an ergonomic assessment of your workspace", completed: false },
            { description: "Increase daily water intake to 8 glasses", completed: false }
          ]
        },
        {
          userId,
          weekNumber: 4,
          ...getWeekStartEnd(3),
          tasks: [
            { description: "Start implementing sleep specialist recommendations", completed: false },
            { description: "Attend first therapy session", completed: false },
            { description: "Increase walks to 30 minutes and add light stretching", completed: false },
            { description: "Schedule nutritionist appointment", completed: false },
            { description: "Make workspace changes based on ergonomic assessment", completed: false }
          ]
        }
      ];

      for (const plan of actionPlans) {
        await storage.createActionPlan(plan);
      }

      // Add more sample chat messages for Abby
      const chatMessages = [
        {
          userId,
          role: "assistant",
          content: "I've analyzed your wellness assessment results. It looks like improving your sleep quality should be a priority. Would you like some specific recommendations for better sleep?"
        },
        {
          userId,
          role: "user",
          content: "Yes, what do you suggest for better sleep?"
        },
        {
          userId,
          role: "assistant",
          content: "Based on your assessment, here are three personalized sleep recommendations: 1) Establish a consistent sleep schedule by going to bed and waking up at the same time each day, 2) Reduce screen time at least 1 hour before bed, and 3) Consider consulting with a sleep specialist, which is an HSA-eligible expense. Would you like more details on any of these?"
        }
      ];

      for (const message of chatMessages) {
        await storage.createChatMessage(message);
      }

      // Create sample assessment responses
      const assessmentResponses = [
        { userId, questionId: "eating_habits", response: "Good", timestamp: new Date().toISOString() },
        { userId, questionId: "weight_management", response: "Good", timestamp: new Date().toISOString() },
        { userId, questionId: "work_stress", response: "Often", timestamp: new Date().toISOString() },
        { userId, questionId: "screens_bedtime", response: "Almost always", timestamp: new Date().toISOString() },
        { userId, questionId: "sleep_quality", response: "Fair", timestamp: new Date().toISOString() },
        { userId, questionId: "hsa_awareness", response: "Somewhat aware", timestamp: new Date().toISOString() },
        { userId, questionId: "hsa_barriers", response: "Lack of knowledge", timestamp: new Date().toISOString() },
        { userId, questionId: "chronic_conditions", response: "No", timestamp: new Date().toISOString() }
      ];

      for (const response of assessmentResponses) {
        await storage.createAssessmentResponse(response);
      }

      return res.json({ message: "Sample data loaded successfully" });
    } catch (error) {
      console.error("Error loading sample data:", error);
      return res.status(500).json({ message: "Error loading sample data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
