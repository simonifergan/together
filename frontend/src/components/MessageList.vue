<template>
  <ul class="msgs-dropdown">
    <header/>
    <!-- v-show="chat.msgs.length" -->
    <message-preview
      v-for="(chat, index) in sortedChats"
      :chat="chat"
      :key="chat._id + index + 3"
      :user="user"
      @click.native="initChat(chat._id)"
    />
    <footer v-if="!isExpanded">
      <router-link v-if="chats.length" to="/messages">See all messages</router-link>
      <p v-else>No messages</p>
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
      return (this.$route.path === '/messages');
    },
    sortedChats() {
      var copyChats = JSON.parse(JSON.stringify(this.chats));
      if (!copyChats.length) return [];
      copyChats = copyChats.filter(chat => chat.msgs.length);
      return copyChats.sort((chatA,chatB) => {
                const lastMsgA = (chatA.msgs.length && chatA.msgs[chatA.msgs.length -1])? chatA.msgs[chatA.msgs.length -1].sentAt : -1;
                const lastMsgB = (chatB.msgs.length && chatB.msgs[chatB.msgs.length -1])? chatB.msgs[chatB.msgs.length -1].sentAt : -1;
                return lastMsgB - lastMsgA;
            });
    }
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
