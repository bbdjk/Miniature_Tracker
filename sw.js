// 버전을 v2, v3 식으로 코드를 수정할 때마다 올려주시면 폰이 새 버전임을 인식합니다.
const CACHE_NAME = 'game-tracker-v3.2'; 
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 새로 추가된 부분: 옛날 버전(v1)의 기억을 지우고 새 버전(v2)으로 교체하는 역할
self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('오래된 캐시 삭제 중...', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((response) => {
      return response || fetch(evt.request);
    })
  );
});
