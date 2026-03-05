export type Platform = "instagram" | "tiktok" | "youtube" | "twitter";
export interface AuditResult {
  handle: string; platform: Platform; profileName: string; profileImage?: string;
  followers: number; followersFormatted: string; engagementRate: number;
  fakeFollowerPercent: number; auditScore: number; estimatedPostRate: number;
  audienceAge: string; topCountry: string; topCountryPercent: number;
  fraudFlagged: boolean; fraudReason?: string; createdAt: string;
}
export interface AuditError {
  code: "NOT_FOUND" | "RATE_LIMITED" | "API_ERROR" | "INVALID_HANDLE";
  message: string; suggestion?: string;
}
