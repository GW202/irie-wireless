import { NextRequest, NextResponse } from 'next/server';

const CARRIER_PULSE_BACKEND = process.env.CARRIER_PULSE_API_URL || 'http://localhost:8000';
const CARRIER_PULSE_SERVICE_EMAIL = process.env.CARRIER_PULSE_SERVICE_EMAIL || '';
const CARRIER_PULSE_SERVICE_PASSWORD = process.env.CARRIER_PULSE_SERVICE_PASSWORD || '';

// Cache the access token from OAuth2 login
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string | null> {
  if (!CARRIER_PULSE_SERVICE_EMAIL || !CARRIER_PULSE_SERVICE_PASSWORD) {
    return null;
  }

  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now) {
    return cachedToken.token;
  }

  try {
    const res = await fetch(`${CARRIER_PULSE_BACKEND}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: CARRIER_PULSE_SERVICE_EMAIL,
        password: CARRIER_PULSE_SERVICE_PASSWORD,
      }),
    });

    if (!res.ok) {
      console.error('[CarrierPulse] Service login failed:', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    const token = data.access_token;

    // Cache for 50 minutes (assume ~1h expiry)
    cachedToken = { token, expiresAt: now + 50 * 60 * 1000 };
    return token;
  } catch (err) {
    console.error('[CarrierPulse] Service login error:', err);
    return null;
  }
}

async function proxyRequest(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const targetPath = `/api/${path.join('/')}`;
  const url = new URL(targetPath, CARRIER_PULSE_BACKEND);

  // Forward query string
  const searchParams = request.nextUrl.searchParams;
  searchParams.forEach((value, key) => url.searchParams.set(key, value));

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Forward client auth header if present, otherwise login as service account
  const authHeader = request.headers.get('Authorization');
  if (authHeader) {
    headers['Authorization'] = authHeader;
  } else {
    const token = await getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const fetchOptions: RequestInit = {
    method: request.method,
    headers,
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    try {
      const body = await request.text();
      if (body) fetchOptions.body = body;
    } catch {
      // No body
    }
  }

  try {
    const response = await fetch(url.toString(), fetchOptions);
    const responseBody = await response.text();

    // If we get 401, token may have expired — clear cache and retry once
    if (response.status === 401 && !authHeader && cachedToken) {
      cachedToken = null;
      const freshToken = await getAccessToken();
      if (freshToken) {
        headers['Authorization'] = `Bearer ${freshToken}`;
        const retry = await fetch(url.toString(), { ...fetchOptions, headers });
        const retryBody = await retry.text();
        return new NextResponse(retryBody || null, {
          status: retry.status,
          headers: {
            'Content-Type': retry.headers.get('Content-Type') || 'application/json',
          },
        });
      }
    }

    if (!response.ok) {
      console.error(
        `[CarrierPulse] ${request.method} ${targetPath} → ${response.status}`,
        { responseBody: responseBody.substring(0, 200) }
      );
    }

    return new NextResponse(responseBody || null, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      },
    });
  } catch (error) {
    console.error('[CarrierPulse] Proxy connection error:', error);
    return NextResponse.json(
      { error: 'CarrierPulse backend unavailable' },
      { status: 502 }
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PATCH = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
