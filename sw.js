// Service Worker بسيط لمتجر البستان
// الهدف الحالي: تفعيل خاصية "تثبيت كتطبيق". بدون تخزين مؤقت معقد،
// عشان المنتجات (من Google Sheet) تضل تتحدث دايمًا بدون أي تأخير.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
