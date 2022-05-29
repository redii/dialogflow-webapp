<script>
    import { Row, Col } from "sveltestrap"
    import ChatBot from "./ChatBot.svelte"
</script>

<!-- prettier-ignore -->
<main>
    <Row>
        <Col md={6}>
            <ChatBot
                botType="default"
                botName="Philipp Meier"
                botStatus="Dekan der Fakultät Maschinenbau"
                fontFamily="Times New Roman"
                fontSize="14px"
                headerBackgroundColor="lightgrey"
                chatBackgroundColor="lightgrey"
                fontColorBot="lightgrey"
                fontColorUser="lightgrey"
                bubbleColorBot="black"
                bubbleColorUser="#363b3f" />
        </Col>
        <Col md={6}>
            <ChatBot
                botType="inclusive"
                botName="Anushka"
                botImage="https://i.ibb.co/hgXR1qq/anushka.png"
                fontFamily="Arial"
                fontSize="20px"
                fontColorBot="black"
                fontColorUser="black"
                bubbleColorBot="#bccee1"
                bubbleColorUser="#b0efb0" />
        </Col>
    </Row>
</main>

<style>
    main {
        max-width: 1200px;
        margin: 0 auto;
    }
</style>
