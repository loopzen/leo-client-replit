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
    <div className="space-y-4">
      <Card className="bg-white rounded-xl shadow-md sticky top-24">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <div className="w-5 h-5 text-primary mr-2">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            Facility Info
          </h3>
          
          {/* Facility Overview */}
          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-medium text-gray-900">{data.basicInfo?.name}</h4>
              <p className="text-sm text-gray-600">{data.basicInfo?.location}</p>
              <div className="flex items-center mt-1">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-1">
                  {data.basicInfo?.rating?.toFixed(1)} ({data.basicInfo?.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-primary">6 AM</div>
                <div className="text-xs text-gray-600">Opens</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-primary">11 PM</div>
                <div className="text-xs text-gray-600">Closes</div>
              </div>
            </div>

            {/* Sports Available */}
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Sports Available</h5>
              <div className="flex flex-wrap gap-2">
                {data.sports?.map((sport: string, index: number) => (
                  <span 
                    key={index}
                    className="bg-primary/10 text-primary px-2 py-1 rounded text-xs"
                  >
                    {sport}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="pt-4 border-t border-gray-200">
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-gray-400 mr-2" />
                  <span>{data.basicInfo?.phone}</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-xs">{data.basicInfo?.address}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Sources Status */}
      <Card className="bg-white rounded-xl shadow-md">
        <CardContent className="p-4">
          <h4 className="font-medium text-gray-900 mb-3 text-sm">Data Sources</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span>Playo Venue</span>
              <span className={`px-2 py-1 rounded text-white ${
                scrapingStatus?.playo?.status === 'success' ? 'bg-green-500' : 
                scrapingStatus?.playo?.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
              }`}>
                {scrapingStatus?.playo?.status === 'success' ? 'Synced' : 
                 scrapingStatus?.playo?.status === 'error' ? 'Error' : 'Pending'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Instagram</span>
              <span className={`px-2 py-1 rounded text-white ${
                scrapingStatus?.instagram?.status === 'success' ? 'bg-orange-500' : 'bg-yellow-500'
              }`}>
                Partial
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Google Maps</span>
              <span className={`px-2 py-1 rounded text-white ${
                scrapingStatus?.google_maps?.status === 'success' ? 'bg-green-500' : 'bg-yellow-500'
              }`}>
                {scrapingStatus?.google_maps?.status === 'success' ? 'Synced' : 'Pending'}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Last updated: {scrapingStatus?.playo?.lastScraped ? 
              new Date(scrapingStatus.playo.lastScraped).toLocaleTimeString() : 
              'Never'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
