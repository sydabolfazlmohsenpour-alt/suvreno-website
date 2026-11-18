/* Service Worker پنل ادمین Suvreno — فقط برای نمایش و کلیک روی اعلان‌های سیستم
   کنار فایل panel-admin6290.html و در همان پوشه آپلود شود. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const d = e.notification.data || {};
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
    for (const c of list) { if ("focus" in c) { c.postMessage({ go: d.go }); return c.focus(); } }
    return self.clients.openWindow((d.url || self.registration.scope) + (d.go ? "#" + d.go : ""));
  }));
});
