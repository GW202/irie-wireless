import { NextRequest, NextResponse } from 'next/server';

const CARRIER_PULSE_BACKEND = process.env.CARRIER_PULSE_API_URL || 'http://localhost:8000';

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
