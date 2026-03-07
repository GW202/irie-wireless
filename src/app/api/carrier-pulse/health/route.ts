import { NextResponse } from 'next/server';

const CARRIER_PULSE_BACKEND = process.env.CARRIER_PULSE_API_URL || 'http://localhost:8000';
const CARRIER_PULSE_SERVICE_EMAIL = process.env.CARRIER_PULSE_SERVICE_EMAIL || '';
const CARRIER_PULSE_SERVICE_PASSWORD = process.env.CARRIER_PULSE_SERVICE_PASSWORD || '';

export async function GET() {
  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    config: {
      backend_url: CARRIER_PULSE_BACKEND,
      service_email_set: !!CARRIER_PULSE_SERVICE_EMAIL,
      service_email_value: CARRIER_PULSE_SERVICE_EMAIL || '(not set)',
      service_password_set: !!CARRIER_PULSE_SERVICE_PASSWORD,
      service_password_length: CARRIER_PULSE_SERVICE_PASSWORD.length,
    },
  };

  // Step 1: Test login
  let accessToken: string | null = null;
  try {
    const loginRes = await fetch(`${CARRIER_PULSE_BACKEND}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: CARRIER_PULSE_SERVICE_EMAIL,
        password: CARRIER_PULSE_SERVICE_PASSWORD,
      }),
    });
    const loginBody = await loginRes.text();
    results.login = { status: loginRes.status, body: loginBody.substring(0, 300) };

    if (loginRes.ok) {
      const data = JSON.parse(loginBody);
      accessToken = data.access_token;
    }
  } catch (err) {
    results.login = { error: err instanceof Error ? err.message : 'Failed' };
  }

  // Step 2: Test /api/brands with the token
  if (accessToken) {
    try {
      const res = await fetch(`${CARRIER_PULSE_BACKEND}/api/brands`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const body = await res.text();
      results.brands_with_token = { status: res.status, body: body.substring(0, 300) };
    } catch (err) {
      results.brands_with_token = { error: err instanceof Error ? err.message : 'Failed' };
    }
  } else {
    results.brands_with_token = { skipped: 'No access token from login' };
  }

  return NextResponse.json(results);
}
