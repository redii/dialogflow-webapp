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
                botImage="https://i.ibb.co/k4NF2wv/max.jpg"
                typingWithName={false}
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
                botName="Aylin"
                botImage="https://i.ibb.co/5L02hP2/aylin.jpg"
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
