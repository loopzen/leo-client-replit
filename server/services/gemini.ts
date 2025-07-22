import { GoogleGenAI } from "@google/genai";
import { FacilityInfo } from "./facilityData";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "" 
});

export async function generateChatResponse(
  userMessage: string, 
  facilityInfo: FacilityInfo
): Promise<string> {
  try {
    // Create comprehensive context about FlowTernity Sports
    const facilityContext = `
You are an AI assistant for FlowTernity Sports, a multi-sport facility in Horamavu, Bengaluru. Here's the comprehensive information about our facility:

BASIC INFORMATION:
- Name: ${facilityInfo.basicInfo.name}
- Location: ${facilityInfo.basicInfo.location}
- Address: ${facilityInfo.basicInfo.address}
- Phone: ${facilityInfo.basicInfo.phone}
- Rating: ${facilityInfo.basicInfo.rating}/5 (${facilityInfo.basicInfo.reviewCount} reviews)
- Operating Hours: ${facilityInfo.basicInfo.timing}
- Coordinates: ${facilityInfo.basicInfo.coordinates?.lat}, ${facilityInfo.basicInfo.coordinates?.lng}

SPORTS AVAILABLE:
${facilityInfo.sports.map(sport => `- ${sport}`).join('\n')}

PRICING:
${Object.entries(facilityInfo.pricing).map(([sport, price]) => `- ${sport}: ${price}`).join('\n')}

AMENITIES:
${facilityInfo.amenities.map(amenity => `- ${amenity}`).join('\n')}

COACHING PROGRAMS:
- Available: ${facilityInfo.coaching.available ? 'Yes' : 'No'}
- Schedule: ${facilityInfo.coaching.schedule.join(', ')}
- Programs: ${facilityInfo.coaching.programs.join(', ')}

BOOKING INFORMATION:
- Book via Playo: https://playo.co/venues/horamavu-bengaluru/flowternity-sports-horamavu-bengaluru
- Book via Hudle platform
- Direct booking: Call ${facilityInfo.basicInfo.phone}

KEY FEATURES:
- 22,000 sq ft multi-sport facility
- 2 International Standard Basketball Courts
- 8-layer synthetic flooring for basketball
- 20-foot floodlights for night games
- 2 Pickleball courts (multi-use)
- Dedicated skating/skateboarding area
- Calisthenics zone
- Athlete recovery corner
- Inspired by New York's "The Cage" with 16-foot metal boundaries

RECENT EVENTS & PROGRAMS:
- Summer camps (Basketball & Skating) - April-May 2025
- 3x3 Basketball Tournament - June 1, 2025
- Regular coaching sessions for all age groups

You should respond in a friendly, helpful manner and provide accurate information about the facility. Always encourage users to visit or contact the facility for bookings. If asked about something not covered in the information above, politely mention that you can help them get in touch with the facility directly.

IMPORTANT: Always provide specific, accurate information from the context above. Don't make up pricing, timings, or other details not provided.
`;

    const prompt = `${facilityContext}

User Question: ${userMessage}

Please provide a helpful and informative response about FlowTernity Sports. Include relevant details like pricing, timings, contact information, or booking instructions when appropriate. Keep your response conversational and encouraging.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const responseText = response.text;
    
    if (!responseText) {
      throw new Error("Empty response from AI service");
    }

    return responseText;

  } catch (error) {
    console.error("AI service error:", error);
    
    // Provide helpful fallback responses based on common queries
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('fee')) {
      return `I'm currently experiencing technical difficulties, but I can share that our court pricing starts from ₹700 onwards per session. For detailed pricing information, please contact us directly at ${facilityInfo.basicInfo.phone} or visit our Playo page.`;
    }
    
    if (lowerMessage.includes('timing') || lowerMessage.includes('hours') || lowerMessage.includes('open')) {
      return `I'm having some technical issues right now, but FlowTernity Sports is open from ${facilityInfo.basicInfo.timing} daily. For current availability and bookings, please call ${facilityInfo.basicInfo.phone}.`;
    }
    
    if (lowerMessage.includes('location') || lowerMessage.includes('address') || lowerMessage.includes('direction')) {
      return `I'm experiencing connectivity issues, but here's our location: ${facilityInfo.basicInfo.address}. You can also find us on Google Maps or contact us at ${facilityInfo.basicInfo.phone} for directions.`;
    }
    
    if (lowerMessage.includes('book') || lowerMessage.includes('reserve') || lowerMessage.includes('availability')) {
      return `I'm having technical difficulties right now, but you can book our courts through:\n• Playo platform\n• Hudle platform\n• Direct booking: ${facilityInfo.basicInfo.phone}\n\nOur courts are available from ${facilityInfo.basicInfo.timing} daily.`;
    }
    
    if (lowerMessage.includes('coach') || lowerMessage.includes('training') || lowerMessage.includes('class')) {
      return `I'm experiencing some technical issues, but we do offer coaching programs! For details about our basketball training, skating classes, and other programs, please contact us at ${facilityInfo.basicInfo.phone}.`;
    }
    
    // Generic fallback
    return `I apologize, but I'm experiencing technical difficulties right now. For immediate assistance with information about FlowTernity Sports, please contact us directly:

📞 Phone: ${facilityInfo.basicInfo.phone}
📍 Address: ${facilityInfo.basicInfo.address}
⏰ Hours: ${facilityInfo.basicInfo.timing}

You can also book courts through Playo or Hudle platforms. Thank you for your patience!`;
  }
}

export async function generateFacilitySummary(facilityInfo: FacilityInfo): Promise<string> {
  try {
    const prompt = `
Based on the following information about FlowTernity Sports, create a concise and engaging summary:

Facility: ${facilityInfo.basicInfo.name}
Location: ${facilityInfo.basicInfo.location}
Sports: ${facilityInfo.sports.join(', ')}
Rating: ${facilityInfo.basicInfo.rating}/5
Hours: ${facilityInfo.basicInfo.timing}

Create a 2-3 sentence summary that highlights the key features and appeal of this sports facility.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "FlowTernity Sports is a premier multi-sport facility in Horamavu, Bengaluru, offering world-class courts for basketball, pickleball, and more.";

  } catch (error) {
    console.error("Error generating facility summary:", error);
    return `${facilityInfo.basicInfo.name} is a premier multi-sport facility in ${facilityInfo.basicInfo.location}, offering ${facilityInfo.sports.join(', ')} with professional coaching and modern amenities.`;
  }
}