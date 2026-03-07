import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const CARRIER_PULSE_BACKEND = process.env.CARRIER_PULSE_API_URL || 'http://localhost:8000';
const CARRIER_PULSE_SERVICE_KEY = process.env.CARRIER_PULSE_SERVICE_KEY || '';

export async function GET() {
  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    config: {
      CARRIER_PULSE_API_URL: CARRIER_PULSE_BACKEND,
      CARRIER_PULSE_SERVICE_KEY_set: !!process.env.CARRIER_PULSE_SERVICE_KEY,
      CARRIER_PULSE_SERVICE_KEY_length: CARRIER_PULSE_SERVICE_KEY.length,
    },
  };

  // Test 1: No auth (baseline — expect 401)
  try {
    const res = await fetch(`${CARRIER_PULSE_BACKEND}/api/brands`, {
      headers: { 'Content-Type': 'application/json' },
    });
    results.test_no_auth = { status: res.status };
  } catch (err) {
    results.test_no_auth = { error: err instanceof Error ? err.message : 'Failed' };
  }

  // Test 2: X-Service-Key header only
  try {
    const res = await fetch(`${CARRIER_PULSE_BACKEND}/api/brands`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Service-Key': CARRIER_PULSE_SERVICE_KEY,
      },
    });
    results.test_x_service_key = { status: res.status };
  } catch (err) {
    results.test_x_service_key = { error: err instanceof Error ? err.message : 'Failed' };
  }

  // Test 3: Raw service key as Bearer token
  try {
    const res = await fetch(`${CARRIER_PULSE_BACKEND}/api/brands`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CARRIER_PULSE_SERVICE_KEY}`,
      },
    });
    results.test_raw_bearer = { status: res.status };
  } catch (err) {
    results.test_raw_bearer = { error: err instanceof Error ? err.message : 'Failed' };
  }

  // Test 4: JWT signed with service key (HS256)
  try {
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

    const res = await fetch(`${CARRIER_PULSE_BACKEND}/api/brands`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
    });
    results.test_signed_jwt = { status: res.status };
  } catch (err) {
    results.test_signed_jwt = { error: err instanceof Error ? err.message : 'Failed' };
  }

  // Test 5: JWT + X-Service-Key together
  try {
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

    const res = await fetch(`${CARRIER_PULSE_BACKEND}/api/brands`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
        'X-Service-Key': CARRIER_PULSE_SERVICE_KEY,
      },
    });
    results.test_jwt_plus_service_key = { status: res.status };
  } catch (err) {
    results.test_jwt_plus_service_key = { error: err instanceof Error ? err.message : 'Failed' };
  }

  return NextResponse.json(results);
}
