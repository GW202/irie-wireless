import { NextResponse } from 'next/server';

const CARRIER_PULSE_BACKEND = process.env.CARRIER_PULSE_API_URL || 'http://localhost:8000';

export async function GET() {
  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
  };

  // Fetch OpenAPI spec to find user creation endpoints
  try {
    const res = await fetch(`${CARRIER_PULSE_BACKEND}/openapi.json`);
    const spec = await res.json();

    // Extract user/auth related paths
    const relevantPaths: Record<string, unknown> = {};
    for (const [path, methods] of Object.entries(spec.paths || {})) {
      if (path.includes('user') || path.includes('auth') || path.includes('register')) {
        relevantPaths[path] = methods;
      }
    }
    results.user_auth_endpoints = relevantPaths;

    // Get user-related schemas
    const userSchemas: Record<string, unknown> = {};
    for (const [name, schema] of Object.entries(spec.components?.schemas || {})) {
      if (name.toLowerCase().includes('user') || name === 'LoginRequest') {
        userSchemas[name] = schema;
      }
    }
    results.user_schemas = userSchemas;
  } catch (err) {
    results.error = err instanceof Error ? err.message : 'Failed';
  }

  // Try creating a user without auth (some backends allow first-user creation)
  try {
    const res = await fetch(`${CARRIER_PULSE_BACKEND}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'service@irie-wireless.com',
        password: 'test',
        name: 'test',
        role: 'admin',
      }),
    });
    const body = await res.text();
    results.create_user_no_auth = { status: res.status, body: body.substring(0, 300) };
  } catch (err) {
    results.create_user_no_auth = { error: err instanceof Error ? err.message : 'Failed' };
  }

  return NextResponse.json(results);
}
