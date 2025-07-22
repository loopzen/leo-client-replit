import { storage } from '../storage';
import { facilityScraper, ScrapedFacilityData } from './scraper';

export interface FacilityInfo {
  basicInfo: {
    name: string;
    location: string;
    address: string;
    phone: string;
    rating: number;
    reviewCount: number;
    timing: string;
    coordinates?: { lat: number; lng: number };
  };
  sports: string[];
  pricing: Record<string, any>;
  amenities: string[];
  coaching: {
    available: boolean;
    schedule: string[];
    programs: string[];
  };
  images: string[];
  lastUpdated: Date;
}

export class FacilityDataService {
  async updateAllData(): Promise<void> {
    try {
      const scrapedData = await facilityScraper.scrapeAllSources();
      
      for (const [source, data] of Object.entries(scrapedData)) {
        await this.storeFacilityData(source, data);
      }

      // Update scraping status
      await storage.updateScrapingStatus('playo', 'success', null, Object.keys(scrapedData.playo || {}).length);
      await storage.updateScrapingStatus('instagram', 'success', null, Object.keys(scrapedData.instagram || {}).length);
      await storage.updateScrapingStatus('google_maps', 'success', null, Object.keys(scrapedData.google_maps || {}).length);
      
    } catch (error) {
      console.error('Error updating facility data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await storage.updateScrapingStatus('playo', 'error', errorMessage, 0);
    }
  }

  private async storeFacilityData(source: string, data: ScrapedFacilityData): Promise<void> {
    const dataTypes = [
      { type: 'basic_info', content: {
        name: data.name,
        location: data.location,
        address: data.address,
        phone: data.phone,
        rating: data.rating,
        reviewCount: data.reviewCount,
        timing: data.timing,
        coordinates: data.coordinates
      }},
      { type: 'sports', content: { sports: data.sports } },
      { type: 'pricing', content: data.pricing },
      { type: 'amenities', content: { amenities: data.amenities } },
      { type: 'images', content: { images: data.images } },
      { type: 'description', content: { description: data.description } }
    ];

    for (const { type, content } of dataTypes) {
      if (content && Object.keys(content).length > 0) {
        await storage.createFacilityData({
          source,
          dataType: type,
          content,
          isActive: true
        });
      }
    }
  }

  async getFacilityInfo(): Promise<FacilityInfo> {
    const allData = await storage.getAllFacilityData();
    
    const facilityInfo: FacilityInfo = {
      basicInfo: {
        name: 'FlowTernity Sports',
        location: 'Horamavu, Bengaluru',
        address: '1456, Old Flour Mill road Dodda Kempaih Layout, Kalkere, Horamavu, Bengaluru, Karnataka 560043',
        phone: '+91 8123999768',
        rating: 5.0,
        reviewCount: 5,
        timing: '6 AM - 11 PM',
        coordinates: { lat: 13.035433, lng: 77.670535 }
      },
      sports: ['Basketball', 'Pickleball', 'Skating', 'Calisthenics'],
      pricing: {
        basketball: '₹700 onwards per session',
        pickleball: '₹700 onwards per session'
      },
      amenities: ['Parking', '20-foot floodlights', '8-layer synthetic flooring', 'International standard courts'],
      coaching: {
        available: true,
        schedule: ['Weekends: 8-9 AM, 5-6 PM', 'Adults: Tue/Thu 7-8 PM'],
        programs: ['Basketball Training', 'Skating Classes', 'Calisthenics', 'Summer Camps']
      },
      images: [],
      lastUpdated: new Date()
    };

    // Merge with scraped data
    allData.forEach(item => {
      try {
        const content = item.content as any;
        switch (item.dataType) {
          case 'basic_info':
            Object.assign(facilityInfo.basicInfo, content);
            break;
          case 'sports':
            if (content.sports) facilityInfo.sports = Array.from(new Set([...facilityInfo.sports, ...content.sports]));
            break;
          case 'pricing':
            Object.assign(facilityInfo.pricing, content);
            break;
          case 'amenities':
            if (content.amenities) facilityInfo.amenities = Array.from(new Set([...facilityInfo.amenities, ...content.amenities]));
            break;
          case 'images':
            if (content.images) facilityInfo.images = Array.from(new Set([...facilityInfo.images, ...content.images]));
            break;
        }
      } catch (error) {
        console.error('Error processing facility data:', error);
      }
    });

    return facilityInfo;
  }

  async getScrapingStatuses(): Promise<Record<string, any>> {
    const statuses = await storage.getAllScrapingStatuses();
    const result: Record<string, any> = {};
    
    statuses.forEach(status => {
      result[status.source] = {
        lastScraped: status.lastScraped,
        status: status.status,
        errorMessage: status.errorMessage,
        dataCount: status.dataCount
      };
    });

    return result;
  }
}

export const facilityDataService = new FacilityDataService();
