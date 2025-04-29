import { cn } from "@/lib/utils";
import { ChatMessage } from "@/lib/types";

interface ChatBubbleProps {
  message: ChatMessage;
  className?: string;
}

export function ChatBubble({ message, className }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  
  return (
    <div
      className={cn(
        "chat-bubble p-3 mb-3 max-w-[85%]",
        isUser 
          ? "user bg-primary-500 text-white self-end rounded-[18px] rounded-br-[4px]" 
          : "assistant bg-accent-100 text-neutral-800 self-start rounded-[18px] rounded-bl-[4px]",
        className
      )}
    >
      <p className="text-sm">{message.content}</p>
    </div>
  );
}
