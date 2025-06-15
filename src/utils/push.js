import { API_BASE_URL } from '../config';

export async function subscribeToPush(projectId) {
  if (!('serviceWorker' in navigator)) return console.warn('❌ No service worker support');
  if (!('PushManager' in window)) return console.warn('❌ No push support');

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.warn('❌ Notification permission denied');
    return;
  }

  const reg = await navigator.serviceWorker.register('/sw.js');
  console.log('📦 Service Worker registered');

  const { key } = await fetch(`${API_BASE_URL}/vapid-key`).then(r => r.json());

  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(key)
  });

  await fetch(`${API_BASE_URL}/projects/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      project_id: projectId,
      endpoint: sub.endpoint,
      keys: sub.toJSON().keys
    })
  });

  console.log('📬 Subscribed to push notifications');
}

// helper
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  return Uint8Array.from([...raw].map(char => char.charCodeAt(0)));
}
