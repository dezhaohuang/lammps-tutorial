import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import {
  SITE_STATS_TIME_ZONE,
  VISITOR_COOKIE_MAX_AGE_SECONDS,
  VISITOR_COOKIE_NAME,
  type SiteStatsSnapshot,
  type StoredSiteStats,
  type StoredVisitorRecord,
} from "../shared/site-stats";

type NextFunction = () => void;
type MiddlewareRequest = IncomingMessage & {
  headers: IncomingMessage["headers"];
  method?: string;
};
type MiddlewareResponse = ServerResponse<IncomingMessage>;

const STORAGE_PATH =
  process.env.SITE_STATS_STORAGE_PATH ||
  path.resolve(process.cwd(), "data", "site-stats.json");
const BOT_USER_AGENT_PATTERN =
  /bot|crawler|spider|slurp|preview|headless|lighthouse|wget|curl/i;
const DAY_KEY_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  timeZone: SITE_STATS_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

let mutationQueue = Promise.resolve();

function createEmptyStore(): StoredSiteStats {
  return {
    totalVisits: 0,
    totalVisitors: 0,
    dailyVisitors: {},
    visitors: {},
    lastUpdatedAt: new Date(0).toISOString(),
  };
}

function ensureStorageDir() {
  fs.mkdirSync(path.dirname(STORAGE_PATH), { recursive: true });
}

function getDayKey(date = new Date()) {
  const parts = Object.fromEntries(
    DAY_KEY_FORMATTER.formatToParts(date).map((part) => [part.type, part.value]),
  );

  return `${parts.year}-${parts.month}-${parts.day}`;
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeVisitorRecord(value: unknown): StoredVisitorRecord | null {
  if (!isObjectRecord(value)) {
    return null;
  }

  const firstSeenAt =
    typeof value.firstSeenAt === "string"
      ? value.firstSeenAt
      : new Date(0).toISOString();
  const lastSeenAt =
    typeof value.lastSeenAt === "string" ? value.lastSeenAt : firstSeenAt;
  const lastSeenDay =
    typeof value.lastSeenDay === "string" ? value.lastSeenDay : getDayKey();
  const visitCount =
    typeof value.visitCount === "number" && Number.isFinite(value.visitCount)
      ? value.visitCount
      : 0;

  return {
    firstSeenAt,
    lastSeenAt,
    lastSeenDay,
    visitCount,
  };
}

function normalizeStore(raw: unknown): StoredSiteStats {
  if (!isObjectRecord(raw)) {
    return createEmptyStore();
  }

  const dailyVisitors: Record<string, number> = {};
  if (isObjectRecord(raw.dailyVisitors)) {
    for (const [key, value] of Object.entries(raw.dailyVisitors)) {
      if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
        dailyVisitors[key] = value;
      }
    }
  }

  const visitors: Record<string, StoredVisitorRecord> = {};
  if (isObjectRecord(raw.visitors)) {
    for (const [key, value] of Object.entries(raw.visitors)) {
      const record = normalizeVisitorRecord(value);
      if (record) {
        visitors[key] = record;
      }
    }
  }

  const totalVisits =
    typeof raw.totalVisits === "number" && Number.isFinite(raw.totalVisits)
      ? raw.totalVisits
      : 0;
  const totalVisitors =
    typeof raw.totalVisitors === "number" &&
    Number.isFinite(raw.totalVisitors)
      ? raw.totalVisitors
      : Object.keys(visitors).length;
  const lastUpdatedAt =
    typeof raw.lastUpdatedAt === "string"
      ? raw.lastUpdatedAt
      : new Date(0).toISOString();

  return {
    totalVisits,
    totalVisitors,
    dailyVisitors,
    visitors,
    lastUpdatedAt,
  };
}

function readStore() {
  ensureStorageDir();

  if (!fs.existsSync(STORAGE_PATH)) {
    return createEmptyStore();
  }

  try {
    const raw = JSON.parse(fs.readFileSync(STORAGE_PATH, "utf-8")) as unknown;
    return normalizeStore(raw);
  } catch {
    return createEmptyStore();
  }
}

function writeStore(store: StoredSiteStats) {
  ensureStorageDir();
  const tempPath = `${STORAGE_PATH}.tmp`;

  fs.writeFileSync(tempPath, JSON.stringify(store, null, 2), "utf-8");
  fs.renameSync(tempPath, STORAGE_PATH);
}

function parseCookies(cookieHeader?: string) {
  if (!cookieHeader) {
    return {};
  }

  return cookieHeader.split(";").reduce<Record<string, string>>((acc, chunk) => {
    const [rawName, ...rawValue] = chunk.trim().split("=");
    if (!rawName) {
      return acc;
    }

    acc[rawName] = decodeURIComponent(rawValue.join("="));
    return acc;
  }, {});
}

function isSecureRequest(req: MiddlewareRequest) {
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (typeof forwardedProto === "string") {
    return forwardedProto.includes("https");
  }

  if (Array.isArray(forwardedProto)) {
    return forwardedProto.some((value) => value.includes("https"));
  }

  return false;
}

function serializeVisitorCookie(visitorId: string, secure: boolean) {
  return [
    `${VISITOR_COOKIE_NAME}=${encodeURIComponent(visitorId)}`,
    "Path=/",
    `Max-Age=${VISITOR_COOKIE_MAX_AGE_SECONDS}`,
    "HttpOnly",
    "SameSite=Lax",
    secure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

function pruneOldDailyCounters(store: StoredSiteStats) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 60);
  const cutoffKey = getDayKey(cutoff);

  for (const key of Object.keys(store.dailyVisitors)) {
    if (key < cutoffKey) {
      delete store.dailyVisitors[key];
    }
  }
}

function createSnapshot(
  store: StoredSiteStats,
  tracked: boolean,
): SiteStatsSnapshot {
  const todayKey = getDayKey();

  return {
    totalVisits: store.totalVisits,
    totalVisitors: store.totalVisitors,
    todayVisitors: store.dailyVisitors[todayKey] ?? 0,
    lastUpdatedAt: store.lastUpdatedAt,
    tracked,
  };
}

function sendJson(
  res: MiddlewareResponse,
  statusCode: number,
  payload: unknown,
  extraHeaders?: Record<string, string>,
) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...extraHeaders,
  });
  res.end(JSON.stringify(payload));
}

function enqueueMutation<T>(task: () => T | Promise<T>) {
  const next = mutationQueue.then(task, task);
  mutationQueue = next.then(
    () => undefined,
    () => undefined,
  );
  return next;
}

async function handleRead(res: MiddlewareResponse) {
  const store = readStore();
  sendJson(res, 200, createSnapshot(store, true));
}

async function handleTrack(req: MiddlewareRequest, res: MiddlewareResponse) {
  const userAgent = req.headers["user-agent"] || "";
  const isBot =
    typeof userAgent === "string" && BOT_USER_AGENT_PATTERN.test(userAgent);

  if (isBot) {
    const store = readStore();
    sendJson(res, 200, createSnapshot(store, false));
    return;
  }

  const cookies = parseCookies(req.headers.cookie);
  const visitorId = cookies[VISITOR_COOKIE_NAME] || crypto.randomUUID();
  const secure = isSecureRequest(req);

  const snapshot = await enqueueMutation(() => {
    const store = readStore();
    const now = new Date();
    const nowIso = now.toISOString();
    const todayKey = getDayKey(now);
    const visitor = store.visitors[visitorId];

    store.totalVisits += 1;

    if (!visitor) {
      store.totalVisitors += 1;
      store.dailyVisitors[todayKey] = (store.dailyVisitors[todayKey] ?? 0) + 1;
      store.visitors[visitorId] = {
        firstSeenAt: nowIso,
        lastSeenAt: nowIso,
        lastSeenDay: todayKey,
        visitCount: 1,
      };
    } else {
      visitor.visitCount += 1;
      visitor.lastSeenAt = nowIso;

      if (visitor.lastSeenDay !== todayKey) {
        store.dailyVisitors[todayKey] = (store.dailyVisitors[todayKey] ?? 0) + 1;
        visitor.lastSeenDay = todayKey;
      }
    }

    store.lastUpdatedAt = nowIso;
    pruneOldDailyCounters(store);
    writeStore(store);

    return createSnapshot(store, true);
  });

  const headers = cookies[VISITOR_COOKIE_NAME]
    ? undefined
    : { "Set-Cookie": serializeVisitorCookie(visitorId, secure) };

  sendJson(res, 200, snapshot, headers);
}

export function siteStatsMiddleware(
  req: MiddlewareRequest,
  res: MiddlewareResponse,
  next?: NextFunction,
) {
  const method = req.method?.toUpperCase();

  if (method === "GET") {
    void handleRead(res);
    return;
  }

  if (method === "POST") {
    void handleTrack(req, res);
    return;
  }

  if (next) {
    next();
    return;
  }

  sendJson(res, 405, { message: "Method not allowed" });
}
