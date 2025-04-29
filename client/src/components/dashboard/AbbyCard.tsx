import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatMessage } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatBubble } from "@/components/ui/chat-bubble";
import { Send } from "lucide-react";

interface AbbyCardProps {
  userId: number;
}

export default function AbbyCard({ userId }: AbbyCardProps) {
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const { data: chatMessages = [], isLoading } = useQuery<ChatMessage[]>({
    queryKey: [`/api/users/${userId}/chat-messages`],
  });

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const sendMessageMutation = useMutation({
    mutationFn: async (newMessage: string) => {
      const response = await apiRequest("POST", "/api/chat-messages", {
        userId,
        role: "user",
        content: newMessage,
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/chat-messages`] });
      setMessage("");
      // Show typing indicator before Abby responds
      setIsTyping(true);
      // Trigger the assistant response
      setTimeout(() => {
        abbyResponseMutation.mutate();
      }, 1000);
    },
  });

  const abbyResponseMutation = useMutation({
    mutationFn: async () => {
      // Get the last 10 messages to provide as context
      const recentMessages = chatMessages.slice(-10);
      
      // Call the Abby API endpoint that uses OpenAI
      const response = await apiRequest("POST", "/api/abby/response", {
        userId,
        messages: recentMessages,
      });
      return await response.json();
    },
    onSuccess: () => {
      setIsTyping(false);
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/chat-messages`] });
    },
    onError: () => {
      setIsTyping(false);
      // Fallback in case of API error
      fallbackResponseMutation.mutate();
    }
  });

  // Fallback mutation in case the OpenAI API fails
  const fallbackResponseMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/chat-messages", {
        userId,
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try asking me again in a moment.",
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/chat-messages`] });
    },
  });

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessageMutation.mutate(message);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Add a welcome message if the chat is empty
  useEffect(() => {
    if (chatMessages.length === 0 && !isLoading) {
      const addWelcomeMessage = async () => {
        await apiRequest("POST", "/api/chat-messages", {
          userId,
          role: "assistant",
          content: "Hi there! I'm Abby, your wellness assistant. I can help you with wellness advice, answer questions about your HSA, and guide you through your wellness journey. How can I help you today?",
        });
        queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/chat-messages`] });
      };
      
      addWelcomeMessage();
    }
  }, [chatMessages, isLoading, userId, queryClient]);

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-5 bg-neutral-200 rounded w-1/3"></div>
            <div className="w-2 h-2 bg-neutral-200 rounded-full"></div>
          </div>
          <div className="h-64 bg-neutral-200 rounded mb-4"></div>
          <div className="flex items-center">
            <div className="flex-grow h-10 bg-neutral-200 rounded-l"></div>
            <div className="h-10 w-10 bg-neutral-200 rounded-r"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-800 font-heading">Abby, Your Wellness Assistant</h2>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
        
        <div
          className="bg-neutral-50 rounded-lg p-4 mb-4 h-64 overflow-y-auto flex flex-col"
          ref={chatContainerRef}
        >
          {chatMessages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="chat-bubble assistant bg-accent-100 text-neutral-800 p-3 self-start rounded-[18px] rounded-bl-[4px] max-w-[80%]">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-accent-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-accent-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-accent-600 rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="Ask Abby a question..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="rounded-r-none"
            disabled={isTyping}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!message.trim() || sendMessageMutation.isPending || isTyping}
            className="rounded-l-none px-3"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
