import axios, { AxiosError } from "axios";

interface TokenCache {
  value: string;
  expiresAt: number;
}

// Cached tokens — refreshed automatically before expiry
let apiToken: TokenCache | null = null;
let cpiToken: TokenCache | null = null;
let csrfToken: string | null = null;

function getBaseUrl(): string {
  const url = process.env.API_BASE_URL;
  if (!url) throw new Error("API_BASE_URL is not set");
  return url.replace(/\/$/, "");
}

function getCpiBaseUrl(): string {
  const url = process.env.CPI_BASE_URL;
  if (!url) throw new Error("CPI_BASE_URL is not set (required for send_test_message)");
  return url.replace(/\/$/, "");
}

async function fetchOAuthToken(
  clientId: string,
  clientSecret: string,
  tokenUrl: string,
  cache: { ref: TokenCache | null }
): Promise<string> {
  const now = Date.now();
  if (cache.ref && cache.ref.expiresAt > now + 60_000) return cache.ref.value;

  const response = await axios.post(
    tokenUrl,
    new URLSearchParams({ grant_type: "client_credentials" }),
    {
      auth: { username: clientId, password: clientSecret },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );

  cache.ref = {
    value: response.data.access_token,
    expiresAt: now + response.data.expires_in * 1000,
  };
  return cache.ref.value;
}

async function getApiAuthHeaders(): Promise<Record<string, string>> {
  if (process.env.API_USER && process.env.API_PASS) {
    const credentials = Buffer.from(`${process.env.API_USER}:${process.env.API_PASS}`).toString("base64");
    return { Authorization: `Basic ${credentials}` };
  }
  if (process.env.API_OAUTH_CLIENT_ID && process.env.API_OAUTH_CLIENT_SECRET && process.env.API_OAUTH_TOKEN_URL) {
    const cache = { ref: apiToken };
    const token = await fetchOAuthToken(
      process.env.API_OAUTH_CLIENT_ID,
      process.env.API_OAUTH_CLIENT_SECRET,
      process.env.API_OAUTH_TOKEN_URL,
      cache
    );
    apiToken = cache.ref;
    return { Authorization: `Bearer ${token}` };
  }
  throw new Error("No API auth configured. Set API_USER/API_PASS or API_OAUTH_* vars.");
}

async function getCpiAuthHeaders(): Promise<Record<string, string>> {
  if (process.env.CPI_OAUTH_CLIENT_ID && process.env.CPI_OAUTH_CLIENT_SECRET && process.env.CPI_OAUTH_TOKEN_URL) {
    const cache = { ref: cpiToken };
    const token = await fetchOAuthToken(
      process.env.CPI_OAUTH_CLIENT_ID,
      process.env.CPI_OAUTH_CLIENT_SECRET,
      process.env.CPI_OAUTH_TOKEN_URL,
      cache
    );
    cpiToken = cache.ref;
    return { Authorization: `Bearer ${token}` };
  }
  // Fall back to API auth for CPI endpoint calls
  return getApiAuthHeaders();
}

async function getCsrfToken(): Promise<string> {
  if (csrfToken) return csrfToken;
  const auth = await getApiAuthHeaders();
  const response = await axios.get(`${getBaseUrl()}/IntegrationPackages?$top=1&$format=json`, {
    headers: { ...auth, "X-CSRF-Token": "Fetch" },
  });
  const token = response.headers["x-csrf-token"] as string;
  if (!token || token === "Required") throw new Error("Failed to fetch CSRF token");
  csrfToken = token;
  return csrfToken;
}

export function invalidateCsrf(): void {
  csrfToken = null;
}

// Extracts a readable error message from SAP OData error responses
export function extractErrorMessage(err: unknown): string {
  if (err instanceof AxiosError) {
    const data = err.response?.data;
    if (data?.error?.message?.value) return data.error.message.value;
    if (typeof data === "string") return data;
    return err.message;
  }
  if (err instanceof Error) return err.message;
  return String(err);
}

export async function apiGet<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const auth = await getApiAuthHeaders();
  const response = await axios.get(`${getBaseUrl()}${path}`, {
    headers: { ...auth, Accept: "application/json" },
    params: { $format: "json", ...params },
  });
  return response.data as T;
}

export async function apiPost<T>(path: string, data: unknown, contentType = "application/json"): Promise<T> {
  const [auth, csrf] = await Promise.all([getApiAuthHeaders(), getCsrfToken()]);
  const response = await axios.post(`${getBaseUrl()}${path}`, data, {
    headers: {
      ...auth,
      "X-CSRF-Token": csrf,
      "Content-Type": contentType,
      Accept: "application/json",
    },
  });
  return response.data as T;
}

export async function apiPut(path: string, data: unknown, contentType = "application/json"): Promise<void> {
  const [auth, csrf] = await Promise.all([getApiAuthHeaders(), getCsrfToken()]);
  await axios.put(`${getBaseUrl()}${path}`, data, {
    headers: {
      ...auth,
      "X-CSRF-Token": csrf,
      "Content-Type": contentType,
    },
  });
}

export async function apiDelete(path: string): Promise<void> {
  const [auth, csrf] = await Promise.all([getApiAuthHeaders(), getCsrfToken()]);
  await axios.delete(`${getBaseUrl()}${path}`, {
    headers: { ...auth, "X-CSRF-Token": csrf },
  });
}

export async function apiGetRaw(path: string): Promise<Buffer> {
  const auth = await getApiAuthHeaders();
  const response = await axios.get(`${getBaseUrl()}${path}`, {
    headers: auth,
    responseType: "arraybuffer",
  });
  return Buffer.from(response.data as ArrayBuffer);
}

export async function cpiPost(path: string, data: unknown, contentType = "application/json"): Promise<unknown> {
  const auth = await getCpiAuthHeaders();
  const response = await axios.post(`${getCpiBaseUrl()}${path}`, data, {
    headers: { ...auth, "Content-Type": contentType },
  });
  return response.data;
}
