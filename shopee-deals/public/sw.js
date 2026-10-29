/*
 * Kill-switch service worker.
 *
 * Trang web cũ (Vite PWA) đăng ký một Workbox service worker tại đúng đường
 * dẫn /sw.js này. Trình duyệt giữ worker cũ sống mãi vì update check chỉ thành
 * công khi URL này trả về một script hợp lệ — sau khi rewrite sang Next.js,
 * URL này 404 nên worker cũ không bao giờ tự xoá được, và vẫn chặn toàn bộ
 * request trong scope / (shell cũ, cache rác kể cả ảnh banner).
 *
 * File này thay thế worker cũ: khi browser update check nhận được nó,
 * worker mới skipWaiting -> activate xoá TOÀN BỘ caches cũ, unregister,
 * rồi reload các tab đang mở để hiển thị site mới sạch.
 */

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(names.map((name) => caches.delete(name)));

      const clients = await self.clients.matchAll({ type: "window" });
      await self.registration.unregister();

      await Promise.all(
        clients.map((client) => {
          try {
            return client.navigate(client.url);
          } catch {
            return Promise.resolve();
          }
        }),
      );
    })(),
  );
});
