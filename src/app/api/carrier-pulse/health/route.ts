import { NextResponse } from 'next/server';

const CARRIER_PULSE_BACKEND = process.env.CARRIER_PULSE_API_URL || 'http://localhost:8000';
const CARRIER_PULSE_SERVICE_KEY = process.env.CARRIER_PULSE_SERVICE_KEY || '';

export async function GET() {
  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
  };

  // Fetch the full OpenAPI spec to understand auth
  try {
    const res = await fetch(`${CARRIER_PULSE_BACKEND}/openapi.json`);
    const spec = await res.json();

    // Extract auth-related info
    results.security_schemes = spec.components?.securitySchemes || 'none';
    results.login_schema = spec.components?.schemas?.LoginRequest || 'not found';
    results.login_response = spec.components?.schemas?.TokenResponse ||
      spec.components?.schemas?.LoginResponse ||
      spec.components?.schemas?.Token || 'not found';

    // Get auth-related paths
    const authPaths: Record<string, unknown> = {};
    for (const [path, methods] of Object.entries(spec.paths || {})) {
      if (path.includes('auth') || path.includes('token') || path.includes('login')) {
        authPaths[path] = methods;
      }
    }
    results.auth_endpoints = authPaths;

    // Get security requirements on /api/brands
    results.brands_endpoint = spec.paths?.['/api/brands'] || 'not found';

    // List all schemas for reference
    results.all_schema_names = Object.keys(spec.components?.schemas || {});
  } catch (err) {
    results.openapi_error = err instanceof Error ? err.message : 'Failed';
  }

  // Try login with service key as password
  try {
    const res = await fetch(`${CARRIER_PULSE_BACKEND}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'service@irie-wireless.com',
        password: CARRIER_PULSE_SERVICE_KEY,
      }),
    });
    const body = await res.text();
    results.login_service_account = { status: res.status, body: body.substring(0, 300) };
  } catch (err) {
    results.login_service_account = { error: err instanceof Error ? err.message : 'Failed' };
  }

  return NextResponse.json(results);
}
