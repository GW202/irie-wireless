import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const CARRIER_PULSE_BACKEND = process.env.CARRIER_PULSE_API_URL || 'http://localhost:8000';
const CARRIER_PULSE_SERVICE_KEY = process.env.CARRIER_PULSE_SERVICE_KEY || '';

// Cache the JWT so we don't sign on every request (reuse for 50 min of 60 min expiry)
let cachedToken: { jwt: string; expiresAt: number } | null = null;

async function getServiceJWT(): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now) {
    return cachedToken.jwt;
  }

  const secret = new TextEncoder().encode(CARRIER_PULSE_SERVICE_KEY);
  const jwt = await new SignJWT({
    sub: 'irie-platform-service',
    role: 'service',
    iss: 'irie-wireless',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secret);

  cachedToken = { jwt, expiresAt: now + 50 * 60 * 1000 };
  return jwt;
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

  // Forward client auth header if present, otherwise generate a service JWT
  const authHeader = request.headers.get('Authorization');
  if (authHeader) {
    headers['Authorization'] = authHeader;
  } else if (CARRIER_PULSE_SERVICE_KEY) {
    // Service-to-service auth — sign a JWT with the shared secret
    // The Python backend validates JWT tokens signed with SERVICE_KEY
    const serviceJwt = await getServiceJWT();
    headers['Authorization'] = `Bearer ${serviceJwt}`;
  }

  // Also send raw key as X-Service-Key for backends that check this header
  if (CARRIER_PULSE_SERVICE_KEY) {
    headers['X-Service-Key'] = CARRIER_PULSE_SERVICE_KEY;
  }

  // Log auth diagnostic info on non-200 responses
  const hasServiceKey = !!CARRIER_PULSE_SERVICE_KEY;
  const hasAuthHeader = !!authHeader;

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

    if (!response.ok) {
      console.error(
        `[CarrierPulse] ${request.method} ${targetPath} → ${response.status}`,
        {
          backendUrl: CARRIER_PULSE_BACKEND,
          hasServiceKey,
          serviceKeyLength: CARRIER_PULSE_SERVICE_KEY.length,
          hasAuthHeader,
          responseBody: responseBody.substring(0, 200),
        }
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
