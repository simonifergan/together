<template>
  <aside class="notification-container">
    
  </aside>
</template>

<script>
export default {
  props: {
      notification: {
          type: Array,
          required: true
      }
  },
  data() {
    return {
      newMsg: "",
      isFocused: false
    };
  },
  computed: {
    msgs() {
      return this.chat.msgs;
    },
    chattingWith() {
      return this.chat.users.filter(user => user._id !== this.loggedUser._id);
    },
    loggedUser() {
      return this.$store.getters.loggedUser;
    },
  },
  methods: {
    send() {
      this.$store.dispatch({
        type: "socketSendMsg",
        msg: { txt: this.newMsg, sentAt: Date.now() },
        chatId: this.chat._id
      });
      this.newMsg = '';
    },
    focusInput() {
      this.isFocused = true;
      this.$refs.msgbox.focus();
    }
  }
};
</script>