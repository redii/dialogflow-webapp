<script>
    import queryString from "query-string"

    import { Row, Col } from "sveltestrap"
    import ChatBot from "./ChatBot.svelte"

    const bot = queryString.parse(location.search).bot
</script>

<main>
    <Row>
        <Col md={{ size: 6, offset: 3 }}>
            {#if bot === "1"}
                <ChatBot
                    botType="default"
                    botName="Dr. Franz Zweistein"
                    botImage="https://i.ibb.co/k4NF2wv/max.jpg"
                    startMessage="Hallo 👋🏻"
                    typingWithName={false}
                    fontFamily="Times New Roman"
                    fontSize="14px"
                    headerBackgroundColor="lightgrey"
                    chatBackgroundColor="lightgrey"
                    fontColorBot="lightgrey"
                    fontColorUser="lightgrey"
                    bubbleColorBot="black"
                    bubbleColorUser="#363b3f"
                />
            {:else if bot === "2"}
                <ChatBot
                    botType="inclusive"
                    botName="Aylin"
                    botImage="https://i.ibb.co/5L02hP2/aylin.jpg"
                    fontFamily="Arial"
                    fontSize="20px"
                    fontColorBot="black"
                    fontColorUser="black"
                    bubbleColorBot="#bccee1"
                    bubbleColorUser="#b0efb0"
                />
            {:else}
                <h1>Chatbots</h1>
                <a href="/dialogflow-webapp/?bot=default">Default ChatBot</a>
                <br />
                <a href="/dialogflow-webapp/?bot=inclusive">
                    Inclusive ChatBot
                </a>
            {/if}
        </Col>
    </Row>
</main>

<style>
    main {
        max-width: 1200px;
        margin: 0 auto;
    }
</style>
