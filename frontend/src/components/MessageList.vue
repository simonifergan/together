<template>
  <ul class="msgs-dropdown">
    <message-preview
      v-for="(chat, index) in chats"
      :chat="chat"
      :key="chat._id + index + 3"
      :user="user"
      @click.native="initChat(chat._id)"
    />
  </ul>
</template>

<script>
import MessagePreview from "@/components/MessagePreview";

export default {
  props: {
    chats: {
      type: Array,
      required: true,
      default: () => {
        return [];
      }
    },
    user: {
      type: Object,
      required: true,
      default: () => {
        return {};
      }
    }
  },
  components: {
    MessagePreview
  },
  computed: {
  
  },
  methods: {
    initChat(chatId) {
      this.$store.dispatch({ type: "activateChat", chatId });
    }
  }
};
</script>

<style>
</style>
