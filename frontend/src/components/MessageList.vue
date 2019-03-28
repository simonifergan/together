<template>
  <ul class="msgs-dropdown">
    <header>
      <!-- TODO: 2 buttons for group chats -->
    </header>
    <!-- v-show="chat.msgs.length" -->
    <message-preview
      v-for="(chat, index) in chats"
      :chat="chat"
      :key="chat._id + index + 3"
      :user="user"
      @click.native="initChat(chat._id)"
    />
    <footer v-if="!isExpanded">
      <router-link to="/messages">See all messages</router-link>
    </footer>
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
    isExpanded() {
      return (this.$route.path === '/messages')
    },
  },
  methods: {
    initChat(chatId) {
      if (this.isExpanded) {
        this.$emit('changeChat', chatId);
      } else this.$store.dispatch({ type: "activateChat", chatId });
    }
  }
};
</script>

<style>
</style>
