self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("notett").then((cache) => {
      return cache.addAll([
        "./",
        "./index.html",
        "./js/main.js",
        "./css/main.css",
        "./js/App.js",
        "./js/RandomID.js",
        "./js/NotesView.js",
        "./js/NotesAPI.js",
        "./icons/github.svg",
        "./icons/menu.svg",
        "./icons/save.svg",
        "./icons/trash.svg",
        "./icons/cog.svg",
        "./icons/favicon.png",
        "./icons/icon512.png",
        "./icons/logo192.png",
      ])
    })
  )
})

self.addEventListener("fetch", (e) => {
  e.respondWith(
    (async () => {
      const r = await caches.match(e.request)
      // console.log(`[Service Worker] Fetching resource: ${e.request.url}`)
      if (r) {
        return r
      }
      const response = await fetch(e.request)
      const cache = await caches.open('notett')
      // console.log(`[Service Worker] Caching new resource: ${e.request.url}`)
      cache.put(e.request, response.clone())
      return response
    })()
  )
})
