import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const channel = String(body?.channel || '');
    const event = String(body?.event || '');
    const payload = body?.payload;

    if (!channel || event !== 'update-cart' || !payload?.items?.length) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    await pusher.trigger(channel, 'cart-updated', payload);
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to publish cart update' });
  }
}
