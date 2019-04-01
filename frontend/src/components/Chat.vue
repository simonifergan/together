<template>
  <aside class="chat-box" @click="focusInput" v-if="chat && chat.isActive">
    <header>
       <button class="mobile-btn-back" @click.stop="closeChat">
        <i class="fas fa-less-than"></i>
      </button>
      <div class="user-img-container">
        <div
          class="user-img"
          v-for="(user, idx) in chattingWith"
          :key="idx + user._id+ idx * 7"
          :style="{ backgroundImage: `url('${user.profilePic}')` }"
          :title="(user.firstname)? user.firstname: ''"
        />
      </div>
      <span
        v-show="!chat.trip"
        v-for="(user, index) in chattingWith"
        :key="user._id+index"
      >{{`${user.firstname} ${user.lastname}`}}</span>
      <span v-if="chat.trip">{{chat.trip.title}}</span>
      <button class="btn-close-chat" :class="{'is-focused': isFocused}" @click.stop="closeChat">
        <i class="fas fa-times"></i>
      </button>
    </header>
    <ul ref="msgsBlock">
      <li
        v-for="(msg, index) in msgs"
        :key="index">
          <div @click.stop="" class="sender" v-show="msg.sender && msg.sender !== loggedUser._id && chattingWith.length > 1">{{msg.sender | msgSender(chat.users)}}</div>
          <div @click.stop="" v-if="!msg.sender" class="general-msg">{{msg.txt}}</div>
          <div @click.stop="" v-else :class="{'not-user': (msg.sender !== loggedUser._id)}" class="txt-container">
            <span>{{msg.txt}}</span>
          </div>
      </li>
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
    }
  },
  methods: {
    closeChat() {
      this.$store.commit({ type: "closeChat", chatId: this.chat._id });
    },
    send() {
      this.$store.dispatch({
        type: "socketSendMsg",
        msg: { txt: this.newMsg, sentAt: Date.now(), isRead: false },
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
      this.$nextTick(() => {
        if (!this.$refs.msgsBlock || !this.$refs.msgsBlock.children.length) return;
        let msgs = this.$refs.msgsBlock.children;
        if (!msgs) return;
        this.$refs.msgsBlock.scrollTo({
          top: msgs[msgs.length - 1].offsetTop,
          bottom: 0,
          behavior: "auto"
        });
      });
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
    },
    $route: {
      deep: true,
      handler() {
        if (this.chat && this.chat.isActive) this.scrollToBottom();
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
