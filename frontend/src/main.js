import App from "./App.svelte"
import DefaultBot from "./DefaultBot.svelte"
import InclusiveBot from "./InclusiveBot.svelte"

export const app = new App({
    target: document.getElementById("home"),
})
export const bot1 = new DefaultBot({
    target: document.getElementById("default-bot"),
})
export const bot2 = new InclusiveBot({
    target: document.getElementById("inclusive-bot"),
})
