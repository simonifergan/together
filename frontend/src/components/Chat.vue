<template>
  <aside class="chat-box" @click="focusInput" v-if="chat.isActive">
    <header>
      <div
        class="user-img"
        v-for="user in chattingWith"
        :key="user._id+user.firstname"
        :style="profilePic"
        :title="user.firstname"
      />
      <span
        v-show="chattingWith.length < 2"
        v-for="(user, index) in chattingWith"
        :key="user._id+index"
      >{{`${user.firstname} ${user.lastname}`}}</span>
      <span v-show="chattingWith.length > 2 && chat.trip">{{chat.trip.title}}</span>
      <button :class="{'is-focused': isFocused}" @click.stop="closeChat">
        <i class="fas fa-times"></i>
      </button>
    </header>
    <ul ref="msgsBlock">
      <li
        :class="{'not-user': (msg.sender !== loggedUser._id)}"
        v-for="(msg, index) in msgs"
        :key="index"
      ><span>{{msg.txt}}</span></li>
    </ul>
    <form @submit.prevent="send">
      <input
        ref="msgbox"
        v-model="newMsg"
        placeholder="Type a message..."
        @blur="isFocused = false"
      >
      <button title="Send message" type="submit" :class="{'is-focused': isFocused}">
        <i class="fas fa-paper-plane"></i>
      </button>
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
    profilePic() {
      let picUrl = this.chattingWith[0].profilePic;
      return { backgroundImage: `url('${picUrl}')` };
    },
   
  },
  methods: {
    closeChat() {
      this.$store.commit({ type: "closeChat", chatId: this.chat._id });
    },
    send() {
      this.$store.dispatch({
        type: "socketSendMsg",
        msg: { txt: this.newMsg, sentAt: Date.now() },
        chatId: this.chat._id,
        recipients: this.chat.users
      });
      this.newMsg = "";
    },
    focusInput() {
      this.isFocused = true;
      this.$refs.msgbox.focus();
    },
    scrollToBottom() {
      this.$nextTick( () => {

          let msgs = this.$refs.msgsBlock.children;
          this.$refs.msgsBlock.scrollTo({
            top: msgs[msgs.length - 1].offsetTop,
            bottom: 0,
            behavior: 'smooth',
          })
        })
    }
  },
  updated() {
    if (this.chat.isActive) {
      this.scrollToBottom();
    }
  },
  watch: {
    chat: {
      deep: true,
      handler(newVal) {
        if (newVal.isActive) this.scrollToBottom();
      }
    }
  }
  // watch: {
  //   msgs: {
  //     handler(newVal, oldVal) {
  //       this.scrollToBottom();
  //     },
  //     deep: true,
  //   }
  // },
};
</script>

<style>
</style>
