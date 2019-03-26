<template>
  <li class="msg-preview" :title="(chat.trip)? chat.trip.title: chattingWith[0]">
    <div class="user-img-container">
      <div
        class="user-img"
        v-for="(pic) in profilePics"
        :key="pic"
        :style="{'background-image': `url(${pic})`}"
      />
    </div>
    <div
      class="msg-content"
    >
      <h4 v-if="!chat.trip">{{`${user.firstname} ${user.lastname}`}}</h4>
      <h4 v-else>{{chat.trip.title}}</h4>
      <div v-if="lastMsg">{{lastSender}}&nbsp;{{lastMsg.txt}}</div>
    </div>
    <span v-if="lastMsg" class="sent-at">
      {{lastMsg.sentAt | fromNow}}
    </span>
  </li>
</template>

<script>
export default {
  props: {
    chat: {
      type: Object,
      required: true
    },
    user: {
        type: Object,
        required: true,
    }
  },
  computed: {
    chattingWith() {
      console.log(this.chat);
      return this.chat.users.filter(otherUser => otherUser._id !== this.user._id);
    },
    profilePics() {
      return this.chattingWith.map(user => user.profilePic).slice(0,3);
    },
    lastMsg() {
      if (!this.chat.msgs.length) return '';
      return this.chat.msgs[this.chat.msgs.length - 1];
    },
    lastSender() {
      if (!this.lastMsg) return '';
      const senderId = this.lastMsg.sender;
      if (senderId === this.user._id) return 'You:';
      else if(this.chattingWith.length) return this.chattingWith.find(user => user._id === senderId).firstname + ':';
      else return '';
      
    }
  }
};
</script>

<style>
</style>
