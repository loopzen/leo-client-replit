import { 
  users, 
  conversations, 
  facilityData, 
  scrapingStatus,
  type User, 
  type InsertUser, 
  type InsertConversation, 
  type Conversation,
  type InsertFacilityData,
  type FacilityData,
  type InsertScrapingStatus,
  type ScrapingStatus
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Conversation methods
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversationsBySession(sessionId: string): Promise<Conversation[]>;
  getAllConversations(): Promise<Conversation[]>;
  
  // Facility data methods
  createFacilityData(data: InsertFacilityData): Promise<FacilityData>;
  getFacilityDataBySource(source: string): Promise<FacilityData[]>;
  getFacilityDataByType(dataType: string): Promise<FacilityData[]>;
  getAllFacilityData(): Promise<FacilityData[]>;
  
  // Scraping status methods
  updateScrapingStatus(source: string, status: string, errorMessage: string | null, dataCount: number): Promise<ScrapingStatus>;
  getScrapingStatus(source: string): Promise<ScrapingStatus | undefined>;
  getAllScrapingStatuses(): Promise<ScrapingStatus[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private conversations: Map<number, Conversation>;
  private facilityDataMap: Map<number, FacilityData>;
  private scrapingStatusMap: Map<string, ScrapingStatus>;
  private currentUserId: number;
  private currentConversationId: number;
  private currentFacilityDataId: number;

  constructor() {
    this.users = new Map();
    this.conversations = new Map();
    this.facilityDataMap = new Map();
    this.scrapingStatusMap = new Map();
    this.currentUserId = 1;
    this.currentConversationId = 1;
    this.currentFacilityDataId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = this.currentConversationId++;
    const conversation: Conversation = {
      ...insertConversation,
      id,
      timestamp: new Date(),
      isError: insertConversation.isError || false
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async getConversationsBySession(sessionId: string): Promise<Conversation[]> {
    return Array.from(this.conversations.values())
      .filter(conv => conv.sessionId === sessionId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async getAllConversations(): Promise<Conversation[]> {
    return Array.from(this.conversations.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async createFacilityData(insertFacilityData: InsertFacilityData): Promise<FacilityData> {
    const id = this.currentFacilityDataId++;
    const facilityDataItem: FacilityData = {
      ...insertFacilityData,
      id,
      lastUpdated: new Date(),
      isActive: insertFacilityData.isActive !== undefined ? insertFacilityData.isActive : true
    };
    this.facilityDataMap.set(id, facilityDataItem);
    return facilityDataItem;
  }

  async getFacilityDataBySource(source: string): Promise<FacilityData[]> {
    return Array.from(this.facilityDataMap.values())
      .filter(data => data.source === source && data.isActive);
  }

  async getFacilityDataByType(dataType: string): Promise<FacilityData[]> {
    return Array.from(this.facilityDataMap.values())
      .filter(data => data.dataType === dataType && data.isActive);
  }

  async getAllFacilityData(): Promise<FacilityData[]> {
    return Array.from(this.facilityDataMap.values())
      .filter(data => data.isActive)
      .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());
  }

  async updateScrapingStatus(source: string, status: string, errorMessage: string | null, dataCount: number): Promise<ScrapingStatus> {
    const existingStatus = this.scrapingStatusMap.get(source);
    const scrapingStatusItem: ScrapingStatus = {
      id: existingStatus?.id || Date.now(),
      source,
      lastScraped: new Date(),
      status,
      errorMessage,
      dataCount
    };
    this.scrapingStatusMap.set(source, scrapingStatusItem);
    return scrapingStatusItem;
  }

  async getScrapingStatus(source: string): Promise<ScrapingStatus | undefined> {
    return this.scrapingStatusMap.get(source);
  }

  async getAllScrapingStatuses(): Promise<ScrapingStatus[]> {
    return Array.from(this.scrapingStatusMap.values());
  }
}

export const storage = new MemStorage();
