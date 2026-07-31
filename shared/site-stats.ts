export const VISITOR_COOKIE_NAME = "lammps_tutorial_visitor";
export const VISITOR_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365 * 2;
export const SITE_STATS_TIME_ZONE = "Asia/Shanghai";

export interface SiteStatsSnapshot {
  totalVisits: number;
  totalVisitors: number;
  todayVisitors: number;
  lastUpdatedAt: string;
  tracked: boolean;
}

export interface StoredVisitorRecord {
  firstSeenAt: string;
  lastSeenAt: string;
  lastSeenDay: string;
  visitCount: number;
}

export interface StoredSiteStats {
  totalVisits: number;
  totalVisitors: number;
  dailyVisitors: Record<string, number>;
  visitors: Record<string, StoredVisitorRecord>;
  lastUpdatedAt: string;
}
