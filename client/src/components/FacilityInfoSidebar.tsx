import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Clock, Star } from "lucide-react";

interface FacilityInfoSidebarProps {
  facilityData?: any;
  scrapingStatus?: any;
}

export default function FacilityInfoSidebar({ facilityData, scrapingStatus }: FacilityInfoSidebarProps) {
  const defaultData = {
    basicInfo: {
      name: 'FlowTernity Sports',
      location: 'Horamavu, Bengaluru',
      address: '1456, Old Flour Mill road Dodda Kempaih Layout, Kalkere, Horamavu, Bengaluru, Karnataka 560043',
      phone: '+91 8123999768',
      rating: 5.0,
      reviewCount: 5,
      timing: '6 AM - 11 PM'
    },
    sports: ['Basketball', 'Pickleball', 'Skating', 'Calisthenics']
  };

  const data = facilityData || defaultData;

  return (
    <div className="space-y-6">
      <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 sticky top-28">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-3 shadow-lg">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Facility Info</span>
          </h3>
          
          {/* Enhanced Facility Overview */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-5">
              <h4 className="font-bold text-gray-900 text-lg mb-2">{data.basicInfo?.name}</h4>
              <p className="text-sm text-gray-600 font-medium mb-3">{data.basicInfo?.location}</p>
              <div className="flex items-center">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  {data.basicInfo?.rating?.toFixed(1)} ({data.basicInfo?.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Enhanced Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-4 text-center shadow-sm">
                <div className="text-xl font-bold text-green-700 mb-1">6 AM</div>
                <div className="text-xs text-green-600 font-medium">Opens</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-4 text-center shadow-sm">
                <div className="text-xl font-bold text-orange-700 mb-1">11 PM</div>
                <div className="text-xs text-orange-600 font-medium">Closes</div>
              </div>
            </div>

            {/* Enhanced Sports Available */}
            <div>
              <h5 className="font-bold text-gray-900 mb-4 text-lg">Sports Available</h5>
              <div className="grid grid-cols-2 gap-3">
                {data.sports?.map((sport: string, index: number) => (
                  <div 
                    key={index}
                    className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 text-purple-700 px-3 py-2 rounded-xl text-sm font-medium text-center shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105"
                  >
                    {sport}
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Contact Info */}
            <div className="pt-6 border-t border-gradient-to-r from-gray-100 to-purple-100">
              <div className="space-y-4">
                <div className="flex items-center bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-blue-700">{data.basicInfo?.phone}</span>
                </div>
                <div className="flex items-start bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-700 leading-relaxed">{data.basicInfo?.address}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Data Sources Status */}
      <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50">
        <CardContent className="p-6">
          <h4 className="font-bold text-gray-900 mb-5 text-lg flex items-center">
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Data Sources</span>
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-3">
              <span className="font-medium text-gray-700">Playo Venue</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                scrapingStatus?.playo?.status === 'success' ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 border border-green-300' : 
                scrapingStatus?.playo?.status === 'error' ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-700 border border-red-300' : 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 border border-yellow-300'
              }`}>
                {scrapingStatus?.playo?.status === 'success' ? '✓ Synced' : 
                 scrapingStatus?.playo?.status === 'error' ? '✗ Error' : '⏳ Pending'}
              </span>
            </div>
            <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-3">
              <span className="font-medium text-gray-700">Instagram</span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 border border-orange-300">
                📱 Partial
              </span>
            </div>
            <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-3">
              <span className="font-medium text-gray-700">Google Maps</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                scrapingStatus?.google_maps?.status === 'success' ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 border border-green-300' : 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 border border-yellow-300'
              }`}>
                {scrapingStatus?.google_maps?.status === 'success' ? '✓ Synced' : '⏳ Pending'}
              </span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl p-3 mt-4">
            <p className="text-xs text-gray-600 font-medium">
              🕒 Last updated: {scrapingStatus?.playo?.lastScraped ? 
                new Date(scrapingStatus.playo.lastScraped).toLocaleTimeString() : 
                'Never'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
