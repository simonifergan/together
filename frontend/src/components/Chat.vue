<template>
    <aside class="chat">
        <div v-if="chatId">{{chatId}}</div>

    </aside>
</template>

<script>
export default {
    props: {
        chatId: {
            type: Number,
            // required: true,
        }
    }
}
</script>

<style>

</style>
