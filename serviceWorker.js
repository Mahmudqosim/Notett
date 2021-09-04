self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("static").then((cache) => {
      return cache.addAll([
        "./",
        "./js/main.js",
        "./css/main.css",
        "./css/normalize.css",
        "./js/App.js",
        "./js/NotesAPI.js",
        "./js/NotesView.js",
        "./js/RandomID.js",
        "./icons/github.svg",
        "./icons/menu.svg",
        "./icons/save.svg",
        "./icons/trash.svg",
        "./icons/favicon.png",
        "./icons/icon512.png",
        "./icons/logo192.png",
      ])
    })
  )
})

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request)
    })
  )
})
