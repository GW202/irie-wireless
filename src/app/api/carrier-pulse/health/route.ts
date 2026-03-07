import { NextResponse } from 'next/server';

const CARRIER_PULSE_BACKEND = process.env.CARRIER_PULSE_API_URL || 'http://localhost:8000';
const CARRIER_PULSE_SERVICE_KEY = process.env.CARRIER_PULSE_SERVICE_KEY || '';

export async function GET() {
  const checks: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    vercel: {
      CARRIER_PULSE_API_URL_set: !!process.env.CARRIER_PULSE_API_URL,
      CARRIER_PULSE_API_URL_value: CARRIER_PULSE_BACKEND,
      CARRIER_PULSE_SERVICE_KEY_set: !!process.env.CARRIER_PULSE_SERVICE_KEY,
      CARRIER_PULSE_SERVICE_KEY_length: CARRIER_PULSE_SERVICE_KEY.length,
    },
    backend: {
      reachable: false,
      status: null as number | null,
      auth_accepted: false,
      error: null as string | null,
    },
  };

  // Test connectivity + auth against Railway backend
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (CARRIER_PULSE_SERVICE_KEY) {
      headers['X-Service-Key'] = CARRIER_PULSE_SERVICE_KEY;
    }

    const response = await fetch(`${CARRIER_PULSE_BACKEND}/api/brands`, {
      method: 'GET',
      headers,
    });

    checks.backend = {
      reachable: true,
      status: response.status,
      auth_accepted: response.ok,
      error: response.ok ? null : `${response.status} ${response.statusText}`,
    };
  } catch (err) {
    checks.backend = {
      reachable: false,
      status: null,
      auth_accepted: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }

  return NextResponse.json(checks);
}
