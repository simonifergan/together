<template>
  <aside class="chat-box" @click="focusInput">
    <header>
      <div
        class="user-img"
        v-for="user in chattingWith"
        :key="user._id+user.firstname"
        :style="{ backgroundImage: `url('${user.profilePic}')` }"
        :title="user.firstname"
      />
      <span v-for="(user, index) in chattingWith" :key="user._id+index">{{`${user.firstname} ${user.lastname}`}}</span>
      <button :class="{'is-focused': isFocused}">
        <i class="fas fa-times"></i>
      </button>
    </header>
    <ul>
      <li
        :class="{'not-user': (msg.sender !== loggedUser._id)}"
        v-for="(msg, index) in msgs"
        :key="index"
      >{{msg.txt}}</li>
    </ul>
    <form @submit.prevent="send">
      <input
        ref="msgbox"
        v-model="newMsg"
        placeholder="Type a message..."
        autofocus
        @blur="isFocused = false"
      >
      <button title="Send message" type="submit" :class="{'is-focused': isFocused}"><i class="fas fa-paper-plane"></i></button>
    </form>
  </aside>
</template>

<script>
export default {
  props: ["chat"],
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

<style>
</style>
