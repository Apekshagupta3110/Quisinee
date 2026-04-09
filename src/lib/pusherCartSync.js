import Pusher from 'pusher-js';

const PUSHER_KEY = import.meta.env.VITE_PUSHER_KEY;
const PUSHER_CLUSTER = import.meta.env.VITE_PUSHER_CLUSTER;
const PUSHER_FORCE_TLS = import.meta.env.VITE_PUSHER_FORCE_TLS !== 'false';
const PUSHER_ENDPOINT = import.meta.env.VITE_PUSHER_UPDATE_ENDPOINT || '/api/pusher/update-cart';

let pusherClient = null;

const getPusherClient = () => {
  if (!PUSHER_KEY || !PUSHER_CLUSTER) return null;
  if (pusherClient) return pusherClient;
  pusherClient = new Pusher(PUSHER_KEY, {
    cluster: PUSHER_CLUSTER,
    forceTLS: PUSHER_FORCE_TLS,
  });
  return pusherClient;
};

export const subscribeToTableCartChannel = (channelName, onCartUpdated) => {
  const client = getPusherClient();
  if (!client || !channelName) return () => {};
  const channel = client.subscribe(channelName);
  channel.bind('cart-updated', onCartUpdated);
  return () => {
    channel.unbind('cart-updated', onCartUpdated);
    client.unsubscribe(channelName);
  };
};

export const publishTableCartUpdate = async (channelName, payload) => {
  if (!channelName || !payload?.items?.length) return;
  try {
    await fetch(PUSHER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channel: channelName,
        event: 'update-cart',
        payload,
      }),
    });
  } catch (error) {
    // Silent fail so local cart always remains functional without backend sync.
  }
};
