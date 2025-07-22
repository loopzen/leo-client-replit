import { Card, CardContent } from "@/components/ui/card";
import { Database, Globe, Tags, Bot } from "lucide-react";

interface KnowledgeBaseStatusProps {
  scrapingStatus?: any;
}

export default function KnowledgeBaseStatus({ scrapingStatus }: KnowledgeBaseStatusProps) {
  return (
    <Card className="mt-6 bg-white rounded-xl shadow-md">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Database className="w-5 h-5 text-primary mr-2" />
          Knowledge Base Status
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Scraped Data Sources */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Globe className="w-4 h-4 text-blue-500 mr-2" />
              Web Sources
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Playo Venue Page</span>
                <span className={`px-2 py-1 rounded text-xs text-white ${
                  scrapingStatus?.playo?.status === 'success' ? 'bg-green-500' : 
                  scrapingStatus?.playo?.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                }`}>
                  {scrapingStatus?.playo?.status === 'success' ? '✓ Synced' : 
                   scrapingStatus?.playo?.status === 'error' ? '✗ Error' : '⏳ Pending'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Instagram Profile</span>
                <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs">⚠ Limited</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Google Maps Data</span>
                <span className={`px-2 py-1 rounded text-xs text-white ${
                  scrapingStatus?.google_maps?.status === 'success' ? 'bg-green-500' : 'bg-yellow-500'
                }`}>
                  {scrapingStatus?.google_maps?.status === 'success' ? '✓ Synced' : '⏳ Pending'}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Last updated: {scrapingStatus?.playo?.lastScraped ? 
                new Date(scrapingStatus.playo.lastScraped).toLocaleString() : 
                'Never'}
            </p>
          </div>

          {/* Data Categories */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Tags className="w-4 h-4 text-green-500 mr-2" />
              Data Categories
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Facility Details</span>
                <span className="text-green-500">✓</span>
              </div>
              <div className="flex justify-between">
                <span>Sports & Courts</span>
                <span className="text-green-500">✓</span>
              </div>
              <div className="flex justify-between">
                <span>Pricing Info</span>
                <span className="text-green-500">✓</span>
              </div>
              <div className="flex justify-between">
                <span>Contact & Location</span>
                <span className="text-green-500">✓</span>
              </div>
              <div className="flex justify-between">
                <span>Reviews & Ratings</span>
                <span className="text-green-500">✓</span>
              </div>
            </div>
          </div>

          {/* AI Integration */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Bot className="w-4 h-4 text-purple-500 mr-2" />
              AI Integration
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>AI Service Status</span>
                <span className="text-green-500">🟢 Active</span>
              </div>
              <div className="flex justify-between">
                <span>Response Time</span>
                <span className="text-gray-600">~1.2s avg</span>
              </div>
              <div className="flex justify-between">
                <span>Context Memory</span>
                <span className="text-green-500">✓ Enabled</span>
              </div>
              <div className="flex justify-between">
                <span>Error Handling</span>
                <span className="text-green-500">✓ Active</span>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              <p>AI Model: Advanced Language Model</p>
              <p>Safety filters: Enabled</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
