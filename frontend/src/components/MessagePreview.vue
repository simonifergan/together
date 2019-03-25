<template>
  <li class="msg-preview" >
    <div
      class="user-img"
      v-for="(pic, idx) in profilePics"
      :key="pic"
      :style="{'background-image': `url(${pic})`}"
      :title="chattingWith[idx].firstname"
    />
    <div
      class="msg-content"
      v-for="(user, index) in chattingWith"
      :key="user._id+index"
    >
      <h4>{{`${user.firstname} ${user.lastname}`}}</h4>
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
      return this.chat.users.filter(otherUser => otherUser._id !== this.user._id);
    },
    profilePics() {
      return this.chattingWith.map(user => user.profilePic);
    },
    lastMsg() {
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
