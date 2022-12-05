<!-- prettier-ignore -->
<script>
    import ky from "ky"
    import { v4 as uuid } from 'uuid'

    export let
        apiUrl = "http://localhost:3000",
        botType = "dev",
        botName = "Max Mustermann",
        botStatus = "Online",
        botImage = "https://i.ibb.co/d29TyqJ/man-wearing-headset-giving-online-chat-support-attractive-unshaven-young-offering-client-services-he.jpg",
        startMessage = "Hallo 👋",
        typingTime = 500,
        typingWithName = true,
        fontFamily = "Helvetica",
        fontSize = "16px",
        fontWeight = "inherit",
        fontColorBot = "black",
        fontColorUser = "black",
        bubbleColorBot = "lightgrey",
        bubbleColorUser = "lightgreen",
        headerBackgroundColor = "white",
        chatBackgroundColor = "white"

    const uid = uuid()
    let botTyping = false
    let messages = []
    let input = ""

    function sendMessage(query) {
        if (!query || botTyping) return
        input = ""

        messages = [
            ...messages,
            {
                uid: uuid(),
                user: "You",
                text: query,
            },
        ]

        botTyping = true
        setTimeout(async () => {
            const response = await ky.get(`/chatbots?bot=${botType}&query=${query}`).json()
            let msg = response.queryResult.fulfillmentText

            // check for responses
            let responses = []
            if (msg.split("responses=").length > 1) {
                responses = msg.split("responses=")[1].split(";")
                msg = msg.split("responses=")[0]
            }

            // check for videos
            let videos = []
            if (msg.split("youtube=").length > 1) {
                videos = msg.split("youtube=")[1].split(";")
                msg = msg.split("youtube=")[0]
            }

            messages = [
                ...messages,
                {
                    uid: uuid(),
                    user: botName,
                    text: msg,
                    videos: videos.length ? videos : false,
                    responses: responses.length ? responses : false
                },
            ]

            botTyping = false
        }, typingTime)
    }

    function textareaEnter(event) {
        if (event.key === "Enter") {
            event.preventDefault()
            sendMessage(input)
        }
    }
</script>

<!-- prettier-ignore -->
<div
    id={uid}
    class="chat"
    style="
        --font-family: {fontFamily};
        --font-size: {fontSize};
        --font-weight: {fontWeight};
        --font-color-bot: {fontColorBot};
        --font-color-user: {fontColorUser};
        --bubble-color-bot: {bubbleColorBot};
        --bubble-color-user: {bubbleColorUser};
        --header-background-color: {headerBackgroundColor};
        --chat-background-color: {chatBackgroundColor};"
>
    <div class="chat-header">
        <div class="chat-header-image">
            <img src={botImage} alt={botName} />
        </div>
        <div class="chat-header-content">
            <div class="chat-header-name">{botName}</div>
            <div class="chat-header-info">{botStatus}</div>
        </div>
    </div>
    <div class="chat-content-wrapper">
        <div class="chat-content">
            {#each messages as msg}
                <div class="chat-message-wrapper">
                    <div class={["chat-message", msg.user === botName ? "bot" : "user"].join(" ")}>
                        <div class="chat-message-name">
                            <span>{msg.user}</span>:
                        </div>
                        <div class="chat-message-text">
                            <pre>
                                {msg.text.trim()}
                            </pre>
                        </div>
                        {#if msg.videos}
                            {#each msg.videos as videoID}
                                <br/>
                                <iframe
                                    title="YouTube Video"
                                    width={300}
                                    height={200}
                                    src={`https://www.youtube.com/embed/${videoID}`}
                                />
                            {/each}
                        {/if}
                    </div>
                </div>
                {#if msg.responses && msg.uid === messages.slice(-1)[0].uid}
                    {#each msg.responses as response}
                        <button class="chat-response" on:click={() => sendMessage(response)}>{response}</button>
                    {/each}
                {/if}
            {/each}
            {#if !messages.length}
                <button class="chat-response" on:click={() => sendMessage(startMessage)}>{startMessage}</button>
            {/if}
            {#if botTyping}
                <div class="chat-message-wrapper">
                    <div class="chat-message bot">
                        <span>&nbsp;&nbsp;{typingWithName ? `${botName} tippt...` : "..."}&nbsp;&nbsp;</span>
                    </div>
                </div>
            {/if}
        </div>
    </div>
    <div class="chat-footer">
        <textarea
            class="chat-input focus:outline-0"
            bind:value={input}
            on:keydown={textareaEnter}
        />
        <button
            class="chat-submit bg-gray-100"
            on:click={() => sendMessage(input)}
            disabled={botTyping}>
            <img src="https://i.ibb.co/fqwq9Y2/send.png" alt="Send" class="mx-auto" />
        </button>
    </div>
</div>

<style>
	@media (min-width: 767px) {
		.chat {
			max-width: 600px;
			height: 800px !important;
			margin-top: 6px !important;
		}

		.chat-content-wrapper {
			height: 580px !important;
		}
	}

	.chat {
		margin: 0 auto;
		position: relative;
		border: 2px solid black;
		border-radius: 16px;
		height: calc(100vh - 1em);
		font-family: var(--font-family);
	}

	.chat-header {
		border-bottom: 2px solid black;
		border-radius: 16px 16px 0 0;
		width: 100%;
		height: 120px;
		background-color: var(--header-background-color);
		overflow: auto;
		white-space: nowrap;
	}

	.chat-header-image {
		float: left;
		display: inline-block;
		height: 100%;
		margin: 0 1em;
	}

	.chat-header img {
		object-fit: cover;
		margin-top: 10px;
		height: 100px;
		width: 100px;
		border: 2px solid black;
		border-radius: 16px;
	}

	.chat-header-content {
		display: inline-block;
		padding: 1.5em 0.5em;
	}

	.chat-header-name {
		font-size: 1.6em;
	}

	.chat-header-info {
		font-size: 1em;
	}

	.chat-content-wrapper {
		height: calc(100% - 220px);
		overflow: auto;
		display: flex;
		flex-direction: column-reverse;
		background-color: var(--chat-background-color);
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
		padding: 1.5em;
		border-radius: 24px;
		font-size: var(--font-size);
		font-weight: var(--font-weight);
	}

	.chat-message.bot {
		float: left;
		color: var(--font-color-bot);
		background-color: var(--bubble-color-bot);
	}

	.chat-message.user {
		float: right;
		color: var(--font-color-user);
		background-color: var(--bubble-color-user);
	}

	.chat-message span {
		font-weight: bolder;
	}

	.chat-message pre {
		margin-bottom: 0;
		font-family: inherit;
		font-size: inherit;
		text-align: left;
		white-space: pre-line;
	}

	.chat-response {
		float: right;
		font-size: var(--font-size);
		padding: 0.75em;
		margin-left: 0.5em;
		margin-top: 0.5em;
		border: 1px solid black;
		border-radius: 16px;
	}

	.chat-typing {
		background-color: var(--bubble-color-bot);
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
		resize: none;
	}

	.chat-submit {
		float: left;
		width: 20%;
		height: 100%;
		border-radius: 0 0 16px 0;
		padding: 1.75em 0;
		text-align: center;
		border: none;
	}

	.chat-submit img {
		height: 100%;
	}

	:global([contenteditable="true"]:focus) {
		outline: none !important;
	}
</style>
