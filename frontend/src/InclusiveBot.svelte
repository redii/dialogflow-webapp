<script>
    import ChatBot from "./ChatBot.svelte"
</script>

<main>
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
</main>

<style>
    main {
        max-width: 1200px;
        margin: 0 auto;
    }
</style>
