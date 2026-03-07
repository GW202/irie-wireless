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
      service_password_set: !!CARRIER_PULSE_SERVICE_PASSWORD,
    },
  };

  // Step 1: Test login with service account
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
    results.step1_login = {
      status: loginRes.status,
      body: loginBody.substring(0, 300),
    };
    if (loginRes.ok) {
      const data = JSON.parse(loginBody);
      accessToken = data.access_token;
    }
  } catch (err) {
    results.step1_login = { error: err instanceof Error ? err.message : 'Failed' };
  }

  // Step 2: Test protected endpoint with token
  if (accessToken) {
    try {
      const res = await fetch(`${CARRIER_PULSE_BACKEND}/api/brands`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const body = await res.text();
      results.step2_brands = { status: res.status, body: body.substring(0, 500) };
    } catch (err) {
      results.step2_brands = { error: err instanceof Error ? err.message : 'Failed' };
    }

    // Step 3: Check who we are
    try {
      const res = await fetch(`${CARRIER_PULSE_BACKEND}/api/auth/me`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const body = await res.text();
      results.step3_me = { status: res.status, body: body.substring(0, 500) };
    } catch (err) {
      results.step3_me = { error: err instanceof Error ? err.message : 'Failed' };
    }
  } else {
    results.step2_brands = { skipped: 'No access token' };
    results.step3_me = { skipped: 'No access token' };
  }

  return NextResponse.json(results);
}
