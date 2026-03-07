import { NextResponse } from 'next/server';

const CARRIER_PULSE_BACKEND = process.env.CARRIER_PULSE_API_URL || 'http://localhost:8000';
const CARRIER_PULSE_SERVICE_KEY = process.env.CARRIER_PULSE_SERVICE_KEY || '';

export async function GET() {
  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    config: {
      CARRIER_PULSE_API_URL_set: !!process.env.CARRIER_PULSE_API_URL,
      CARRIER_PULSE_API_URL_value: CARRIER_PULSE_BACKEND,
      CARRIER_PULSE_SERVICE_KEY_set: !!process.env.CARRIER_PULSE_SERVICE_KEY,
      CARRIER_PULSE_SERVICE_KEY_length: CARRIER_PULSE_SERVICE_KEY.length,
    },
  };

  // Test 1: No auth (baseline — expect 401)
  try {
    const res = await fetch(`${CARRIER_PULSE_BACKEND}/api/brands`, {
      headers: { 'Content-Type': 'application/json' },
    });
    results.test_no_auth = { status: res.status, ok: res.ok };
  } catch (err) {
    results.test_no_auth = { error: err instanceof Error ? err.message : 'Failed' };
  }

  // Test 2: X-Service-Key header
  try {
    const res = await fetch(`${CARRIER_PULSE_BACKEND}/api/brands`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Service-Key': CARRIER_PULSE_SERVICE_KEY,
      },
    });
    results.test_x_service_key = { status: res.status, ok: res.ok };
  } catch (err) {
    results.test_x_service_key = { error: err instanceof Error ? err.message : 'Failed' };
  }

  // Test 3: Bearer token with service key
  try {
    const res = await fetch(`${CARRIER_PULSE_BACKEND}/api/brands`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CARRIER_PULSE_SERVICE_KEY}`,
      },
    });
    results.test_bearer_token = { status: res.status, ok: res.ok };
  } catch (err) {
    results.test_bearer_token = { error: err instanceof Error ? err.message : 'Failed' };
  }

  // Test 4: Both headers
  try {
    const res = await fetch(`${CARRIER_PULSE_BACKEND}/api/brands`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CARRIER_PULSE_SERVICE_KEY}`,
        'X-Service-Key': CARRIER_PULSE_SERVICE_KEY,
      },
    });
    results.test_both_headers = { status: res.status, ok: res.ok };
  } catch (err) {
    results.test_both_headers = { error: err instanceof Error ? err.message : 'Failed' };
  }

  return NextResponse.json(results);
}
