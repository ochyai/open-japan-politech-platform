const KOKKAI_BASE = "https://kokkai.ndl.go.jp/api/1.0";

const RATE_LIMIT_MS = 3000;
let lastRequestTime = 0;

async function rateLimitedFetch(url: string): Promise<Response> {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < RATE_LIMIT_MS) {
    await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_MS - elapsed));
  }
  lastRequestTime = Date.now();
  return fetch(url);
}

export interface KokkaiSpeechParams {
  nameOfHouse?: string;
  nameOfMeeting?: string;
  any?: string;
  from?: string;
  until?: string;
  startRecord?: number;
  maximumRecords?: number;
  speaker?: string;
}

export interface KokkaiMeetingParams {
  nameOfHouse?: string;
  nameOfMeeting?: string;
  from?: string;
  until?: string;
  startRecord?: number;
  maximumRecords?: number;
}

function buildUrl(endpoint: string, params: Record<string, string | number | undefined>): string {
  const url = new URL(`${KOKKAI_BASE}${endpoint}`);
  url.searchParams.set("recordPacking", "json");
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

export async function fetchSpeeches(params: KokkaiSpeechParams = {}) {
  const url = buildUrl("/speech", params);
  const res = await rateLimitedFetch(url);
  if (!res.ok) {
    throw new Error(`Kokkai API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function fetchMeetings(params: KokkaiMeetingParams = {}) {
  const url = buildUrl("/meeting", params);
  const res = await rateLimitedFetch(url);
  if (!res.ok) {
    throw new Error(`Kokkai API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function fetchMeetingList(params: KokkaiMeetingParams = {}) {
  const url = buildUrl("/meeting_list", params);
  const res = await rateLimitedFetch(url);
  if (!res.ok) {
    throw new Error(`Kokkai API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
