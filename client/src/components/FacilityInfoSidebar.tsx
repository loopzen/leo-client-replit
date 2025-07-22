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


          </div>
        </CardContent>
      </Card>

      {/* Enhanced Contact Information Card */}
      <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50">
        <CardContent className="p-6">
          <h4 className="font-bold text-gray-900 mb-5 text-lg flex items-center">
            <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center mr-3">
              <Phone className="w-3 h-3 text-white" />
            </div>
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Get In Touch</span>
          </h4>
          
          <div className="space-y-4">
            {/* Phone Number */}
            <a 
              href={`tel:${data.basicInfo?.phone}`}
              className="flex items-center bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 hover:from-green-100 hover:to-green-200 hover:border-green-300 transition-all duration-200 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-green-700 text-lg">{data.basicInfo?.phone}</div>
                <div className="text-sm text-green-600">Call us now</div>
              </div>
            </a>

            {/* Address */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-blue-700 mb-2">Visit Us</div>
                  <div className="text-sm text-blue-600 leading-relaxed">{data.basicInfo?.address}</div>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-purple-700 mb-1">Operating Hours</div>
                  <div className="text-sm text-purple-600">{data.basicInfo?.timing} (Daily)</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
