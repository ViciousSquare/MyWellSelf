import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { AssessmentQuestion, ChatMessage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ChatBubble } from "@/components/ui/chat-bubble";
import { MessageSquare, Send } from "lucide-react";

// Sample assessment questions
const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'eating_habits',
    text: 'How would you rate your eating habits these days?',
    type: 'likert',
    options: ['Excellent', 'Very good', 'Good', 'Fair', 'Not good at all']
  },
  {
    id: 'weight_management',
    text: 'How do you manage your weight?',
    type: 'likert',
    options: ['Excellent', 'Very good', 'Good', 'Fair', 'Not good at all']
  },
  {
    id: 'work_stress',
    text: 'How often do you feel overwhelmed at work?',
    type: 'likert',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Almost always']
  },
  {
    id: 'screens_bedtime',
    text: 'Do you use screens within an hour of bedtime?',
    type: 'likert',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Almost always']
  },
  {
    id: 'sleep_quality',
    text: 'How would you rate your sleep quality?',
    type: 'likert',
    options: ['Excellent', 'Very good', 'Good', 'Fair', 'Poor']
  },
  {
    id: 'hsa_awareness',
    text: 'Are you aware of your HSA balance and coverage?',
    type: 'likert',
    options: ['Very aware', 'Somewhat aware', 'Neutral', 'Somewhat unaware', 'Not aware at all']
  },
  {
    id: 'hsa_barriers',
    text: 'What obstacles have prevented you from using your HSA fully?',
    type: 'multiple_choice',
    options: ['Lack of knowledge', 'Complicated process', 'Forgot about it', 'No immediate health needs', 'Other']
  },
  {
    id: 'chronic_conditions',
    text: 'Do you have any chronic conditions (e.g., diabetes, hypertension)?',
    type: 'boolean',
    options: ['Yes', 'No']
  }
];

interface WellnessAssessmentProps {
  userId: number;
}

export default function WellnessAssessment({ userId }: WellnessAssessmentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [textInput, setTextInput] = useState("");
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const currentQuestion = ASSESSMENT_QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / ASSESSMENT_QUESTIONS.length) * 100;
  
  const { data: chatMessages = [], isLoading } = useQuery<ChatMessage[]>({
    queryKey: [`/api/users/${userId}/assessment-messages`],
  });
  
  // Simulate Abby's messages for assessment
  const messages: ChatMessage[] = [
    ...chatMessages,
    {
      id: -1, // Temporary ID
      userId,
      role: 'assistant',
      content: currentQuestion ? currentQuestion.text : 'Thank you for completing the assessment!',
      timestamp: new Date().toISOString()
    }
  ];
  
  const saveResponseMutation = useMutation({
    mutationFn: async (responseData: { questionId: string; response: string }) => {
      const response = await apiRequest("POST", "/api/assessment-responses", {
        userId,
        ...responseData
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/assessment-responses`] });
    },
  });
  
  const saveChatMessageMutation = useMutation({
    mutationFn: async (message: { role: 'user' | 'assistant'; content: string }) => {
      const response = await apiRequest("POST", "/api/chat-messages", {
        userId,
        ...message
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/assessment-messages`] });
    },
  });
  
  const completeAssessmentMutation = useMutation({
    mutationFn: async () => {
      // Get all responses for the user
      const assessmentResponsesData = await apiRequest("GET", `/api/users/${userId}/assessment-responses`);
      const assessmentResponses = await assessmentResponsesData.json();
      
      // Analyze the wellness scores with OpenAI
      const analysisResponse = await apiRequest("POST", "/api/analyze/wellness-score", {
        userId,
        assessmentResponses
      });
      
      const wellnessScores = await analysisResponse.json();
      
      // The API endpoint will save the wellness scores
      return wellnessScores;
    },
    onSuccess: (data) => {
      // Now generate recommendations based on the wellness scores
      generateRecommendationsMutation.mutate(data);
    },
    onError: (error) => {
      console.error("Error completing assessment:", error);
      // Fallback for demo if there's an error
      fallbackWellnessScoreMutation.mutate();
    }
  });
  
  // Fallback in case the OpenAI API fails
  const fallbackWellnessScoreMutation = useMutation({
    mutationFn: async () => {
      // Fallback hardcoded wellness scores
      const wellnessScore = {
        userId,
        physical: 75,
        mental: 68,
        sleep: 60,
        stress: 65,
        nutrition: 72,
        overallScore: 70
      };
      
      const response = await apiRequest("POST", "/api/wellness-scores", wellnessScore);
      return await response.json();
    },
    onSuccess: () => {
      // Redirect to dashboard to see results
      setLocation("/");
    },
  });
  
  // Generate recommendations based on wellness scores
  const generateRecommendationsMutation = useMutation({
    mutationFn: async (wellnessScores) => {
      const response = await apiRequest("POST", "/api/generate/recommendations", {
        userId,
        wellnessScores
      });
      return await response.json();
    },
    onSuccess: (data) => {
      // After generating recommendations, create an action plan
      generateActionPlanMutation.mutate(data.recommendations || []);
    },
    onError: () => {
      // On error, just redirect to dashboard
      setLocation("/");
    }
  });
  
  // Generate action plan based on recommendations
  const generateActionPlanMutation = useMutation({
    mutationFn: async (recommendations) => {
      const response = await apiRequest("POST", "/api/generate/action-plan", {
        userId,
        recommendations,
        weekCount: 4
      });
      return await response.json();
    },
    onSuccess: () => {
      // Finally redirect to dashboard to see results
      setLocation("/");
    },
    onError: () => {
      // On error, just redirect to dashboard
      setLocation("/");
    }
  });
  
  const handleResponseSelection = (response: string) => {
    if (!currentQuestion) return;
    
    // Save the response
    const newResponses = {
      ...responses, 
      [currentQuestion.id]: response
    };
    setResponses(newResponses);
    
    // Record the user's message
    saveChatMessageMutation.mutate({
      role: 'user',
      content: response
    });
    
    // Save to the backend
    saveResponseMutation.mutate({
      questionId: currentQuestion.id,
      response
    });
    
    // Move to next question or complete
    if (currentQuestionIndex < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Complete assessment
      completeAssessmentMutation.mutate();
    }
  };
  
  const handleTextSubmit = () => {
    if (textInput.trim() && currentQuestion) {
      handleResponseSelection(textInput);
      setTextInput("");
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit();
    }
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center text-accent-600">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-neutral-800">Chat with Abby</h3>
            <p className="text-sm text-neutral-600">Let's assess your current wellness</p>
          </div>
        </div>
        
        <div className="bg-neutral-50 rounded-lg p-4 h-96 overflow-y-auto flex flex-col">
          {messages.map((message, index) => (
            <ChatBubble key={`msg-${index}`} message={message} />
          ))}
          
          {currentQuestion && currentQuestion.options && (
            <div className="chat-bubble assistant bg-accent-100 text-neutral-800 p-3 self-start rounded-[18px] rounded-bl-[4px]">
              <div className="mt-3 flex flex-col space-y-2">
                {currentQuestion.options.map((option, idx) => (
                  <Button
                    key={`option-${idx}`}
                    variant="outline"
                    className="text-left justify-start h-auto py-2 px-3 bg-white hover:bg-accent-50 border-accent-200"
                    onClick={() => handleResponseSelection(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center mt-4">
          <Input
            type="text"
            placeholder="Type your response..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="rounded-r-none"
          />
          <Button 
            onClick={handleTextSubmit} 
            disabled={!textInput.trim()}
            className="rounded-l-none px-3"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="mt-6 flex justify-between items-center">
          <div>
            <span className="text-sm font-medium text-neutral-700">Progress</span>
            <span className="ml-2 text-sm text-neutral-500">
              {currentQuestionIndex + 1}/{ASSESSMENT_QUESTIONS.length} questions
            </span>
          </div>
          <div className="w-32">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
