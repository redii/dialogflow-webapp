import App from "./App.svelte"
import DefaultBot from "./DefaultBot.svelte"
import InclusiveBot from "./InclusiveBot.svelte"

const app = new App({
    target: document.getElementById("home"),
})

const defaultBot = new DefaultBot({
    target: document.getElementById("default-bot"),
})

const inclusiveBot = new InclusiveBot({
    target: document.getElementById("inclusive-bot"),
})

export default app
