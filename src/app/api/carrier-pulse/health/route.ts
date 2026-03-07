import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const CARRIER_PULSE_BACKEND = process.env.CARRIER_PULSE_API_URL || 'http://localhost:8000';
const CARRIER_PULSE_SERVICE_KEY = process.env.CARRIER_PULSE_SERVICE_KEY || '';

async function probe(url: string, options?: RequestInit) {
  try {
    const res = await fetch(url, { ...options, redirect: 'manual' });
    const body = await res.text();
    return { status: res.status, body: body.substring(0, 300) };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed' };
  }
}

export async function GET() {
  const base = CARRIER_PULSE_BACKEND;
  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    backend_url: base,
    service_key_length: CARRIER_PULSE_SERVICE_KEY.length,
  };

  // Probe common auth/discovery endpoints
  const endpoints = [
    '/api/health',
    '/api/auth/login',
    '/api/auth/token',
    '/api/token',
    '/api/login',
    '/api/auth/register',
    '/api/users/me',
    '/api/docs',
    '/docs',
    '/openapi.json',
    '/api/openapi.json',
  ];

  for (const ep of endpoints) {
    results[`GET ${ep}`] = await probe(`${base}${ep}`, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Try the 401 endpoint with detailed error body inspection
  results['GET /api/brands (no auth) detail'] = await probe(`${base}/api/brands`, {
    headers: { 'Content-Type': 'application/json' },
  });

  // Try POST /api/auth/login with dummy creds to see error format
  results['POST /api/auth/login'] = await probe(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'test', password: 'test' }),
  });

  results['POST /api/token'] = await probe(`${base}/api/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'test', password: 'test' }),
  });

  // Try form-encoded login (FastAPI OAuth2 pattern)
  results['POST /api/token (form)'] = await probe(`${base}/api/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'username=test&password=test',
  });

  results['POST /api/auth/token (form)'] = await probe(`${base}/api/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'username=test&password=test',
  });

  return NextResponse.json(results);
}
