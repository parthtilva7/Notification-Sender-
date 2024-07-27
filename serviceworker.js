const nameOfCache = "cacheStorage3";
self.addEventListener("install", function (event) {
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(nameOfCache)
      .then(function (cache) {
        cache.add("/index.html");
        cache.add("/style.css");
        cache.add("/script.js");
      })
      .catch(function (error) {
        console.log("Cache not found:", error);
      })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(clients.claim());
  event.waitUntil(
    caches.keys().then(function (cacheBundle) {
      cacheBundle.forEach(function (item) {
        if (item !== nameOfCache) {
          caches.delete(item);
        }
      });
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.open(nameOfCache).then(function (cache) {
      return cache.match(event.request).then(function (cachedResponse) {
        var responseFetched = fetch(event.request).then(function (
          networkResponse
        ) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        return cachedResponse || responseFetched;
      });
    })
  );
});
self.addEventListener("notificationclick", function (event) {
  const clickedNotification = event.notification;
  const action = event.action;

  let message;

  if (action === "agree") {
    message = "So we both agree on that";
  } else if (action === "disagree") {
    message = "Let's agree to disagree";
  }

  clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({ type: "notificationClick", message: message });
    });
  });

  clickedNotification.close();
});
