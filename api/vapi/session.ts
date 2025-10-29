// @ts-nocheck
// Vercel Serverless Function: Create Vapi session for WebRTC
export default async function handler(req, res) {
  try {
    const apiKey = process.env.VAPI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing VAPI_API_KEY in environment' });
    }

    const body = req.body
      ? (typeof req.body === 'string' ? JSON.parse(req.body) : req.body)
      : {};

    const { assistantId, userId, sessionMeta } = body || {};

    const r = await fetch('https://api.vapi.ai/v1/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assistantId,
        userId,
        sessionMeta,
        transport: 'webrtc',
      }),
    });

    const json = await r.json();
    if (!r.ok) {
      return res.status(r.status).json(json);
    }
    return res.status(200).json(json);
  } catch (e) {
    return res.status(500).json({ error: 'Unexpected error', details: String(e) });
  }
}