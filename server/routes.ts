import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateChatResponse } from "./services/gemini";
import { facilityDataService } from "./services/facilityData";
import { insertConversationSchema } from "@shared/schema";
import { z } from "zod";

const chatRequestSchema = z.object({
  message: z.string().min(1),
  sessionId: z.string().min(1),
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, sessionId } = chatRequestSchema.parse(req.body);
      
      // Get facility information for context
      const facilityInfo = await facilityDataService.getFacilityInfo();
      
      // Generate AI response
      const response = await generateChatResponse(message, facilityInfo);
      
      // Save conversation
      await storage.createConversation({
        sessionId,
        message,
        response,
        isError: false
      });
      
      res.json({ response, success: true });
    } catch (error) {
      console.error("Chat error:", error);
      
      const errorResponse = "I apologize, but I'm experiencing technical difficulties. Please try again or contact FlowTernity Sports directly at +91 8123999768.";
      
      try {
        if (req.body.sessionId) {
          await storage.createConversation({
            sessionId: req.body.sessionId,
            message: req.body.message || "Error occurred",
            response: errorResponse,
            isError: true
          });
        }
      } catch (saveError) {
        console.error("Error saving error conversation:", saveError);
      }
      
      res.status(500).json({ 
        response: errorResponse,
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Get facility information
  app.get("/api/facility", async (req, res) => {
    try {
      const facilityInfo = await facilityDataService.getFacilityInfo();
      res.json(facilityInfo);
    } catch (error) {
      console.error("Facility info error:", error);
      res.status(500).json({ error: "Failed to get facility information" });
    }
  });

  // Get conversation history
  app.get("/api/conversations/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const conversations = await storage.getConversationsBySession(sessionId);
      res.json(conversations);
    } catch (error) {
      console.error("Conversations error:", error);
      res.status(500).json({ error: "Failed to get conversations" });
    }
  });

  // Get scraping status
  app.get("/api/scraping-status", async (req, res) => {
    try {
      const statuses = await facilityDataService.getScrapingStatuses();
      res.json(statuses);
    } catch (error) {
      console.error("Scraping status error:", error);
      res.status(500).json({ error: "Failed to get scraping status" });
    }
  });

  // Trigger data refresh
  app.post("/api/refresh-data", async (req, res) => {
    try {
      await facilityDataService.updateAllData();
      res.json({ success: true, message: "Data refresh initiated" });
    } catch (error) {
      console.error("Data refresh error:", error);
      res.status(500).json({ error: "Failed to refresh data" });
    }
  });

  // Initialize facility data on server start
  setTimeout(async () => {
    try {
      console.log("Initializing facility data...");
      await facilityDataService.updateAllData();
      console.log("Facility data initialized successfully");
    } catch (error) {
      console.error("Failed to initialize facility data:", error);
    }
  }, 2000);

  const httpServer = createServer(app);
  return httpServer;
}
