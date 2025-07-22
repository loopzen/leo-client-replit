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
    <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 flex flex-col h-[600px]">
      {/* Modern Chat Header */}
      <div className="px-6 py-5 border-b border-gradient-to-r from-gray-100 to-purple-50 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">FlowTernity Assistant</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-sm"></div>
              <span className="text-sm text-gray-600 font-medium">Ready to help</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearChat}
            className="text-gray-400 hover:text-blue-600 transition-all duration-200 hover:bg-blue-50 rounded-xl"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-400 hover:text-blue-600 transition-all duration-200 hover:bg-blue-50 rounded-xl"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        
        {/* Enhanced Welcome Message */}
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-2xl rounded-tl-md p-5 max-w-xs lg:max-w-md shadow-sm">
            <p className="text-sm text-gray-800 font-medium">👋 Welcome to FlowTernity Sports! I'm your AI assistant. I can help you with:</p>
            <ul className="text-sm text-gray-700 mt-3 space-y-2">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Facility information & amenities</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span>Court booking & pricing</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Sports programs & coaching</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span>Location & contact details</span>
              </li>
            </ul>
            <p className="text-sm text-gray-600 mt-3 font-medium">Ask me anything about our sports facility!</p>
          </div>
        </div>

        {/* Chat Messages */}
        {messages.map((message) => (
          <div key={message.id}>
            {/* Enhanced User Message */}
            <div className="flex items-start space-x-4 justify-end mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl rounded-tr-md p-4 max-w-xs lg:max-w-md shadow-lg">
                <p className="text-sm text-white font-medium">{message.message}</p>
              </div>
              <div className="w-9 h-9 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            </div>

            {/* Enhanced Bot Response */}
            <div className="flex items-start space-x-4">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className={`rounded-2xl rounded-tl-md p-4 max-w-xs lg:max-w-md shadow-sm ${
                message.isError 
                  ? 'bg-gradient-to-br from-red-50 to-red-100 border border-red-200' 
                  : 'bg-gradient-to-br from-gray-50 to-white border border-gray-100'
              }`}>
                <div className="text-sm text-gray-800 whitespace-pre-wrap font-medium leading-relaxed">{message.response}</div>
                {message.isError && (
                  <p className="text-xs text-red-600 mt-2 font-medium">⚠ There was an issue processing your request</p>
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

      {/* Enhanced Quick Actions */}
      <div className="px-6 py-4 border-t border-gradient-to-r from-gray-100 to-purple-50 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
        <div className="flex flex-wrap gap-3 mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleQuickAction("What are your court timings and availability?")}
            className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200 hover:from-blue-100 hover:to-blue-200 hover:border-blue-300 rounded-xl shadow-sm transition-all duration-200 font-medium"
          >
            🏀 Court Availability
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleQuickAction("What are your pricing details for different sports?")}
            className="bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border-purple-200 hover:from-purple-100 hover:to-purple-200 hover:border-purple-300 rounded-xl shadow-sm transition-all duration-200 font-medium"
          >
            💰 Pricing Details
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleQuickAction("Tell me about your coaching programs and schedules")}
            className="bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-200 hover:from-green-100 hover:to-green-200 hover:border-green-300 rounded-xl shadow-sm transition-all duration-200 font-medium"
          >
            🏆 Coaching Programs
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleQuickAction("How do I get to FlowTernity Sports and what's the address?")}
            className="bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border-orange-200 hover:from-orange-100 hover:to-orange-200 hover:border-orange-300 rounded-xl shadow-sm transition-all duration-200 font-medium"
          >
            📍 Location & Directions
          </Button>
        </div>
      </div>

      {/* Enhanced Message Input */}
      <div className="px-6 py-6 border-t border-gradient-to-r from-gray-100 to-purple-50 bg-gradient-to-r from-blue-50/30 to-purple-50/30">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Ask about courts, pricing, timings, coaching..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="pr-12 rounded-2xl border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm h-12 text-gray-900 placeholder-gray-500 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={isLoading}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          <Button 
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            size="sm"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl min-w-[48px] h-12 shadow-lg transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        {/* Enhanced Status Bar */}
        <div className="flex items-center justify-between mt-4 text-xs">
          <div className="flex items-center space-x-4">
            <span className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-full">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></div>
              Secure AI Assistant
            </span>
            <span className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-1.5"></div>
              Live Data Sync
            </span>
          </div>
          <div className="text-right">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">FlowTernity Sports AI</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
