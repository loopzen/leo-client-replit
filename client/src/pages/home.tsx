import { useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import FacilityInfoSidebar from "@/components/FacilityInfoSidebar";
import KnowledgeBaseStatus from "@/components/KnowledgeBaseStatus";
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
    <div className="font-sans bg-background min-h-screen">
      {/* Header */}
      <header className="bg-primary text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-medium">FlowTernity Sports AI</h1>
                <p className="text-blue-200 text-sm">Your Sports Facility Assistant</p>
              </div>
            </div>
            {/* Status Indicator */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">AI Assistant</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  scrapingStatus && (scrapingStatus as any).playo?.status === 'success' ? 'bg-green-400' : 
                  scrapingStatus && (scrapingStatus as any).playo?.status === 'error' ? 'bg-red-400' : 'bg-yellow-400'
                }`}></div>
                <span className="text-sm">Data Sync</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Facility Info Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <FacilityInfoSidebar facilityData={facilityData} scrapingStatus={scrapingStatus} />
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <ChatInterface sessionId={sessionId} />
          </div>

        </div>

        {/* Knowledge Base Status */}
        <KnowledgeBaseStatus scrapingStatus={scrapingStatus} />
      </div>
    </div>
  );
}
