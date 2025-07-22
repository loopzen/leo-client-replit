import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  message: text("message").notNull(),
  response: text("response").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  isError: boolean("is_error").default(false),
});

export const facilityData = pgTable("facility_data", {
  id: serial("id").primaryKey(),
  source: text("source").notNull(), // 'playo', 'instagram', 'google_maps'
  dataType: text("data_type").notNull(), // 'basic_info', 'pricing', 'reviews', 'timing', etc.
  content: jsonb("content").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  isActive: boolean("is_active").default(true),
});

export const scrapingStatus = pgTable("scraping_status", {
  id: serial("id").primaryKey(),
  source: text("source").notNull().unique(),
  lastScraped: timestamp("last_scraped"),
  status: text("status").notNull(), // 'success', 'error', 'pending'
  errorMessage: text("error_message"),
  dataCount: integer("data_count").default(0),
});

export const insertConversationSchema = createInsertSchema(conversations).pick({
  sessionId: true,
  message: true,
  response: true,
  isError: true,
});

export const insertFacilityDataSchema = createInsertSchema(facilityData).pick({
  source: true,
  dataType: true,
  content: true,
  isActive: true,
});

export const insertScrapingStatusSchema = createInsertSchema(scrapingStatus).pick({
  source: true,
  lastScraped: true,
  status: true,
  errorMessage: true,
  dataCount: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type InsertFacilityData = z.infer<typeof insertFacilityDataSchema>;
export type FacilityData = typeof facilityData.$inferSelect;
export type InsertScrapingStatus = z.infer<typeof insertScrapingStatusSchema>;
export type ScrapingStatus = typeof scrapingStatus.$inferSelect;
