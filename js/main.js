import App from "./App.js"

const root = document.querySelector("#app")
const app = new App(root)

if("serviceWorker" in navigator) {
    navigator.serviceWorker.register('/serviceWorker.js').then(registration => {
        console.log('Service Worker Registered', registration)
    }).catch(err => {
        console.log('Service Worker Registration Failed!', err)
    })
}


