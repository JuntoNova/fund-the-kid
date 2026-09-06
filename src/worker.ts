/**
 * Cloudflare Worker - password gate for /pitch/*
 * Cookie token: hex(HMAC-SHA256(PITCH_PASSWORD, "ftk-pitch-v1"))
 */

export interface Env {
  ASSETS: Fetcher;
  PITCH_PASSWORD?: string;
}

const COOKIE_NAME = "ftk_pitch";
const HMAC_MESSAGE = "ftk-pitch-v1";
const COOKIE_MAX_AGE = 604800; // 7 days

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function hmacHex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return [...new Uint8Array(sig)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function parseCookies(header: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    out[k] = decodeURIComponent(v);
  }
  return out;
}

function isPitchProtected(pathname: string, method: string): boolean {
  if (!pathname.startsWith("/pitch")) return false;
  if (pathname === "/pitch/login.html" || pathname === "/pitch/login") return false;
  if (pathname === "/pitch/pitch.css") return false;
  if (pathname === "/pitch/api/login" && method === "POST") return false;
  if (pathname === "/pitch/api/logout" && method === "POST") return false;
  return pathname === "/pitch" || pathname.startsWith("/pitch/");
}

async function cookieValid(request: Request, password: string): Promise<boolean> {
  const cookies = parseCookies(request.headers.get("Cookie"));
  const token = cookies[COOKIE_NAME];
  if (!token) return false;
  const expected = await hmacHex(password, HMAC_MESSAGE);
  return timingSafeEqual(token, expected);
}

function setAuthCookie(token: string): string {
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/pitch; HttpOnly; Secure; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`;
}

function clearAuthCookie(): string {
  return `${COOKIE_NAME}=; Path=/pitch; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

function json(body: unknown, status = 200, headers: HeadersInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}

/** Map clean pitch URLs to static files under public/pitch/ */
function pitchAssetPath(pathname: string): string | null {
  if (pathname === "/pitch" || pathname === "/pitch/") return "/pitch/index.html";
  if (pathname === "/pitch/login" || pathname === "/pitch/login/") return "/pitch/login.html";
  if (pathname === "/pitch/lanes/advocacy" || pathname === "/pitch/lanes/advocacy/")
    return "/pitch/lanes/advocacy.html";
  if (pathname === "/pitch/lanes/supply" || pathname === "/pitch/lanes/supply/")
    return "/pitch/lanes/supply.html";
  if (pathname === "/pitch/lanes/confidence" || pathname === "/pitch/lanes/confidence/")
    return "/pitch/lanes/confidence.html";
  if (
    pathname === "/pitch/campaigns/stem-austin" ||
    pathname === "/pitch/campaigns/stem-austin/"
  )
    return "/pitch/campaigns/stem-austin.html";
  return null;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;
    const method = request.method.toUpperCase();

    if (pathname === "/pitch/api/login" && method === "POST") {
      if (!env.PITCH_PASSWORD) {
        return json({ ok: false, error: "secret not set" }, 503);
      }
      let body: { password?: string };
      try {
        body = (await request.json()) as { password?: string };
      } catch {
        return json({ ok: false, error: "invalid json" }, 400);
      }
      const password = typeof body.password === "string" ? body.password : "";
      if (!timingSafeEqual(password, env.PITCH_PASSWORD)) {
        return json({ ok: false, error: "invalid password" }, 401);
      }
      const token = await hmacHex(env.PITCH_PASSWORD, HMAC_MESSAGE);
      return json({ ok: true }, 200, { "Set-Cookie": setAuthCookie(token) });
    }

    if (pathname === "/pitch/api/logout" && method === "POST") {
      return json({ ok: true }, 200, { "Set-Cookie": clearAuthCookie() });
    }

    if (isPitchProtected(pathname, method)) {
      if (!env.PITCH_PASSWORD) {
        return json({ ok: false, error: "secret not set" }, 503);
      }
      const ok = await cookieValid(request, env.PITCH_PASSWORD);
      if (!ok) {
        const next = pathname + url.search;
        const login = new URL("/pitch/login", url.origin);
        login.searchParams.set("next", next);
        return Response.redirect(login.toString(), 302);
      }
    }

    const mapped = pitchAssetPath(pathname);
    if (mapped) {
      const assetUrl = new URL(mapped, url.origin);
      assetUrl.search = url.search;
      return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
    }

    return env.ASSETS.fetch(request);
  },
};
