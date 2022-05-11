<script>
    import { Row, Col } from "sveltestrap"
    import Chat from "./Chat.svelte"
</script>

<main>
    <Row>
        <Col>
            <Chat />
        </Col>
    </Row>
</main>

<style>
    main {
        padding: 2em;
        max-width: 1200px;
        margin: 0 auto;
    }
</style>
