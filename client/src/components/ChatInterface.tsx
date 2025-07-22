import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, Trash2, Download } from "lucide-react";

interface ChatMessage {
  id: string;
  message: string;
  response: string;
  isError: boolean;
  timestamp: Date;
  isUser?: boolean;
}

interface ChatInterfaceProps {
  sessionId: string;
}

export default function ChatInterface({ sessionId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversationHistory } = useQuery({
    queryKey: ['/api/conversations', sessionId],
    enabled: !!sessionId,
  });

  const sendMessage = useMutation({
    mutationFn: async ({ message, sessionId }: { message: string; sessionId: string }) => {
      const response = await apiRequest("POST", "/api/chat", { message, sessionId });
      return await response.json();
    },
    onSuccess: (data, variables) => {
      const newMessage: ChatMessage = {
        id: `${Date.now()}_${Math.random()}`,
        message: variables.message,
        response: data.response,
        isError: !data.success,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      setIsLoading(false);
    },
    onError: (error) => {
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        message: inputValue,
        response: "I apologize, but I'm experiencing technical difficulties. Please try again or contact FlowTernity Sports directly at +91 8123999768.",
        isError: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (conversationHistory && Array.isArray(conversationHistory)) {
      const formattedHistory = conversationHistory.map((conv: any) => ({
        id: conv.id.toString(),
        message: conv.message,
        response: conv.response,
        isError: conv.isError,
        timestamp: new Date(conv.timestamp)
      }));
      setMessages(formattedHistory);
    }
  }, [conversationHistory]);

  const handleSendMessage = () => {
    const message = inputValue.trim();
    if (!message || isLoading) return;

    setInputValue("");
    setIsLoading(true);
    sendMessage.mutate({ message, sessionId });
  };

  const handleQuickAction = (query: string) => {
    setInputValue(query);
    setIsLoading(true);
    sendMessage.mutate({ message: query, sessionId });
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <Card className="bg-white rounded-xl shadow-md flex flex-col h-[600px]">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">FlowTernity Assistant</h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs text-gray-500">Online</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearChat}
            className="text-gray-400 hover:text-gray-600"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-400 hover:text-gray-600"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        
        {/* Welcome Message */}
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-4 max-w-xs lg:max-w-md">
            <p className="text-sm text-gray-800">👋 Welcome to FlowTernity Sports! I'm your AI assistant. I can help you with:</p>
            <ul className="text-sm text-gray-700 mt-2 space-y-1">
              <li>• Facility information & amenities</li>
              <li>• Court booking & pricing</li>
              <li>• Sports programs & coaching</li>
              <li>• Location & contact details</li>
            </ul>
            <p className="text-sm text-gray-600 mt-2">Ask me anything about our sports facility!</p>
          </div>
        </div>

        {/* Chat Messages */}
        {messages.map((message) => (
          <div key={message.id}>
            {/* User Message */}
            <div className="flex items-start space-x-3 justify-end mb-4">
              <div className="bg-primary rounded-2xl rounded-tr-sm p-4 max-w-xs lg:max-w-md">
                <p className="text-sm text-white">{message.message}</p>
              </div>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            </div>

            {/* Bot Response */}
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className={`rounded-2xl rounded-tl-sm p-4 max-w-xs lg:max-w-md ${
                message.isError ? 'bg-red-50 border border-red-200' : 'bg-gray-100'
              }`}>
                <div className="text-sm text-gray-800 whitespace-pre-wrap">{message.response}</div>
                {message.isError && (
                  <p className="text-xs text-red-500 mt-2">⚠ There was an issue processing your request</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Loading Message */}
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-4">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-3 border-t border-gray-200">
        <div className="flex flex-wrap gap-2 mb-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleQuickAction("What are your court timings and availability?")}
            className="bg-blue-50 text-primary border-blue-200 hover:bg-blue-100"
          >
            Court Availability
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleQuickAction("What are your pricing details for different sports?")}
            className="bg-blue-50 text-primary border-blue-200 hover:bg-blue-100"
          >
            Pricing Details
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleQuickAction("Tell me about your coaching programs and schedules")}
            className="bg-blue-50 text-primary border-blue-200 hover:bg-blue-100"
          >
            Coaching Programs
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleQuickAction("How do I get to FlowTernity Sports and what's the address?")}
            className="bg-blue-50 text-primary border-blue-200 hover:bg-blue-100"
          >
            Location & Directions
          </Button>
        </div>
      </div>

      {/* Message Input */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Ask about courts, pricing, timings, coaching..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="pr-10 rounded-full"
              disabled={isLoading}
            />
          </div>
          <Button 
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            size="sm"
            className="bg-primary hover:bg-primary/90 rounded-full min-w-[48px] h-12"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {/* API Status */}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
              Secure AI Assistant
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
              Live data sync
            </span>
          </div>
          <div className="text-right">
            <span>FlowTernity Sports AI</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
