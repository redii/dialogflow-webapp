<script>
    import ChatBot from "./ChatBot.svelte"
</script>

<main>
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
</main>

<style>
    main {
        max-width: 1200px;
        margin: 0 auto;
    }
</style>
