<script>
    import { Row, Col } from "sveltestrap"
</script>

<main>
    <Row>
        <Col md={{ size: 6, offset: 3 }}>
            <h1>Chatbots</h1>
            <a href="/dialogflow-webapp/chatbot-1.html">Default ChatBot</a>
            <br />
            <a href="/dialogflow-webapp/chatbot-2.html">Inclusive ChatBot</a>
        </Col>
    </Row>
</main>

<style>
    main {
        max-width: 1200px;
        margin: 0 auto;
    }
</style>
