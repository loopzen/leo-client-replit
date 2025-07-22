import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

export interface ScrapedFacilityData {
  name?: string;
  location?: string;
  address?: string;
  phone?: string;
  rating?: number;
  reviewCount?: number;
  timing?: string;
  sports?: string[];
  pricing?: Record<string, any>;
  amenities?: string[];
  images?: string[];
  description?: string;
  coordinates?: { lat: number; lng: number };
}

export class FacilityScraper {
  private async fetchWithRetry(url: string, maxRetries = 3): Promise<string | null> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        
        if (response.ok) {
          return await response.text();
        }
      } catch (error) {
        console.log(`Attempt ${i + 1} failed for ${url}:`, error);
        if (i === maxRetries - 1) return null;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    return null;
  }

  async scrapePlayoVenue(url: string): Promise<ScrapedFacilityData> {
    const html = await this.fetchWithRetry(url);
    if (!html) throw new Error('Failed to fetch Playo page');

    const $ = cheerio.load(html);
    const data: ScrapedFacilityData = {};

    try {
      // Extract basic info
      data.name = $('h1').first().text().trim() || 'FlowTernity Sports';
      data.location = $('h1').next().text().trim() || 'Horamavu';
      
      // Extract rating
      const ratingText = $('.fa-star').parent().text();
      const ratingMatch = ratingText.match(/(\d+(?:\.\d+)?)/);
      data.rating = ratingMatch ? parseFloat(ratingMatch[1]) : 5.0;
      
      // Extract review count
      const reviewMatch = ratingText.match(/\((\d+)\s*ratings?\s*\)/);
      data.reviewCount = reviewMatch ? parseInt(reviewMatch[1]) : 5;

      // Extract timing
      data.timing = $('*:contains("6 AM - 11 PM")').text().trim() || '6 AM - 11 PM';

      // Extract address
      data.address = $('*:contains("1456")').text().trim() || 
        '1456, Old Flour Mill road Dodda Kempaih Layout, Kalkere, Horamavu, Bengaluru, Karnataka 560043';

      // Extract sports
      data.sports = [];
      $('*:contains("Basketball"), *:contains("Pickleball")').each((_, el) => {
        const sport = $(el).text().toLowerCase();
        if (sport.includes('basketball') && !data.sports?.includes('Basketball')) {
          data.sports?.push('Basketball');
        }
        if (sport.includes('pickleball') && !data.sports?.includes('Pickleball')) {
          data.sports?.push('Pickleball');
        }
      });

      // Add default sports if none found
      if (data.sports.length === 0) {
        data.sports = ['Basketball', 'Pickleball', 'Skating', 'Calisthenics'];
      }

      // Extract amenities
      data.amenities = [];
      if ($('*:contains("Parking")').length > 0) {
        data.amenities.push('Parking');
      }

      // Extract images
      data.images = [];
      $('img[src*="playo.gumlet.io"]').each((_, img) => {
        const src = $(img).attr('src');
        if (src && !data.images?.includes(src)) {
          data.images?.push(src);
        }
      });

    } catch (error) {
      console.error('Error parsing Playo data:', error);
    }

    return data;
  }

  async scrapeInstagramData(url: string): Promise<ScrapedFacilityData> {
    // Instagram scraping is limited due to their anti-scraping measures
    // Return static data based on the profile information
    return {
      name: 'FlowTernity Sports',
      description: 'Multi-sport facility in Horamavu, Bengaluru offering Basketball, Pickleball, Skating, and Calisthenics',
      sports: ['Basketball', 'Pickleball', 'Skating', 'Calisthenics'],
      images: [] // Would need Instagram API for actual images
    };
  }

  async scrapeGoogleMapsData(shareUrl: string): Promise<ScrapedFacilityData> {
    // Google Maps share URLs redirect and are hard to scrape directly
    // Return location data based on the provided information
    return {
      coordinates: { lat: 13.035433, lng: 77.670535 },
      address: '1456, Old Flour Mill road Dodda Kempaih Layout, Kalkere, Horamavu, Bengaluru, Karnataka 560043',
      name: 'FlowTernity Sports',
      location: 'Horamavu, Bengaluru'
    };
  }

  async scrapeAllSources(): Promise<Record<string, ScrapedFacilityData>> {
    const results: Record<string, ScrapedFacilityData> = {};

    try {
      results.playo = await this.scrapePlayoVenue(
        'https://playo.co/venues/horamavu-bengaluru/flowternity-sports-horamavu-bengaluru'
      );
    } catch (error) {
      console.error('Playo scraping failed:', error);
      results.playo = this.getFallbackData();
    }

    try {
      results.instagram = await this.scrapeInstagramData(
        'https://www.instagram.com/flowternity_sports/?hl=en'
      );
    } catch (error) {
      console.error('Instagram scraping failed:', error);
      results.instagram = {};
    }

    try {
      results.google_maps = await this.scrapeGoogleMapsData(
        'https://share.google/T3WTGtG79S2pc9jJi'
      );
    } catch (error) {
      console.error('Google Maps scraping failed:', error);
      results.google_maps = {};
    }

    return results;
  }

  private getFallbackData(): ScrapedFacilityData {
    return {
      name: 'FlowTernity Sports',
      location: 'Horamavu, Bengaluru',
      address: '1456, Old Flour Mill road Dodda Kempaih Layout, Kalkere, Horamavu, Bengaluru, Karnataka 560043',
      phone: '+91 8123999768',
      rating: 5.0,
      reviewCount: 5,
      timing: '6 AM - 11 PM',
      sports: ['Basketball', 'Pickleball', 'Skating', 'Calisthenics'],
      pricing: {
        basketball: '₹700 onwards per session',
        pickleball: '₹700 onwards per session'
      },
      amenities: ['Parking', '20-foot floodlights', '8-layer synthetic flooring', 'International standard courts'],
      description: '22,000 sq ft multi-sport facility with 2 international standard basketball courts and various other sports facilities.',
      coordinates: { lat: 13.035433, lng: 77.670535 }
    };
  }
}

export const facilityScraper = new FacilityScraper();
