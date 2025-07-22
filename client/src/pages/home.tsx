import { useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import FacilityInfoSidebar from "@/components/FacilityInfoSidebar";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random()}`);

  const { data: facilityData } = useQuery({
    queryKey: ['/api/facility'],
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  const { data: scrapingStatus } = useQuery({
    queryKey: ['/api/scraping-status'],
    refetchInterval: 30 * 1000, // Refresh every 30 seconds
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Modern Header with Gradient */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white shadow-2xl sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  FlowTernity Sports AI
                </h1>
                <p className="text-blue-100 text-sm font-medium">Your Intelligent Sports Assistant</p>
              </div>
            </div>
            
            {/* Modern Status Indicators */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1.5 backdrop-blur-sm border border-white/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                <span className="text-sm font-medium">AI Online</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1.5 backdrop-blur-sm border border-white/20">
                <div className={`w-2 h-2 rounded-full shadow-lg ${
                  scrapingStatus && (scrapingStatus as any).playo?.status === 'success' ? 'bg-green-400' : 
                  scrapingStatus && (scrapingStatus as any).playo?.status === 'error' ? 'bg-red-400' : 'bg-yellow-400'
                }`}></div>
                <span className="text-sm font-medium">Live Data</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 py-8">
        <div className="container mx-auto px-6">
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Welcome to FlowTernity Sports
            </h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Ask anything about our facilities, courts, pricing, and programs. Get instant answers powered by AI.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Enhanced Facility Info Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <FacilityInfoSidebar facilityData={facilityData} scrapingStatus={scrapingStatus} />
          </div>

          {/* Enhanced Chat Interface */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <ChatInterface sessionId={sessionId} />
          </div>

        </div>
      </div>
    </div>
  );
}
