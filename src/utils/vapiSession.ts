export async function createVapiSession(assistantId: string, userId?: string, sessionMeta?: Record<string, any>) {
  const r = await fetch('/api/vapi/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ assistantId, userId, sessionMeta }),
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(text || `Failed to create Vapi session: ${r.status}`);
  }
  return r.json();
}