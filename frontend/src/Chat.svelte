<script>
    import { http } from "./utils/http"

    const bot = {
        name: "Max Mustermann",
        image: "https://i.ibb.co/d29TyqJ/man-wearing-headset-giving-online-chat-support-attractive-unshaven-young-offering-client-services-he.jpg",
        url: `http://localhost:3000`,
    }
    let botTyping = false
    let messages = []
    let input = ""

    function sendMessage() {
        if (!input) return
        const query = input
        input = ""

        messages = [
            ...messages,
            {
                user: "You",
                text: query,
            },
        ]

        setTimeout(async () => {
            botTyping = true

            const response = await http.get(`${bot.url}?query=${query}`).json()
            let msg = response.queryResult.fulfillmentText

            let video_url = false
            if (msg.match(/(?:https?|ftp):\/\/[\n\S]+/g)) {
                video_url = msg.match(/\bhttps?:\/\/\S+/gi)[0]
                msg = msg.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "")
            }

            messages = [
                ...messages,
                {
                    user: bot.name,
                    text: msg,
                    video: video_url ? video_url : false,
                },
            ]

            botTyping = false
        }, 500)
    }

    function textareaEnter(event) {
        if (event.key === "Enter") {
            event.preventDefault()
            sendMessage()
        }
    }
</script>

<div class="chat">
    <div class="chat-header">
        <div class="chat-header-image">
            <img src={bot.image} alt="Bot" />
        </div>
        <div class="chat-header-info">{bot.name}</div>
    </div>
    <div class="chat-content-wrapper">
        <div class="chat-content">
            {#each messages as msg}
                <div class="chat-message-wrapper">
                    <div
                        class={[
                            "chat-message",
                            msg.user === "You" ? "user" : "bot",
                        ].join(" ")}
                    >
                        <span>{msg.user}</span>:
                        <p>{msg.text}</p>
                        {#if msg.video}
                            <iframe
                                title="youtube-video"
                                width={300}
                                height={200}
                                src={msg.video}
                            />
                        {/if}
                    </div>
                </div>
            {/each}
            {#if botTyping}
                <div class="chat-message-wrapper">
                    <div class="chat-message bot">
                        <span>&nbsp;&nbsp;&nbsp;...&nbsp;&nbsp;&nbsp;</span>
                    </div>
                </div>
            {/if}
        </div>
    </div>
    <div class="chat-footer">
        <textarea
            class="chat-input"
            bind:value={input}
            on:keydown={textareaEnter}
        />
        <button class="chat-submit" on:click={sendMessage}>=></button>
    </div>
</div>

<style>
    .chat {
        position: relative;
        min-width: 400px;
        max-width: 600px;
        height: 800px;
        border: 2px solid black;
        border-radius: 16px;
    }

    .chat-header {
        border-bottom: 2px solid black;
        width: 100%;
        height: 100px;
    }

    .chat-header-image {
        float: left;
        height: 100%;
        margin: 0 1em;
    }

    .chat-header img {
        margin-top: 15px;
        height: 70px;
        width: 70px;
        border: 2px solid black;
        border-radius: 35px;
    }

    .chat-header-info {
        float: left;
        height: 100%;
        line-height: 100px;
        font-size: 1.6em;
    }

    .chat-content-wrapper {
        height: 600px;
        overflow: auto;
        display: flex;
        flex-direction: column-reverse;
    }

    .chat-content {
        width: 100%;
        padding: 1em;
    }

    .chat-message-wrapper {
        overflow: auto;
        width: 100%;
        margin-bottom: 1em;
    }

    .chat-message {
        padding: 1em;
        border-radius: 24px;
    }

    .chat-message.bot {
        float: left;
        background-color: lightgrey;
    }

    .chat-message.user {
        float: right;
        background-color: lightblue;
    }

    .chat-message span {
        font-weight: bold;
    }

    .chat-typing {
        background-color: lightgrey;
        padding: 1em;
        border-radius: 24px;
    }

    .chat-footer {
        width: 100%;
        height: 100px;
        border-top: 2px solid black;
        position: absolute;
        bottom: 0;
    }

    .chat-input {
        float: left;
        height: 100%;
        width: 80%;
        border: none;
        border-radius: 0 0 0 16px;
        border-right: 2px solid black;
        padding: 0.8em 1em;
        font-size: 1.2em;
    }

    .chat-submit {
        float: left;
        width: 20%;
        height: 100%;
        border-radius: 0 0 16px 0;
    }
</style>
