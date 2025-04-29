import {
  users,
  wellnessScores,
  hsaInfo,
  recommendations,
  actionPlans,
  chatMessages,
  assessmentResponses,
  type User,
  type InsertUser,
  type WellnessScore,
  type InsertWellnessScore,
  type HsaInfo,
  type InsertHsaInfo,
  type Recommendation,
  type InsertRecommendation,
  type ActionPlan,
  type InsertActionPlan,
  type ChatMessage,
  type InsertChatMessage,
  type AssessmentResponse,
  type InsertAssessmentResponse
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Wellness score methods
  getWellnessScores(userId: number): Promise<WellnessScore[]>;
  getLatestWellnessScore(userId: number): Promise<WellnessScore | undefined>;
  createWellnessScore(score: InsertWellnessScore): Promise<WellnessScore>;
  
  // HSA info methods
  getHsaInfo(userId: number): Promise<HsaInfo | undefined>;
  createOrUpdateHsaInfo(hsaInfo: InsertHsaInfo): Promise<HsaInfo>;
  
  // Recommendation methods
  getRecommendations(userId: number): Promise<Recommendation[]>;
  createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation>;
  
  // Action plan methods
  getActionPlans(userId: number): Promise<ActionPlan[]>;
  createActionPlan(actionPlan: InsertActionPlan): Promise<ActionPlan>;
  updateActionPlanTask(actionPlanId: number, taskIndex: number, completed: boolean): Promise<ActionPlan | undefined>;
  
  // Chat message methods
  getChatMessages(userId: number, limit?: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Assessment response methods
  getAssessmentResponses(userId: number): Promise<AssessmentResponse[]>;
  createAssessmentResponse(response: InsertAssessmentResponse): Promise<AssessmentResponse>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private wellnessScores: Map<number, WellnessScore[]>;
  private hsaInfos: Map<number, HsaInfo>;
  private recommendations: Map<number, Recommendation[]>;
  private actionPlans: Map<number, ActionPlan[]>;
  private chatMessages: Map<number, ChatMessage[]>;
  private assessmentResponses: Map<number, AssessmentResponse[]>;
  
  private userId: number;
  private wellnessScoreId: number;
  private hsaInfoId: number;
  private recommendationId: number;
  private actionPlanId: number;
  private chatMessageId: number;
  private assessmentResponseId: number;

  constructor() {
    this.users = new Map();
    this.wellnessScores = new Map();
    this.hsaInfos = new Map();
    this.recommendations = new Map();
    this.actionPlans = new Map();
    this.chatMessages = new Map();
    this.assessmentResponses = new Map();
    
    this.userId = 1;
    this.wellnessScoreId = 1;
    this.hsaInfoId = 1;
    this.recommendationId = 1;
    this.actionPlanId = 1;
    this.chatMessageId = 1;
    this.assessmentResponseId = 1;
    
    // Initialize with demo data
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Create a demo user
    const demoUser: InsertUser = {
      username: "john.smith",
      password: "password123",
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@example.com"
    };
    const user = this.createUser(demoUser);
    
    // Create demo wellness score
    const demoScore: InsertWellnessScore = {
      userId: user.id,
      physical: 78,
      mental: 65,
      sleep: 72,
      stress: 59,
      nutrition: 70,
      overallScore: 72
    };
    this.createWellnessScore(demoScore);
    
    // Create demo HSA info
    const demoHsaInfo: InsertHsaInfo = {
      userId: user.id,
      balance: 2450,
      annualLimit: 3850,
      taxSavings: 625
    };
    this.createOrUpdateHsaInfo(demoHsaInfo);
    
    // Create demo recommendations
    const demoRecommendations: InsertRecommendation[] = [
      {
        userId: user.id,
        category: "mental",
        title: "Improve Mental Wellness",
        description: "Try mindfulness meditation for 10 minutes daily.",
        isHSAEligible: true,
        tag: "HSA Eligible",
        icon: "brain"
      },
      {
        userId: user.id,
        category: "sleep",
        title: "Sleep Better",
        description: "Reduce screen time 1 hour before bed.",
        isHSAEligible: false,
        tag: "Habit Building",
        icon: "bed"
      },
      {
        userId: user.id,
        category: "stress",
        title: "Stress Management",
        description: "Consider therapy sessions to manage work stress.",
        isHSAEligible: true,
        tag: "HSA Eligible",
        icon: "heart"
      },
      {
        userId: user.id,
        category: "physical",
        title: "Physical Activity",
        description: "Join a fitness program or personal training.",
        isHSAEligible: true,
        tag: "HSA Eligible",
        icon: "running"
      }
    ];
    
    demoRecommendations.forEach(rec => this.createRecommendation(rec));
    
    // Create demo action plans
    const now = new Date();
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
    
    const demoActionPlans: InsertActionPlan[] = [
      {
        userId: user.id,
        weekNumber: 1,
        startDate: new Date(),
        endDate: new Date(now.getTime() + oneWeekMs),
        tasks: [
          { 
            id: 1, 
            description: "10 min meditation daily",
            completed: true
          },
          { 
            id: 2, 
            description: "Schedule sleep consultation",
            completed: true
          },
          { 
            id: 3, 
            description: "Review HSA-eligible services",
            completed: false
          }
        ]
      },
      {
        userId: user.id,
        weekNumber: 2,
        startDate: new Date(now.getTime() + oneWeekMs),
        endDate: new Date(now.getTime() + 2 * oneWeekMs),
        tasks: [
          { 
            id: 1, 
            description: "Begin stress management program",
            completed: false
          },
          { 
            id: 2, 
            description: "Try new sleep routine for 7 days",
            completed: false
          },
          { 
            id: 3, 
            description: "Book first fitness session",
            completed: false
          }
        ]
      },
      {
        userId: user.id,
        weekNumber: 3,
        startDate: new Date(now.getTime() + 2 * oneWeekMs),
        endDate: new Date(now.getTime() + 3 * oneWeekMs),
        tasks: [
          { 
            id: 1, 
            description: "Evaluate sleep progress",
            completed: false
          },
          { 
            id: 2, 
            description: "Continue meditation practice",
            completed: false
          },
          { 
            id: 3, 
            description: "Implement nutritionist recommendations",
            completed: false
          }
        ]
      },
      {
        userId: user.id,
        weekNumber: 4,
        startDate: new Date(now.getTime() + 3 * oneWeekMs),
        endDate: new Date(now.getTime() + 4 * oneWeekMs),
        tasks: [
          { 
            id: 1, 
            description: "Schedule follow-up wellness check",
            completed: false
          },
          { 
            id: 2, 
            description: "Review overall progress",
            completed: false
          },
          { 
            id: 3, 
            description: "Plan next month's HSA spending",
            completed: false
          }
        ]
      }
    ];
    
    demoActionPlans.forEach(plan => this.createActionPlan(plan));
    
    // Create demo chat messages
    const demoChatMessages: InsertChatMessage[] = [
      {
        userId: user.id,
        role: "assistant",
        content: "Hi John! I noticed you've been making progress on your sleep goals. How has reducing screen time before bed been working for you?"
      },
      {
        userId: user.id,
        role: "user",
        content: "It's been helping! I'm falling asleep faster but still wake up during the night."
      },
      {
        userId: user.id,
        role: "assistant",
        content: "That's great progress! For the night waking, have you considered using your HSA funds for a sleep consultation? Many sleep therapists are HSA-eligible."
      },
      {
        userId: user.id,
        role: "user",
        content: "I didn't know that was covered. How much would it cost?"
      },
      {
        userId: user.id,
        role: "assistant",
        content: "Typically, a sleep consultation ranges from $150-300, fully covered by your HSA. I can help you find providers in your network if you'd like!"
      }
    ];
    
    demoChatMessages.forEach(msg => this.createChatMessage(msg));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }
  
  // Wellness score methods
  async getWellnessScores(userId: number): Promise<WellnessScore[]> {
    return this.wellnessScores.get(userId) || [];
  }
  
  async getLatestWellnessScore(userId: number): Promise<WellnessScore | undefined> {
    const scores = this.wellnessScores.get(userId) || [];
    if (scores.length === 0) return undefined;
    
    // Sort by date descending and return the most recent
    return scores.sort((a, b) => {
      return new Date(b.assessmentDate).getTime() - new Date(a.assessmentDate).getTime();
    })[0];
  }
  
  async createWellnessScore(score: InsertWellnessScore): Promise<WellnessScore> {
    const id = this.wellnessScoreId++;
    const now = new Date();
    const wellnessScore: WellnessScore = { ...score, id, assessmentDate: now };
    
    const userScores = this.wellnessScores.get(score.userId) || [];
    userScores.push(wellnessScore);
    this.wellnessScores.set(score.userId, userScores);
    
    return wellnessScore;
  }
  
  // HSA info methods
  async getHsaInfo(userId: number): Promise<HsaInfo | undefined> {
    return this.hsaInfos.get(userId);
  }
  
  async createOrUpdateHsaInfo(info: InsertHsaInfo): Promise<HsaInfo> {
    const existing = this.hsaInfos.get(info.userId);
    
    if (existing) {
      const updated: HsaInfo = { ...existing, ...info };
      this.hsaInfos.set(info.userId, updated);
      return updated;
    } else {
      const id = this.hsaInfoId++;
      const hsaInfo: HsaInfo = { ...info, id };
      this.hsaInfos.set(info.userId, hsaInfo);
      return hsaInfo;
    }
  }
  
  // Recommendation methods
  async getRecommendations(userId: number): Promise<Recommendation[]> {
    return this.recommendations.get(userId) || [];
  }
  
  async createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation> {
    const id = this.recommendationId++;
    const newRec: Recommendation = { ...recommendation, id };
    
    const userRecs = this.recommendations.get(recommendation.userId) || [];
    userRecs.push(newRec);
    this.recommendations.set(recommendation.userId, userRecs);
    
    return newRec;
  }
  
  // Action plan methods
  async getActionPlans(userId: number): Promise<ActionPlan[]> {
    return this.actionPlans.get(userId) || [];
  }
  
  async createActionPlan(actionPlan: InsertActionPlan): Promise<ActionPlan> {
    const id = this.actionPlanId++;
    const newPlan: ActionPlan = { ...actionPlan, id };
    
    const userPlans = this.actionPlans.get(actionPlan.userId) || [];
    userPlans.push(newPlan);
    this.actionPlans.set(actionPlan.userId, userPlans);
    
    return newPlan;
  }
  
  async updateActionPlanTask(actionPlanId: number, taskIndex: number, completed: boolean): Promise<ActionPlan | undefined> {
    // Find the action plan across all users
    let foundPlan: ActionPlan | undefined = undefined;
    let userId: number | undefined = undefined;
    
    for (const [uId, plans] of this.actionPlans.entries()) {
      const plan = plans.find(p => p.id === actionPlanId);
      if (plan) {
        foundPlan = plan;
        userId = uId;
        break;
      }
    }
    
    if (!foundPlan || userId === undefined) return undefined;
    
    // Update the task
    const tasks = [...foundPlan.tasks];
    if (taskIndex >= 0 && taskIndex < tasks.length) {
      tasks[taskIndex] = { ...tasks[taskIndex], completed };
    }
    
    // Create updated plan
    const updatedPlan: ActionPlan = { ...foundPlan, tasks };
    
    // Replace the plan in the storage
    const userPlans = this.actionPlans.get(userId) || [];
    const updatedPlans = userPlans.map(p => p.id === actionPlanId ? updatedPlan : p);
    this.actionPlans.set(userId, updatedPlans);
    
    return updatedPlan;
  }
  
  // Chat message methods
  async getChatMessages(userId: number, limit?: number): Promise<ChatMessage[]> {
    const messages = this.chatMessages.get(userId) || [];
    
    // Sort by timestamp
    const sortedMessages = messages.sort((a, b) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
    
    return limit ? sortedMessages.slice(-limit) : sortedMessages;
  }
  
  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = this.chatMessageId++;
    const now = new Date();
    const chatMessage: ChatMessage = { ...message, id, timestamp: now };
    
    const userMessages = this.chatMessages.get(message.userId) || [];
    userMessages.push(chatMessage);
    this.chatMessages.set(message.userId, userMessages);
    
    return chatMessage;
  }
  
  // Assessment response methods
  async getAssessmentResponses(userId: number): Promise<AssessmentResponse[]> {
    return this.assessmentResponses.get(userId) || [];
  }
  
  async createAssessmentResponse(response: InsertAssessmentResponse): Promise<AssessmentResponse> {
    const id = this.assessmentResponseId++;
    const now = new Date();
    const assessmentResponse: AssessmentResponse = { ...response, id, timestamp: now };
    
    const userResponses = this.assessmentResponses.get(response.userId) || [];
    userResponses.push(assessmentResponse);
    this.assessmentResponses.set(response.userId, userResponses);
    
    return assessmentResponse;
  }
}

export const storage = new MemStorage();
